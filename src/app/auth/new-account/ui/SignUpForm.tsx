"use client";
import { signUp } from "@/actions";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import { ButtonSubmit } from "./ButtonSubmit";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export const SignUpForm = () => {
  const router = useRouter();
  const { refetch } = authClient.useSession();
  const [state, action] = useActionState(signUp, undefined);

  useEffect(() => {
    if (state?.success) {
      refetch();
      router.replace("/");
    }
  }, [state?.success, router, refetch]);

  return (
    <form action={action} className="flex flex-col">
      {state?.error && <p className="text-red-500 mt-2">{state.error}</p>}

      <label htmlFor="email">Nombre completo</label>
      <input
        name="name"
        className="px-5 py-2 border bg-gray-200 rounded mb-5"
        type="text"
      />

      <label htmlFor="email">Correo electrónico</label>
      <input
        name="email"
        className="px-5 py-2 border bg-gray-200 rounded mb-5"
        type="email"
      />

      <label htmlFor="email">Contraseña</label>
      <input
        name="password"
        className="px-5 py-2 border bg-gray-200 rounded mb-5"
        type="password"
      />

      <ButtonSubmit />

      <div className="flex items-center my-5">
        <div className="flex-1 border-t border-gray-500"></div>
        <div className="px-2 text-gray-800">O</div>
        <div className="flex-1 border-t border-gray-500"></div>
      </div>

      <Link href="/auth/login" className="btn-secondary text-center">
        Ingresar
      </Link>
    </form>
  );
};
