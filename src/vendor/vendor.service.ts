import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vendor } from './vendor.model';
import { thrower } from 'src/utils';
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

      const updatedVendor = await this.vendorModel.findByIdAndUpdate(
        user.vendor,
        prepData,
      );
      const updatedUser = await this.userService.findUserById(
        updatedVendor.user,
      );
      // const updatedUser =  await this.
      return { status: 'success', user: updatedUser };
    } catch (err) {
      thrower(err);
    }
  }

  async findVendorByService(serviceId: string) {
    try {
      const vendors = await this.vendorModel
        .find({ service: serviceId }, { password: 0 })
        .exec();
      return { results: vendors.length, vendors };
    } catch (err) {
      thrower(err);
    }
  }
}
