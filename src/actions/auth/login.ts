"use server";

import { auth } from "@/lib/auth";
import { APIError } from "better-auth";
import { headers } from "next/headers";

interface LoginState {
  error?: string;
  success?: boolean;
}

export async function login(
  prevState: LoginState | undefined | void,
  formData: FormData,
): Promise<LoginState> {
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

    return { success: true };
  } catch (error) {
    if (error instanceof APIError) {
      if (error.statusCode === 401) {
        return { error: "Correo o contraseña incorrectos" };
      }
    }

    return { error: "Error al iniciar sesión" };
  }
}
