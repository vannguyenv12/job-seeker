import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { Skill } from 'src/skill/skill.entity';
import { SkillService } from 'src/skill/skill.service';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './user.entity';
import { Permission } from 'src/utils/check-permission';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private skillService: SkillService,
  ) {}

  findAll(options: IPaginationOptions, skill: string) {
    return paginate(this.repo, options);
  }

  // async findAllBySkills(options: IPaginationOptions, skill: string) {
  //   console.log('hit here');
  //   const queryBuilder = this.repo
  //     .createQueryBuilder('users')
  //     .leftJoinAndSelect('users.skills', 'skills');
  //   //.andWhere('users.skills.name = :skill', { skill });

  //   // this.repo.query('')

  //   const users = await queryBuilder.getMany();
  //   console.log(users);
  //   console.log(users[7].skills[0]);

  //   return paginate(queryBuilder, options);
  // }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['roles'] });
  }

  findByEmail(email: string) {
    // return this.repo.findOneBy({ email });
    return this.repo.findOne({
      where: { email },
      relations: ['roles', 'skills'],
    });
  }

  async update(
    id: number,
    body: Partial<User> | UpdateUserDto,
    currentUser: User,
  ) {
    const user = await this.findOne(id);
    Permission.check(currentUser, id);
    // console.log(user);

    if (!user) {
      throw new BadRequestException('User does not exist');
    }
    user.firstName = body.firstName;
    user.lastName = body.lastName;

    let skill: Skill;
    const skillList: Skill[] = [];

    for (const s of body.skills as [string]) {
      const skillByName = await this.skillService.findByName(s);
      if (!skillByName) {
        skill = await this.skillService.create(s);
        skillList.push(skill);
      }
      {
        skill = skillByName;
        skillList.push(skill);
      }
    }
    user.skills = [...skillList];

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
