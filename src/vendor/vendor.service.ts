import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vendor } from './vendor.model';
import { thrower } from 'src/utils';

@Injectable()
export class VendorService {
  constructor(
    @InjectModel('Vendor') private readonly vendorModel: Model<Vendor>,
  ) {}

  async addVendor(dto: Vendor): Promise<Vendor> {
    try {
      // Saving the vendor to the database
      const newVendor = new this.vendorModel(dto);
      const addedVendor = await newVendor.save();

      delete addedVendor.password;
      return addedVendor;
    } catch (err) {
      thrower(err);
    }
  }

  async findVendorById(id: string): Promise<Vendor> {
    let vendor: Vendor;
    try {
      vendor = await this.vendorModel.findById(id, { __v: 0 }).exec();
    } catch (err) {
      throw new NotFoundException(err.message || 'Something went wrong');
    }
    if (!vendor) throw new NotFoundException('Could not find vendor');
    delete vendor.password;
    return vendor;
  }

  async findVendorByEmail(obj: { email: string }): Promise<Vendor> {
    let vendor: Vendor;
    try {
      vendor = await this.vendorModel
        .findOne(obj, { __v: 0 })
        .populate('service')
        .exec();
    } catch (err) {
      throw new NotFoundException(err.message || 'Something went wrong');
    }
    if (!vendor) throw new NotFoundException('Email/password is wrong !!');
    delete vendor.password;
    return vendor;
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

  async updateVendorData(dto: any, vendor: Vendor) {
    try {
      const prepData = Object.assign(vendor, dto);
      const updatedVendor = await this.vendorModel.findByIdAndUpdate(
        prepData._id,
        prepData,
        { new: true, runValidators: true },
      );
      delete updatedVendor.password;
      return { status: 'success', user: updatedVendor };
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
