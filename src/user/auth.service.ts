import { Injectable, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { RoleService } from 'src/role/role.service';
import { SkillService } from 'src/skill/skill.service';
import { Skill } from 'src/skill/skill.entity';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private userService: UserService,
    private jwtService: JwtService,
    private roleService: RoleService,
    private skillService: SkillService,
  ) {}

  async register(body: Partial<User> | CreateUserDto) {
    const hashedPassword = await bcrypt.hash(body.password, 10);
    body.password = hashedPassword;

    const userByEmail = await this.userService.findByEmail(body.email);
    if (userByEmail) {
      throw new BadRequestException('Email adready exist');
    }

    const user = this.userRepository.create(body as User);
    const role = await this.roleService.findByName('JOB_SEEKER');
    user.roles = [role];

    // Create skill: ["HTML", "CSS", "JavaScript"]
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

    // Access token
    const payload = { sub: user.id, email: user.email, role: user.roles };
    const accessToken = await this.jwtService.signAsync(payload);
    const savedUser = await this.userRepository.save(user);

    return {
      ...savedUser,
      accessToken,
    };
  }

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new BadRequestException('Invalid credentials');

    // check password
    const isMatchPassword = await bcrypt.compare(password, user.password);
    if (!isMatchPassword) {
      throw new BadRequestException('Invalid password credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.roles };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      ...user,
      accessToken,
    };
  }

  logout(request: Request) {
    request.currentUser = null;
  }
}
