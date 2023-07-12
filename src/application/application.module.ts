import { Module } from '@nestjs/common';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './application.entity';
import { JobModule } from 'src/job/job.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  controllers: [ApplicationController],
  providers: [ApplicationService],
  imports: [TypeOrmModule.forFeature([Application]), JobModule],
})
export class ApplicationModule {}
