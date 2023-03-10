import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vendor } from './vendor.model';
import { ObjId, returner, thrower } from 'src/utils';
import { SignupVendor } from 'src/auth/dto';
import { EditProfessional } from './dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class VendorService {
  constructor(
    @InjectModel('Vendor') private readonly vendorModel: Model<Vendor>,
    private userService: UserService,
  ) {}

  async addVendor(dto: SignupVendor) {
    try {
      // Saving the vendor to the database
      const newVendor = new this.vendorModel(dto);
      const addedVendor = await newVendor.save();

      // delete addedVendor.password;
      return addedVendor;
    } catch (err) {
      thrower(err);
    }
  }

  async findAllVendors(): Promise<Vendor[]> {
    try {
      const vendors = await this.vendorModel
        .find({}, { __v: 0, password: 0 })
        .exec();
      return vendors;
    } catch (err) {
      thrower(err);
    }
  }

  async updateVendorData(dto: EditProfessional, user: Vendor) {
    try {
      const prepData = {
        user: user._id,
        service: dto.service,
        about: dto.about,
        workingDays: dto.workingDays,
        workRadius: dto.workRadius,
        experience: dto.experience,
      };

      const updatedVendor = await this.vendorModel.findByIdAndUpdate(
        user.vendor,
        prepData,
      );
      const updatedUser = await this.userService.findUserById(
        updatedVendor.user as string,
      );
      // const updatedUser =  await this.
      return { ...updatedUser };
    } catch (err) {
      thrower(err);
    }
  }

  async findVendorByService(serviceId: string) {
    try {
      const vendors = await this.vendorModel
        .find({ service: serviceId })
        .select('_id')
        .exec();
      const vendorIds = vendors.map((v) => v._id);
      return vendorIds;
    } catch (err) {
      thrower(err);
    }
  }

  async addEmployee(empId: string | ObjId, vendorId: string | ObjId) {
    try {
      const vendor = await this.vendorModel.findById(vendorId);
      if (vendor.employees.find((e) => e.emp.toString() === empId.toString())) {
        return returner();
      }
      const updatedVendor = await this.vendorModel.findByIdAndUpdate(
        vendorId,
        { $addToSet: { employees: { emp: empId } } },
        { new: true, runValidators: true },
      );
      const addedEmployee = await updatedVendor.populate({
        path: 'employees',
        populate: 'emp projects',
      });
      return { status: 'success', vendor: addedEmployee };
    } catch (err) {
      thrower(err);
    }
  }

  async getEmployees(vendorId: ObjId) {
    try {
      const vendorEmployees = await this.vendorModel
        .findById(vendorId)
        .populate({
          path: 'employees',
          populate: 'emp projects',
        });
      const employees = vendorEmployees?.employees;
      return { status: 'success', employees };
    } catch (err) {
      thrower(err);
    }
  }

  async removeEmployee(empId: string | ObjId, vendorId: string | ObjId) {
    try {
      const updatedVendor = await this.vendorModel.findByIdAndUpdate(
        vendorId,
        { $pull: { employees: { emp: empId } } },
        { new: true, runValidators: true },
      );
      const vendorAfterRemoval = await updatedVendor.populate({
        path: 'employees',
        populate: 'emp projects',
      });
      return { status: 'success', vendor: vendorAfterRemoval };
    } catch (err) {
      thrower(err);
    }
  }

  async addProject(projId: ObjId, vendorId: ObjId) {
    try {
      const added = await this.vendorModel.findByIdAndUpdate(
        vendorId,
        {
          $addToSet: { projects: projId },
        },
        {
          new: true,
          runValidators: true,
        },
      );
      return !!added;
    } catch (err) {
      thrower(err);
    }
  }

  async getVendorCountByService() {
    try {
      const vendorCount = await this.vendorModel.aggregate([
        {
          $group: {
            _id: '$service',
            count: { $count: {} },
          },
        },
      ]);
      return returner({ vendorCount });
    } catch (err) {
      thrower(err);
    }
  }

  // async getPieChartData() {
  //   try {
  //     const dataSet = await this.vendorModel.aggregate([
  //       {
  //         $group: {
  //           _id: '$service',
  //           count: { $sum: 1 },
  //         },
  //       },
  //       {
  //         $addFields: { service: '$_id' },
  //       },
  //       {
  //         $project: { _id: 0 },
  //       },
  //     ]);
  //     return returner({ dataSet });
  //   } catch (err) {
  //     thrower(err);
  //   }
  // }
}
