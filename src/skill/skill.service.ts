import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from './skill.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(Skill) private skillRepository: Repository<Skill>,
  ) {}

  create(name: string) {
    const Skill = this.skillRepository.create({ name });

    return this.skillRepository.save(Skill);
  }

  findByName(name: string) {
    return this.skillRepository.findOneBy({ name });
  }
}
