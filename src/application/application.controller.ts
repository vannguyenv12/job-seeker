import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateApplicationDto } from './dtos/create-application';
import { ApplicationService } from './application.service';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';
import { User } from 'src/user/user.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ApplicationDto } from './dtos/application.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PaginationDto } from './dtos/pagination.dto';

@Controller('api/v1/applications')
@UseGuards(AuthGuard)
export class ApplicationController {
  constructor(private applicationService: ApplicationService) {}

  @Post()
  @Serialize(ApplicationDto)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './cv',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.originalname}-${uniqueSuffix}-${ext}`;
          cb(null, filename);
        },
      }),
    }),
  )
  create(
    @Body() requestBody: CreateApplicationDto,
    @CurrentUser() currentUser: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.applicationService.create(requestBody.jobId, currentUser, file);
  }

  @Get()
  @UseGuards(new AuthorizationGuard(['ADMIN']))
  @Serialize(PaginationDto)
  getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ) {
    return this.applicationService.findAll({ page, limit });
  }

  @Get('/user/:userId')
  @Serialize(PaginationDto)
  @UseGuards(new AuthorizationGuard(['ADMIN']))
  getAllByUserId(
    @Param('userId') userId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ) {
    return this.applicationService.findAllByUserId(userId, { page, limit });
  }

  @Get('/job/:jobId')
  @Serialize(PaginationDto)
  @UseGuards(new AuthorizationGuard(['HR', 'ADMIN']))
  getAllByJobId(
    @Param('jobId') jobId: number,
    @CurrentUser() currentUser: User,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ) {
    return this.applicationService.findAllByJobId(jobId, currentUser, {
      page,
      limit,
    });
  }

  @Delete('/:userId/:jobId')
  @UseGuards(new AuthorizationGuard(['ADMIN']))
  @Serialize(ApplicationDto)
  delete(@Param('userId') userId: number, @Param('jobId') jobId: number) {
    return this.applicationService.delete(userId, jobId);
  }
}
