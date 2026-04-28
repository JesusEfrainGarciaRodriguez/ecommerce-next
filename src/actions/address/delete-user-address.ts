"use server";

import prisma from "@/lib/prisma";

export const deleteUserAddress = async (userId: string) => {
  try {
    await prisma.userAddress.delete({
        where: {
            userId
        }
    });
  } catch (error) {
    console.error("Error deleting user address:", error);
    throw new Error("Error eliminando dirección");
  }
};