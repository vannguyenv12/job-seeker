import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateJobDto } from './dtos/create-job.dto';
import { JobService } from './job.service';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';
import { User } from 'src/user/user.entity';
import { AuthorizationGuard } from 'src/guards/authorization.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { JobDto } from './dtos/job.dto';
import { UpdateJobDto } from './dtos/update-job.dto';
import { CheckUser } from 'src/interceptors/check-user.interceptor';

@Controller('api/v1/jobs')
@UseGuards(AuthGuard)
@Serialize(JobDto)
export class JobController {
  constructor(private jobService: JobService) {}

  @Post()
  @UseGuards(new AuthorizationGuard(['HR']))
  create(@Body() requestBody: CreateJobDto, @CurrentUser() CurrentUser: User) {
    return this.jobService.create(
      requestBody,
      CurrentUser,
      requestBody.companyName,
    );
  }

  @Get('/:id')
  getById(@Param('id') id: string) {
    return this.jobService.get(id);
  }

  @Get()
  getAll() {
    return this.jobService.findAll();
  }

  @Put('/:id')
  @UseGuards(new AuthorizationGuard(['HR']))
  update(
    @Param('id') id: string,
    @Body() requestBody: UpdateJobDto,
    @CurrentUser() currentUser,
  ) {
    return this.jobService.update(
      id,
      requestBody,
      currentUser,
      requestBody.companyName,
    );
  }

  @Delete('/:id')
  @UseGuards(new AuthorizationGuard(['HR']))
  delete(@Param('id') id: string, @CurrentUser() currentUser) {
    return this.jobService.delete(id, currentUser);
  }

  @Get('/:userId/users')
  @UseGuards(new AuthorizationGuard(['ADMIN']))
  getJobsByUserId(@Param('userId') userId: number) {
    return this.jobService.getJobsByUserId(userId);
  }

  @Get('/:companyName/companies')
  getJobsByCompanyName(@Param('companyName') companyName: string) {
    return this.jobService.getJobByCompanyName(companyName);
  }
}
