import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service } from './service.model';
import { thrower } from 'src/utils';
import { Create } from './dto/Create.dto';
import { VendorService } from 'src/vendor/vendor.service';

@Injectable()
export class ServiceService {
  constructor(
    @InjectModel('Service') private readonly serviceModel: Model<Service>,
    private vendorService: VendorService,
  ) {}

  async addService(dto: Create): Promise<Service> {
    try {
      // Saving the Service to the database
      const newService = new this.serviceModel(dto);
      const addedService = await newService.save();

      return addedService;
    } catch (err) {
      thrower(err);
    }
  }

  async findAllServices(): Promise<Service[]> {
    try {
      const services = await this.serviceModel.find({}, { __v: 0 }).exec();
      return services;
    } catch (err) {
      thrower(err);
    }
  }

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

  async getVendorsByServiceId(serviceId: string) {
    return this.vendorService.findVendorByService(serviceId);
  }
}
