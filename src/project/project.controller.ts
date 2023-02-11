import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
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
    return this.projectService.createProject(dto);
  }

  @UseGuards(JwtGuard)
  @Get()
  getProjectsByVendor(@GetUser() user: User) {
    this.isVendor(user.role);
    return this.projectService.getProjectsByVendor(user.vendor?._id.toString());
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
    this.isVendor(user.role);
    return this.projectService.deleteProject(
      params.id,
      user.vendor?._id.toString(),
    );
  }
}
