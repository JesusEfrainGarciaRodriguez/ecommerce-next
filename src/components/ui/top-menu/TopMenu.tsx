import Link from "next/link";
import { IoSearchOutline } from "react-icons/io5";
import ButtonMenu from "./ButtonMenu";
import { ButtonCart } from "@/components";

export default function TopMenu() {
  return (
    <nav className="flex px-5 justify-between items-center w-full">
      <div>
        <Link href={"/"}>
          <span className="antialiased font-bold">Ecommerce</span>
          <span> | Tienda</span>
        </Link>
      </div>

      <div className="hidden sm:block">
        <Link
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
          href={"/gender/men"}
        >
          Hombres
        </Link>
        <Link
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
          href={"/gender/women"}
        >
          Mujeres
        </Link>
        <Link
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
          href={"/gender/kid"}
        >
          Niños
        </Link>
      </div>

      <div className="flex items-center">
        <Link href="/search" className="mx-2">
          <IoSearchOutline className="w-5 h-5" />
        </Link>

        <ButtonCart />

        <ButtonMenu />
      </div>
    </nav>
  );
}
