"use client";
import { signUp } from "@/actions";
import Link from "next/link";
import { useState } from "react";
import { ButtonSubmit } from "./ButtonSubmit";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useForm, SubmitHandler } from "react-hook-form";
import clsx from "clsx";

type FormInputs = {
  name: string;
  email: string;
  password: string;
};

export const SignUpForm = () => {
  const router = useRouter();
  const { refetch } = authClient.useSession();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    const { name, email, password } = data;

    try {
      const result = await signUp({ name, email, password });
      console.log("Sign-up result:", result);
      if (result.success) {
        setErrorMessage(null);
        refetch();
        router.replace("/");
      } else {
        setErrorMessage(result.error || "Error desconocido al crear la cuenta");
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
      setErrorMessage("Error al crear la cuenta. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}

      <div className="flex flex-col mb-5">
        <label htmlFor="email">Nombre completo</label>
        <input
          {...register("name", { required: "El nombre es requerido" })}
          className={clsx(
            "px-5 py-2 border bg-gray-200 rounded",
            errors.name && "border-red-500",
          )}
          type="text"
          autoFocus
        />
        {errors.name && (
          <span className="text-red-500 animate-error">
            {errors.name.message}
          </span>
        )}
      </div>

      <div className="flex flex-col mb-5">
        <label htmlFor="email">Correo electrónico</label>
        <input
          {...register("email", {
            required: "El correo electrónico es requerido",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Correo electrónico no válido",
            },
          })}
          className={clsx(
            "px-5 py-2 border bg-gray-200 rounded",
            errors.email && "border-red-500",
          )}
          type="email"
        />
        {errors.email && (
          <span className="text-red-500 animate-error">
            {errors.email.message}
          </span>
        )}
      </div>

      <div className="flex flex-col mb-5">
        <label htmlFor="email">Contraseña</label>
        <input
          {...register("password", { required: "La contraseña es requerida" })}
          className={clsx(
            "px-5 py-2 border bg-gray-200 rounded",
            errors.password && "border-red-500",
          )}
          type="password"
        />

        {errors.password && (
          <span className="text-red-500 animate-error">
            {errors.password.message}
          </span>
        )}
      </div>

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
