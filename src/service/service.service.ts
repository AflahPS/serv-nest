import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service } from './service.model';
import { ObjId, returner, thrower } from 'src/utils';
import { Create } from './dto/Create.dto';
import { UserService } from 'src/user/user.service';
import { VendorService } from 'src/vendor/vendor.service';
import { VendorByLocation } from './dto/VendorByLocation.dto';

@Injectable()
export class ServiceService {
  constructor(
    @InjectModel('Service') private readonly serviceModel: Model<Service>,
    private readonly userService: UserService,
    private readonly vendorService: VendorService,
  ) {}

  async addService(dto: Create): Promise<Service> {
    try {
      // Saving the Service to the database
      const newService = new this.serviceModel(dto);
      const addedService = await newService.save();

      return returner({ service: addedService });
    } catch (err) {
      thrower(err);
    }
  }

  async findAllServices() {
    try {
      const services = await this.serviceModel.find({}, { __v: 0 }).exec();
      return { status: 'success', results: services.length, services };
    } catch (err) {
      thrower(err);
    }
  }

  // {location: {$geoWithin: {$centerSphere: [ [ 75.7804,11.2588], 0.1 ] }}}

  async findServiceById(id: string): Promise<Service> {
    let service: Service;
    try {
      service = await this.serviceModel.findById(id, { __v: 0 }).exec();
    } catch (err) {
      throw new NotFoundException(err.message || 'Something went wrong');
    }
    if (!service) throw new NotFoundException('Could not find service');
    return service;
  }

  async getServicesTitle() {
    try {
      const services = await this.serviceModel.find().select('title').exec();
      if (!services) throw new NotFoundException('Could not find services');
      return returner({ services });
    } catch (err) {
      throw new NotFoundException(err.message || 'Something went wrong');
    }
  }

  async updateServiceData(dto: any, id: string) {
    try {
      const service = await this.findServiceById(id);
      const prepData = Object.assign(service, dto);
      const updatedService = await this.serviceModel.findByIdAndUpdate(
        prepData._id,
        prepData,
        { new: true, runValidators: true },
      );
      return { status: 'success', user: updatedService };
    } catch (err) {
      thrower(err);
    }
  }

  async deleteService(serviceId: string) {
    try {
      const res = await this.serviceModel.findByIdAndDelete(serviceId);
      if (res) return returner();
      return { status: 'failed' };
    } catch (err) {
      thrower(err);
    }
  }

  async getVendorsByServiceId(serviceId: string) {
    try {
      const vendorIds = await this.vendorService.findVendorByService(serviceId);
      return this.userService.findVendorByService(vendorIds as ObjId[]);
    } catch (err) {
      thrower(err);
    }
  }

  async getVendorsByServiceIdWithLocation(dto: VendorByLocation) {
    try {
      const vendorIds = await this.vendorService.findVendorByService(
        dto.serviceId,
      );
      return this.userService.findVendorByServiceWithDistance(
        vendorIds as ObjId[],
        dto.lnglat,
      );
    } catch (err) {
      thrower(err);
    }
  }
}
