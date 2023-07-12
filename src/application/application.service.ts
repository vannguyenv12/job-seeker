import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from './application.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { JobService } from 'src/job/job.service';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    private jobService: JobService,
  ) {}

  async create(jobId: number, currentUser: User) {
    const application = this.applicationRepository.create();

    const job = await this.jobService.get(`${jobId}`);
    application.job = job;
    application.user = currentUser;

    // TODO: implement upload cv

    return this.applicationRepository.save(application);
  }

  async findAll(options: IPaginationOptions) {
    // return this.applicationRepository.find({ relations: ['user', 'job'] });

    return paginate(this.applicationRepository, options, {
      relations: ['user', 'job'],
    });
  }

  async findAllByUserId(userId: number, options: IPaginationOptions) {
    const queryBuilder = this.applicationRepository
      .createQueryBuilder('applications')
      .leftJoinAndSelect('applications.user', 'user')
      .leftJoinAndSelect('applications.job', 'job')
      .where('applications.user.id = :userId', { userId });

    return paginate(queryBuilder, options);
  }

  async findAllByJobId(
    jobId: number,
    currentUser: User,
    options: IPaginationOptions,
  ) {
    const jobList = await this.jobService.getJobsByUserId(currentUser.id);
    const isMatch = jobList.some((job) => job.user.id === currentUser.id);
    if (!isMatch) {
      throw new ForbiddenException(
        'You do not have a permission to perform the action',
      );
    }

    const queryBuilder = this.applicationRepository
      .createQueryBuilder('applications')
      .leftJoinAndSelect('applications.user', 'user')
      .leftJoinAndSelect('applications.job', 'job')
      .where('applications.job.id = :jobId', { jobId });

    return paginate(queryBuilder, options);
  }

  async delete(userId: number, jobId: number) {
    const application = await this.applicationRepository
      .createQueryBuilder('applications')
      .leftJoinAndSelect('applications.user', 'user')
      .leftJoinAndSelect('applications.job', 'job')
      .where('applications.job.id = :jobId', { jobId })
      .andWhere('applications.user.id = :userId', { userId })
      .getOne();

    if (!application) {
      throw new NotFoundException(
        `Not found application with user id: ${userId} and job id: ${jobId}`,
      );
    }

    return this.applicationRepository.remove(application);
  }
}
