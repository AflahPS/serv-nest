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
      console.log({ dto });

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

      console.log(prepData);

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
        .populate('user')
        .exec();
      console.log(
        '🚀 ~ file: vendor.service.ts:74 ~ VendorService ~ findVendorByService ~ vendors',
        vendors,
      );
      return { status: 'success', results: vendors.length, vendors };
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
}
