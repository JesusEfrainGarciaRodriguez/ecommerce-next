"use server";

import { Role } from "@/interfaces";
import { getSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface UpdateUserRoleOptions {
  userId: string;
  newRole: Role;
}

export const updateUserRole = async ({
  userId,
  newRole,
}: UpdateUserRoleOptions) => {
  const session = await getSession();

  if (session?.user?.role.toLocaleLowerCase() !== Role.ADMIN) {
    return {
      ok: false,
      message: "Debe de ser un usuario administrador",
    };
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    revalidatePath("/admin/users");

    return {
      ok: true,
      user: updatedUser,
    };
  } catch (error) {
    return {
      ok: false,
      message:
        "Error al actualizar el rol del usuario" +
        (error instanceof Error ? error.message : ""),
    };
  }
};
