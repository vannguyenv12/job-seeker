import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(@InjectRepository(Role) private role: Repository<Role>) {}

  findByName(name: string) {
    return this.role.findOneBy({ name });
  }
}
