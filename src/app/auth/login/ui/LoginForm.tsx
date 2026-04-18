"use client";
import { login } from "@/actions";
import Link from "next/link";
import { useActionState, useState } from "react";
import { ButtonSubmit } from "./ButtonSubmit";

export const LoginForm = () => {
  const [state, action] = useActionState(login, undefined);

  const [email, setEmail] = useState("");
  return (
    <form action={action} className="flex flex-col">
      {state?.error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
          role="alert"
        >
          <span className="block sm:inline">{state.error}</span>
        </div>
      )}
      <label htmlFor="email">Correo electrónico</label>
      <input
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="px-5 py-2 border bg-gray-200 rounded mb-5"
        type="email"
      />
      <label htmlFor="password">Contraseña</label>
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

      <Link href="/auth/new-account" className="btn-secondary text-center">
        Crear una nueva cuenta
      </Link>
    </form>
  );
};
