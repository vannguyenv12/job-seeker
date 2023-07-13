import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { RoleModule } from './role/role.module';
import { Role } from './role/role.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JobModule } from './job/job.module';
import { Job } from './job/job.entity';
import { CompanyModule } from './company/company.module';
import { Company } from './company/company.entity';
import { ApplicationModule } from './application/application.module';
import { Application } from './application/application.entity';
import { SkillModule } from './skill/skill.module';
import { Skill } from './skill/skill.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'mysql',
          host: config.get<string>('DB_HORT'),
          port: +config.get<string>('DB_PORT'),
          username: config.get<string>('DB_USERNAME'),
          password: config.get<string>('DB_PASSWORD'),
          database: config.get<string>('DB_NAME'),
          entities: [User, Role, Job, Company, Application, Skill],
          synchronize: true,
        };
      },
    }),
    UserModule,
    RoleModule,
    JobModule,
    CompanyModule,
    ApplicationModule,
    SkillModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
