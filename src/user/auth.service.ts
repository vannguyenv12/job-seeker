import { Injectable, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { RoleService } from 'src/role/role.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private userService: UserService,
    private jwtService: JwtService,
    private roleService: RoleService,
  ) {}

  async register(body: Partial<User>) {
    const hashedPassword = await bcrypt.hash(body.password, 10);
    body.password = hashedPassword;

    const userByEmail = await this.userService.findByEmail(body.email);
    if (userByEmail) {
      throw new BadRequestException('Email adready exist');
    }

    const user = this.userRepository.create(body);
    const role = await this.roleService.findByName('JOB_SEEKER');
    user.roles = [role];

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
