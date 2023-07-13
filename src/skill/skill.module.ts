import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skill } from './skill.entity';
import { SkillService } from './skill.service';

@Module({
  providers: [SkillService],
  exports: [SkillService],
  imports: [TypeOrmModule.forFeature([Skill])],
})
export class SkillModule {}
