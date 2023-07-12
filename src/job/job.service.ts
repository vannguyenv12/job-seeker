import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Permission } from 'src/utils/check-permission';
import { Repository } from 'typeorm';
import { Job } from './job.entity';

@Injectable()
export class JobService {
  constructor(@InjectRepository(Job) private jobRepository: Repository<Job>) {}

  create(requestBody: Partial<Job>, currentUser: User) {
    const job = this.jobRepository.create(requestBody);
    job.user = currentUser;

    return this.jobRepository.save(job);
  }

  async get(id: string) {
    const job = await this.jobRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!job) {
      throw new BadRequestException('Job not found with id ' + id);
    }

    return job;
  }

  async findAll() {
    const jobList = await this.jobRepository.find({ relations: ['user'] });
    return jobList;
  }

  async update(id: string, requestBody: Partial<Job>, currentUser: User) {
    let job = await this.jobRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!job) {
      throw new BadRequestException(`No job with id: ${id}`);
    }

    Permission.check(currentUser, job.user.id);
    job = { ...job, ...requestBody };
    return this.jobRepository.save(job);
  }

  async delete(id: string, currentUser: User) {
    const job = await this.jobRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!job) {
      throw new BadRequestException(`No job with id: ${id}`);
    }

    Permission.check(currentUser, job.user.id);

    await this.jobRepository.remove(job);
    return { message: 'Post was deleted!' };
  }

  async getJobsByUserId(userId: number) {
    return this.jobRepository
      .createQueryBuilder('jobs')
      .leftJoinAndSelect('jobs.user', 'user')
      .where('jobs.user.id = :userId', { userId })
      .getMany();
  }
}
