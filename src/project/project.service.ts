import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from './project.model';
import { Create } from './dto/Create.dto';
import { returner, thrower } from 'src/utils';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel('Project') private readonly projectModel: Model<Project>,
  ) {}

  async createProject(dto: Create) {
    try {
      const prepData = new this.projectModel(dto);
      const project = await prepData.save();
      return returner({ project });
    } catch (err) {
      thrower(err);
    }
  }

  async getProjectsByVendor(vendorId: string) {
    try {
      const projects = await this.projectModel
        .find({ vendor: vendorId })
        .populate('client');
      return returner({ projects });
    } catch (err) {
      thrower(err);
    }
  }

  async deleteProject(projId: string, vendorId: string) {
    try {
      const project = await this.projectModel.findById(projId);
      if (!project) throw new NotFoundException('Document not found !');
      if (project.vendor.toString() !== vendorId)
        throw new ForbiddenException('Unauthorized to perform this action !');
      const res = await project.remove();
      if (res) return returner();
    } catch (err) {
      thrower(err);
    }
  }
}
