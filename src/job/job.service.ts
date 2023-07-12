import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Permission } from 'src/utils/check-permission';
import { ILike, Like, Repository } from 'typeorm';
import { Job } from './job.entity';
import { CompanyService } from 'src/company/company.service';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { PaginationDto } from './dtos/pagination.dto';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job) private jobRepository: Repository<Job>,
    private companyService: CompanyService,
  ) {}

  async create(
    requestBody: Partial<Job>,
    currentUser: User,
    companyName: string,
  ) {
    const job = this.jobRepository.create(requestBody);
    job.user = currentUser;

    const company = await this.companyService.findByName(companyName);
    if (!company) {
      throw new NotFoundException(`Company ${companyName} does not exist`);
    }

    job.company = company;

    return this.jobRepository.save(job);
  }

  async get(id: string) {
    const job = await this.jobRepository.findOne({
      where: { id },
      relations: ['user', 'company'],
    });

    if (!job) {
      throw new BadRequestException('Job not found with id ' + id);
    }

    return job;
  }

  async findAll(options: IPaginationOptions, title?: string, salary?: string) {
    const { operation, salaryMoney } = this.extractSalary(salary);

    const queryBuilder = this.jobRepository
      .createQueryBuilder('jobs')
      .leftJoinAndSelect('jobs.company', 'company')
      .leftJoinAndSelect('jobs.user', 'user')
      .andWhere('jobs.title LIKE :title', { title: `%${title}%` })
      .andWhere(`jobs.salary ${operation} :salaryMoney`, {
        salaryMoney,
      });

    return paginate<Job>(queryBuilder, options);
  }

  async update(
    id: string,
    requestBody: Partial<Job>,
    currentUser: User,
    companyName: string,
  ) {
    let job = await this.jobRepository.findOne({
      where: { id },
      relations: ['user', 'company'],
    });

    if (!job) {
      throw new BadRequestException(`No job with id: ${id}`);
    }

    Permission.check(currentUser, job.user.id);
    job = { ...job, ...requestBody };

    const company = await this.companyService.findByName(companyName);
    if (!company) {
      throw new NotFoundException(`Company ${companyName} does not exist`);
    }

    job.company = company;

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

    return await this.jobRepository.remove(job);
  }

  async getJobsByUserId(userId: number) {
    return this.jobRepository
      .createQueryBuilder('jobs')
      .leftJoinAndSelect('jobs.user', 'user')
      .where('jobs.user.id = :userId', { userId })
      .getMany();
  }

  // Paginate not use library
  // async getJobByCompanyName(companyName: string, page, limit) {
  //   const companyId = await this.companyService.extractIdByName(companyName);
  //   // return this.jobRepository
  //   //   .createQueryBuilder('jobs')
  //   //   .leftJoinAndSelect('jobs.company', 'company')
  //   //   .where('jobs.company.id = :companyId', { companyId })
  //   //   .getMany();
  //   const queryBuilder = this.jobRepository
  //     .createQueryBuilder('jobs')
  //     .leftJoinAndSelect('jobs.company', 'company')
  //     .where('jobs.company.id = :companyId', { companyId });

  //   const skip = (page - 1) * limit;

  //   queryBuilder.skip(skip).take(limit);
  //   const [jobs, total] = await queryBuilder.getManyAndCount();

  //   return {
  //     jobs,
  //     total,
  //     currentPage: page,
  //     perPage: limit,
  //     totalPages: Math.ceil(total / limit),
  //   };
  // }

  private extractSalary(salary: string) {
    const operationMap = {
      lte: '<=',
      gte: '>=',
      lt: '<',
      gt: '>',
      e: '=',
    };

    const [operationText, salaryText] = salary.split(':');

    const operation: string = operationMap[operationText];
    const salaryMoney: number = +salaryText;

    return { operation, salaryMoney };
  }

  async paginate(
    companyName: string,
    options: IPaginationOptions,
    title?: string,
    salary?: string,
  ) {
    const companyId = await this.companyService.extractIdByName(companyName);

    const { operation, salaryMoney } = this.extractSalary(salary);

    const queryBuilder = this.jobRepository
      .createQueryBuilder('jobs')
      .leftJoinAndSelect('jobs.company', 'company')
      .where('jobs.company.id = :companyId', { companyId })
      .andWhere('jobs.title LIKE :title', { title: `%${title}%` })
      .andWhere(`jobs.salary ${operation} :salaryMoney`, {
        salaryMoney,
      });

    return paginate(queryBuilder, options);
  }
}
