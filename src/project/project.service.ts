import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from './project.model';
import { Create } from './dto/Create.dto';
import { ObjId, lastWeekMade, monthlyMade, returner, thrower } from 'src/utils';
import { checkIfAdmin } from 'src/utils/util.functions';
import { User } from 'src/user/user.model';
import { VendorService } from 'src/vendor/vendor.service';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel('Project') private readonly projectModel: Model<Project>,
    private readonly vendorService: VendorService,
  ) {}

  async createProject(dto: Create) {
    try {
      const prepData = new this.projectModel(dto);
      const project = await prepData.save();
      const isAdded = await this.vendorService.addProject(
        project._id as ObjId,
        project.vendor as ObjId,
      );
      if (!isAdded)
        throw new InternalServerErrorException(
          'Something went wrong while adding project to vendor document',
        );
      return returner({ project });
    } catch (err) {
      thrower(err);
    }
  }

  async getProjectsByVendor(vendorId: string) {
    try {
      const projects = await this.projectModel
        .find({ vendor: vendorId })
        .populate('client')
        .populate('vendor');
      return returner({ projects });
    } catch (err) {
      thrower(err);
    }
  }

  async getAllProjects() {
    try {
      const projects = await this.projectModel
        .find()
        .populate('client')
        .populate({
          path: 'vendor',
          populate: {
            path: 'user',
            select: '-password -__v -isBanned',
            model: 'User',
          },
        })
        .populate('service');
      return returner({ results: projects.length, projects });
    } catch (err) {
      thrower(err);
    }
  }

  async getProjectsByUser(userId: string) {
    try {
      const projects = await this.projectModel
        .find({ client: userId })
        .populate({
          path: 'vendor',
          populate: {
            path: 'user',
            model: 'User',
            select: 'name image',
          },
        })
        .populate({ path: 'service', select: 'title' });
      return returner({ results: projects.length, projects });
    } catch (err) {
      thrower(err);
    }
  }

  async reportProject(projId: string, userId: ObjId) {
    try {
      const project = await this.projectModel.findById(projId);
      if (project.client.toString() !== userId.toString())
        throw new ForbiddenException(
          'You are not authorized to perform this operation !',
        );
      project.status = 'failed';
      await project.save();
      return returner({ project });
    } catch (err) {
      thrower(err);
    }
  }

  async unreportProject(projId: string, userId: ObjId) {
    try {
      const project = await this.projectModel.findById(projId);
      if (project.client.toString() !== userId.toString())
        throw new ForbiddenException(
          'You are not authorized to perform this operation !',
        );
      project.status = 'running';
      await project.save();
      return returner({ project });
    } catch (err) {
      thrower(err);
    }
  }

  async deleteProject(projId: string, user: User) {
    try {
      const project = await this.projectModel.findById(projId);
      if (!project) throw new NotFoundException('Document not found !');
      if (
        project.vendor.toString() !== user?.vendor?._id.toString() &&
        !checkIfAdmin(user)
      )
        throw new ForbiddenException('Unauthorized to perform this action !');
      const res = await project.remove();
      if (res) return returner();
    } catch (err) {
      thrower(err);
    }
  }

  async getLastWeekProjects() {
    try {
      return await lastWeekMade(this.projectModel);
    } catch (err) {
      thrower(err);
    }
  }

  async getMonthlyProjects() {
    try {
      return await monthlyMade(this.projectModel);
    } catch (err) {
      thrower(err);
    }
  }
}
