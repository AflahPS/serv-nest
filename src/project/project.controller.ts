import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { JwtGuard } from 'src/auth/guard';
import { Create } from './dto/Create.dto';
import { GetUser } from 'src/auth/decorator';
import { User } from 'src/user/user.model';
import { MongoId } from 'src/utils';
import { checkIfAdmin } from 'src/utils/util.functions';
import { ObjectId } from 'mongoose';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  isVendor(role: string) {
    if (role !== 'vendor')
      throw new ForbiddenException(
        'You are not authorized to perform this action !',
      );
  }

  @UseGuards(JwtGuard)
  @Post()
  createProject(@Body() dto: Create, @GetUser() user: User) {
    this.isVendor(user.role);
    dto.vendor = user.vendor._id.toString();
    dto.service = user.vendor?.service?._id as string;
    return this.projectService.createProject(dto);
  }

  @UseGuards(JwtGuard)
  @Get()
  getProjectsByVendor(@GetUser() user: User) {
    this.isVendor(user.role);
    return this.projectService.getProjectsByVendor(user.vendor?._id.toString());
  }

  @UseGuards(JwtGuard)
  @Get('user')
  getProjectsByUser(@GetUser() user: User) {
    return this.projectService.getProjectsByUser(user._id.toString());
  }

  @UseGuards(JwtGuard)
  @Patch('report/:id')
  reportProject(@GetUser() user: User, @Param() params: MongoId) {
    return this.projectService.reportProject(params.id, user._id as ObjectId);
  }

  @UseGuards(JwtGuard)
  @Patch('unreport/:id')
  unreportProject(@GetUser() user: User, @Param() params: MongoId) {
    return this.projectService.unreportProject(params.id, user._id as ObjectId);
  }

  @UseGuards(JwtGuard)
  @Get('all')
  getAllProjects(@GetUser() user: User) {
    if (!checkIfAdmin(user))
      throw new ForbiddenException(
        'You are not authorized to perform this action !',
      );
    return this.projectService.getAllProjects();
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  deleteProject(@Param() params: MongoId, @GetUser() user: User) {
    return this.projectService.deleteProject(params.id, user);
  }
}
