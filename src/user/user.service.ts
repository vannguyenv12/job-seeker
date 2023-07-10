import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  findByEmail(email: string) {
    // return this.repo.findOneBy({ email });
    return this.repo.findOne({ where: { email }, relations: ['roles'] });
  }

  async update(id: number, body: Partial<User>) {
    const user = await this.findOne(id);

    if (!user) {
      throw new BadRequestException('User does not exist');
    }
    user.firstName = body.firstName;
    user.lastName = body.lastName;

    return this.repo.save(user);
  }

  async delete(id: number) {
    const user = await this.repo.findOneBy({ id });
    if (!user) {
      throw new BadRequestException('User does not exist');
    }
    await this.repo.delete(id);
    return { message: 'Delete user successfully' };
  }
}
