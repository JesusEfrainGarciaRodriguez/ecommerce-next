"use server";

import { auth } from "@/lib/auth";
import { APIError } from "better-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

type SignUpState = {
  error: string | null;
};

export async function signUp(
  prevState: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  if (
    typeof email !== "string" ||
    typeof name !== "string" ||
    typeof password !== "string"
  ) {
    return { error: "Datos inválidos" };
  }

  if (!email || !name || !password) {
    return { error: "Todos los campos son obligatorios" };
  }

  if (password.length < 6) {
    return { error: "La contraseña debe tener al menos 6 caracteres" };
  }

  try {
    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
      headers: await headers(),
    });
  } catch (error: unknown) {
    console.error("Error creating account:", error);

    if (error instanceof APIError) {
      if (error.statusCode === 422) {
        return { error: "El usuario ya existe" };
      }

      return { error: error.message };
    }

    return {
      error: "No se pudo crear la cuenta",
    };
  }
  redirect("/");
}
