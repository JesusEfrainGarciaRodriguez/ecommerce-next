import { JSX } from "react";
import Link from "next/link";
import { useUIStore } from "@/store";

type BaseProps = {
  classCustom?: string;
  icon: JSX.Element;
  name: string;
};

type ButtonProps = BaseProps & {
  type: "button";
  onClick?: () => void;
};

type LinkProps = BaseProps & {
  type?: "link";
  href: string;
};

type Props = ButtonProps | LinkProps;

export const SidebarLink = (props: Props) => {
  const defaultClasses =
    "flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all";

  const closeMenu = useUIStore((state) => state.closeSideMenu);

  const className = props.classCustom
    ? `${props.classCustom} ${defaultClasses}`
    : defaultClasses;

  if (props.type === "button") {
    return (
      <button
        className={className}
        onClick={() => {
          props.onClick?.();
          closeMenu();
        }}
      >
        {props.icon}
        <span className="ml-3 text-xl">{props.name}</span>
      </button>
    );
  }

  return (
    <Link
      href={props.href}
      className={className}
      onClick={closeMenu}
    >
      {props.icon}
      <span className="ml-3 text-xl">{props.name}</span>
    </Link>
  );
};
