"use client";
import clsx from "clsx";
import { useFormStatus } from "react-dom";

export function ButtonSubmit() {
  const { pending } = useFormStatus();
  return (
    <button
      className={clsx({ "btn-primary": !pending, "btn-disabled": pending })}
      disabled={pending}
    >
      Ingresar
    </button>
  );
}