"use client";

import { Country } from "@/interfaces";
import { useAddressStore } from "@/store";
import clsx from "clsx";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type FormInputs = {
  firstName: string;
  lastName: string;
  address: string;
  address2?: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
  rememberAddress: boolean;
};

interface Props {
  countries: Country[];
}

export const AddressForm = ({ countries }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<FormInputs>();
  const setAddress = useAddressStore(state => state.setAddress);
  const address = useAddressStore(state => state.address);

  const onSubmit = (data: FormInputs) => {
    setAddress(data);
  }

  useEffect(() => {
    if (!address.firstName) return;
    reset({
      ...address,
      rememberAddress: false,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-2 sm:gap-5 sm:grid-cols-2"
    >
      <div className="flex flex-col mb-2">
        <span>Nombres</span>
        <input
          type="text"
          className={clsx(
            "p-2 border rounded-md bg-gray-200",
            errors.firstName && "border-red-500",
          )}
          {...register("firstName", { required: "Este campo es obligatorio" })}
        />
        {errors.firstName && (
          <span className="text-red-500 animate-error">
            {errors.firstName.message}
          </span>
        )}
      </div>

      <div className="flex flex-col mb-2">
        <span>Apellidos</span>
        <input
          type="text"
          className={clsx(
            "p-2 border rounded-md bg-gray-200",
            errors.lastName && "border-red-500",
          )}
          {...register("lastName", { required: "Este campo es obligatorio" })}
        />
        {errors.lastName && (
          <span className="text-red-500 animate-error">
            {errors.lastName.message}
          </span>
        )}
      </div>

      <div className="flex flex-col mb-2">
        <span>Dirección</span>
        <input
          type="text"
          className={clsx(
            "p-2 border rounded-md bg-gray-200",
            errors.address && "border-red-500",
          )}
          {...register("address", { required: "Este campo es obligatorio" })}
        />
        {errors.address && (
          <span className="text-red-500 animate-error">
            {errors.address.message}
          </span>
        )}
      </div>

      <div className="flex flex-col mb-2">
        <span>Dirección 2 (opcional)</span>
        <input
          type="text"
          className="p-2 border rounded-md bg-gray-200"
          {...register("address2")}
        />
      </div>

      <div className="flex flex-col mb-2">
        <span>Código postal</span>
        <input
          type="text"
          className={clsx(
            "p-2 border rounded-md bg-gray-200",
            errors.postalCode && "border-red-500",
          )}
          {...register("postalCode", { required: "Este campo es obligatorio" })}
        />
        {errors.postalCode && (
          <span className="text-red-500 animate-error">
            {errors.postalCode.message}
          </span>
        )}
      </div>

      <div className="flex flex-col mb-2">
        <span>Ciudad</span>
        <input
          type="text"
          className={clsx(
            "p-2 border rounded-md bg-gray-200",
            errors.city && "border-red-500",
          )}
          {...register("city", { required: "Este campo es obligatorio" })}
        />
        {errors.city && (
          <span className="text-red-500 animate-error">
            {errors.city.message}
          </span>
        )}
      </div>

      <div className="flex flex-col mb-2">
        <span>País</span>
        <select
          className={clsx(
            "p-2 border rounded-md bg-gray-200",
            errors.country && "border-red-500",
          )}
          {...register("country", { required: "Este campo es obligatorio" })}
        >
          <option value="">[ Seleccione ]</option>
          {countries.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>
        {errors.country && (
          <span className="text-red-500 animate-error">
            {errors.country.message}
          </span>
        )}
      </div>

      <div className="flex flex-col mb-2">
        <span>Teléfono</span>
        <input
          type="text"
          className={clsx(
            "p-2 border rounded-md bg-gray-200",
            errors.phone && "border-red-500",
          )}
          {...register("phone", { required: "Este campo es obligatorio" })}
        />
        {errors.phone && (
          <span className="text-red-500 animate-error">
            {errors.phone.message}
          </span>
        )}
      </div>

      <div className="flex flex-col mb-2">
        <div className="inline-flex items-center mb-5">
          <label
            className="relative flex cursor-pointer items-center rounded-full p-3"
            htmlFor="checkbox"
            data-ripple-dark="true"
          >
            <input
              type="checkbox"
              className="border-gray-500 before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:bg-blue-500 checked:before:bg-blue-500 hover:before:opacity-10"
              id="checkbox"
              {...register("rememberAddress")}
            />
            <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </label>
          <span className="ml-2 text-sm">¿Recordar dirección?</span>
        </div>
        <button
          type="submit"
          className={clsx(
            "btn-primary",
            !isValid && "btn-disabled",
          )}
        >
          Siguiente
        </button>
      </div>
    </form>
  );
};
