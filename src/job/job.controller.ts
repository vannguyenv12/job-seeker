import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';
import { User } from 'src/user/user.entity';
import { CreateJobDto } from './dtos/create-job.dto';
import { JobDto } from './dtos/job.dto';
import { PaginationDto } from './dtos/pagination.dto';
import { UpdateJobDto } from './dtos/update-job.dto';
import { JobService } from './job.service';

@Controller('api/v1/jobs')
export class JobController {
  constructor(private jobService: JobService) {}

  @Post()
  @Serialize(JobDto)
  @UseGuards(AuthGuard)
  @UseGuards(new AuthorizationGuard(['HR']))
  create(@Body() requestBody: CreateJobDto, @CurrentUser() CurrentUser: User) {
    return this.jobService.create(
      requestBody,
      CurrentUser,
      requestBody.companyName,
    );
  }

  @Get('/:id')
  @Serialize(PaginationDto)
  getById(@Param('id') id: string) {
    return this.jobService.get(id);
  }

  @Get()
  @Serialize(PaginationDto)
  getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('title', new DefaultValuePipe('')) title?: string,
    @Query('salary', new DefaultValuePipe('gt:0')) salary?: string,
  ) {
    return this.jobService.findAll({ page, limit }, title, salary);
  }

  @Put('/:id')
  @Serialize(JobDto)
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
  @Serialize(JobDto)
  @UseGuards(AuthGuard)
  @UseGuards(new AuthorizationGuard(['HR']))
  delete(@Param('id') id: string, @CurrentUser() currentUser) {
    return this.jobService.delete(id, currentUser);
  }

  @Get('/:userId/users')
  @UseGuards(AuthGuard)
  @Serialize(JobDto)
  @UseGuards(new AuthorizationGuard(['ADMIN']))
  getJobsByUserId(@Param('userId') userId: number) {
    return this.jobService.getJobsByUserId(userId);
  }

  @Get('/:companyName/companies')
  @Serialize(PaginationDto)
  async getJobsByCompanyName(
    @Param('companyName') companyName: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('title', new DefaultValuePipe('')) title?: string,
    @Query('salary', new DefaultValuePipe('gt:0')) salary?: string,
  ) {
    return await this.jobService.paginate(
      companyName,
      { page, limit },
      title,
      salary,
    );
  }
}
