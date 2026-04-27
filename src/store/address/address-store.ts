import { create, StateCreator } from "zustand";
import { persist } from "zustand/middleware";

type AddressStoreState = {
  address: {
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    postalCode: string;
    city: string;
    country: string;
    phone: string;
  };
};

type AddressStoreActions = {
  setAddress: (address: AddressStoreState["address"]) => void;
};

type AddressStore = AddressStoreState & AddressStoreActions;

const addressStoreApi: StateCreator<AddressStore> = (set) => ({
  address: {
    firstName: "",
    lastName: "",
    address: "",
    address2: "",
    postalCode: "",
    city: "",
    country: "",
    phone: "",
  },

  setAddress: (address) => {
    set({
      address,
    });
  },
});

export const useAddressStore = create<AddressStore>()(
  persist(addressStoreApi, {
    name: "address-storage",
  }),
);
