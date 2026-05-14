"use client";

import clsx from "clsx";
import {
  IoCloseOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoPeopleOutline,
  IoPersonOutline,
  IoSearchOutline,
  IoShirtOutline,
  IoTicketOutline,
} from "react-icons/io5";

import { useUIStore } from "@/store";
import { SidebarLink } from "./SidebarLink";
import { logout } from "@/actions";
import { authClient } from "@/lib/auth-client";

export const Sidebar = () => {
  const isSideMenuOpen = useUIStore((state) => state.isSideMenuOpen);
  const closeMenu = useUIStore((state) => state.closeSideMenu);
  const { data: session, isPending, refetch } = authClient.useSession();

  const isAuthenticated = !!session;
  const isAdmin = session?.user?.role === "admin";

  const handleLogout = async () => {
    await logout();
    await refetch();
  }

  return (
    <div>
      {/* Background black */}
      {isSideMenuOpen && (
        <div className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30" />
      )}

      {/* Blur */}
      {isSideMenuOpen && (
        <div
          onClick={closeMenu}
          className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm"
        />
      )}

      {/* Sidemenu */}
      <nav
        className={clsx(
          "fixed p-5 right-0 top-0 w-full sm:w-125 h-screen bg-white z-20 shadow-2xl transform transition-all duration-300 overflow-y-auto",
          {
            "translate-x-full": !isSideMenuOpen,
          },
        )}
      >
        <IoCloseOutline
          size={50}
          className="absolute top-5 right-5 cursor-pointer"
          onClick={closeMenu}
        />

        {/* Input */}
        <div className="relative mt-14">
          <IoSearchOutline size={20} className="absolute top-2 left-2" />
          <input
            type="text"
            placeholder="Buscar"
            className="w-full bg-gray-50 rounded pl-10 py-1 pr-10 border-b-2 text-xl border-gray-200 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Menú */}
        {!isAuthenticated && !isPending && (
          <SidebarLink
            href={"/auth/login"}
            icon={<IoLogInOutline size={30} />}
            name={"Ingresar"}
          />
        )}

        {isAuthenticated && (
          <>
            <SidebarLink
              href={"/profile"}
              icon={<IoPersonOutline size={30} />}
              name={"Perfil"}
            />

            <SidebarLink
              href={"/orders"}
              icon={<IoTicketOutline size={30} />}
              name={"Ordenes"}
            />

            <SidebarLink
              icon={<IoLogOutOutline size={30} />}
              name={"Salir"}
              type="button"
              onClick={() => handleLogout()}
            />
          </>
        )}

        {isAdmin && (
          <>
            <div className="w-full h-px bg-gray-200 my-10" />

            <SidebarLink
              href={"/"}
              icon={<IoShirtOutline size={30} />}
              name={"Productos"}
            />

            <SidebarLink
              href={"/admin/orders"}
              icon={<IoTicketOutline size={30} />}
              name={"Ordenes"}
            />

            <SidebarLink
              href={"/"}
              icon={<IoPeopleOutline size={30} />}
              name={"Usuarios"}
            />
          </>
        )}
      </nav>
    </div>
  );
};
