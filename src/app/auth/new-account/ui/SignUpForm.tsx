"use client";
import { signUp } from "@/actions";
import Link from "next/link";
import { useActionState } from "react";

export const SignUpForm = () => {
  const [state, action] = useActionState(signUp, { error: null });
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

      <button type="submit" className="btn-primary">
        Crear cuenta
      </button>

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
