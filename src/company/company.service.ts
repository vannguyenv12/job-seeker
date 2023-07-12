import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company) private companyRepository: Repository<Company>,
  ) {}

  findAll() {
    return this.companyRepository.find();
  }

  findById(id: number) {
    return this.companyRepository.findOne({ where: { id } });
  }

  findByName(name: string) {
    return this.companyRepository.findOne({ where: { name } });
  }

  findAllByName(name: string) {
    return this.companyRepository.find({ where: { name } });
  }

  async extractIdByName(name: string) {
    const company = await this.findByName(name);
    if (!company) {
      throw new NotFoundException(`Company ${name} does not exist`);
    }
    return company.id;
  }

  private async preventDuplicateName(name: string) {
    const companyList = await this.findAllByName(name);

    if (companyList.length) {
      throw new BadRequestException(`Company ${name} already exist`);
    }
    return;
  }

  async create(requestBody: Partial<Company>) {
    await this.preventDuplicateName(requestBody.name);
    const company = this.companyRepository.create(requestBody);
    return this.companyRepository.save(company);
  }

  async update(id: number, requestBody: Partial<Company>) {
    await this.preventDuplicateName(requestBody.name);
    const findCompany = await this.findById(id);
    if (!findCompany) {
      throw new NotFoundException(`Not found company with id: ${id}`);
    }

    findCompany.name = requestBody.name;

    return this.companyRepository.save(findCompany);
  }

  async delete(id: number) {
    const findCompany = await this.findById(id);
    if (!findCompany) {
      throw new NotFoundException(`Not found company with id: ${id}`);
    }

    return this.companyRepository.remove(findCompany);
  }
}
