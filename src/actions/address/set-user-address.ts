"use server";

import prisma from "@/lib/prisma";
import { Address } from "@/interfaces";
import { UserAddressUpsertArgs } from "../../../generated/prisma/models";

export const setUserAddress = async (address: Address, userId: string) => {
  const updateOrCreateAddress = {
    ...address,
    country: {
      connect: {
        id: address.country,
      },
    },
    user: {
      connect: {
        id: userId,
      },
    },
  };

  const query: UserAddressUpsertArgs = {
    create: updateOrCreateAddress,
    update: updateOrCreateAddress,
    where: {
      userId,
    },
  };

  try {
    await prisma.userAddress.upsert(query);
  } catch (error) {
    console.error("Error setting user address:", error);

    throw new Error("Error guardando dirección");
  }
};
