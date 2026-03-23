import { JSX } from "react";

import Link from "next/link";

interface Props {
  href: string;
  classCustom?: string;
  icon: JSX.Element;
  name: string;
}

export const SidebarLink = ({ href, classCustom, icon, name }: Props) => {
  const defaultClasses =
    "flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all";

  return (
    <Link
      href={href}
      className={
        classCustom ? `${classCustom} ${defaultClasses}` : defaultClasses
      }
    >
      {icon}

      <span className="ml-3 text-xl">{name}</span>
    </Link>
  );
};
