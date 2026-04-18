"use server";

import { auth } from "@/lib/auth";
import { APIError } from "better-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type LoginState = {
  error?: string;
};

export async function login(
  prevState: LoginState | undefined | void,
  formData: FormData,
): Promise<LoginState | void> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Todos los campos son obligatorios" };
  }

  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
        rememberMe: true,
      },
      headers: await headers(),
    });
  } catch (error) {
    console.error(error);

    if (error instanceof APIError) {
      switch (error.statusCode) {
        case 401:
          return { error: "Correo o contraseña incorrectos" };
        default:
          return { error: "Error al iniciar sesión" };
      }
    }

    return { error: "Error inesperado" };
  }
  
  redirect("/");
}


