import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { UpdateCompanyDto } from './dtos/update-company.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuthorizationGuard } from 'src/guards/authorization.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CompanyDto } from './dtos/company.dto';

@Controller('api/v1/companies')
@Serialize(CompanyDto)
@UseGuards(AuthGuard)
// @UseGuards(new AuthorizationGuard(['ADMIN']))
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @Get()
  getAll() {
    return this.companyService.findAll();
  }

  @Get('/:id')
  get(@Param('id') id: number) {
    return this.companyService.findById(id);
  }

  @Post()
  create(@Body() requestBody: CreateCompanyDto) {
    return this.companyService.create(requestBody);
  }

  @Put('/:id')
  update(@Param('id') id: number, @Body() requestBody: UpdateCompanyDto) {
    return this.companyService.update(id, requestBody);
  }

  @Delete('/:id')
  delete(@Param('id') id: number) {
    return this.companyService.delete(id);
  }
}
