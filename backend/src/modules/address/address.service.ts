import { AppError } from "../../utils/AppError.js";
import { IAddressRepository } from "./address.interface.js";
import {
  cleanCreateAddressData,
  cleanUpdateAddressData,
} from "./address.request.js";
import { createAddressDTO, updateAddressDTO } from "./address.schema.js";

export class AddressService {
  constructor(private addressRepo: IAddressRepository) {}
  async createAddress(data: createAddressDTO, userId: string) {
    const cleanedData = cleanCreateAddressData(data);
    const address = await this.addressRepo.createAddress(cleanedData, userId);
    return address;
  }

  async getAddressByUserId(userId: string) {
    const address = await this.addressRepo.getAddressByUserId(userId);
    return address;
  }

  async updateAddress(
    userId: string,
    addressId: string,
    data: updateAddressDTO,
  ) {
    const existingAddress =
      await this.addressRepo.getAddressByUserIdandAddressId(userId, addressId);
    if (!existingAddress) {
      throw new AppError("User not found or you are not authorized", 401);
    }
    const cleanedData = cleanUpdateAddressData(data);
    const address = await this.addressRepo.updateAddress(
      addressId,
      cleanedData,
    );

    return address;
  }

  async deleteAddress(userId: string, addressId: string) {
    const existingAddress =
      await this.addressRepo.getAddressByUserIdandAddressId(userId, addressId);
    if (!existingAddress) {
      throw new AppError("User not found or you are not authorized", 401);
    }

    await this.addressRepo.deleteAddress(addressId)
  }
}
