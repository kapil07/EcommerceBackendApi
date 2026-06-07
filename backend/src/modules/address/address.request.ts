import { createAddressDTO, updateAddressDTO } from "./address.schema.js";

export const cleanCreateAddressData = (data: createAddressDTO) => {
  return {
    addressType: data.addressType.toLocaleLowerCase(),
    addressLine1: data.addressLine1.toLocaleLowerCase(),
    addressLine2: data?.addressLine2?.toLocaleLowerCase(),
    city: data.city.toLocaleLowerCase(),
    state: data.state.toLocaleLowerCase(),
    pincode: data.pincode.toLocaleLowerCase(),
    country: data.country.toLocaleLowerCase(),
  };
};

export const cleanUpdateAddressData = (data: updateAddressDTO) => {
  return {
    addressType: data.addressType?.toLocaleLowerCase(),
    addressLine1: data.addressLine1?.toLocaleLowerCase(),
    addressLine2: data?.addressLine2?.toLocaleLowerCase(),
    city: data.city?.toLocaleLowerCase(),
    state: data.state?.toLocaleLowerCase(),
    pincode: data.pincode?.toLocaleLowerCase(),
    country: data.country?.toLocaleLowerCase(),
  };
};