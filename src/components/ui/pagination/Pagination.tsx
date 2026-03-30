"use client";
import { generatePaginationNumbers } from "@/utils";
import clsx from "clsx";
import Link from "next/link";
import { redirect, usePathname, useSearchParams } from "next/navigation";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

interface PaginationProps {
  totalPages: number;
}

export const Pagination = ({ totalPages }: PaginationProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageString = searchParams.get('page') ?? 1;
  const currentPage = isNaN( +pageString ) ? 1 : +pageString;

  if (currentPage < 1 || isNaN(+pageString) ) {
    redirect(pathname);
  }

  const paginationNumbers = generatePaginationNumbers(currentPage, totalPages);

  const createPageUrl = (page: number | string): string => {
    const params = new URLSearchParams(searchParams);

    if (page === "...") {
      return `${pathname}?${params.toString()}`;
    }

    if (+page <= 0) {
      return `${pathname}`;
    }

    if (+page > totalPages) {
      return `${pathname}?${params.toString()}`;
    }

    params.set("page", page.toString());

    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex justify-center">
      <nav>
        <ul className="flex items-center list-style-none">
          <li>
            <Link
              className="block py-1.5 px-3 border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none"
              href={createPageUrl(currentPage - 1)}
            >
              <IoChevronBackOutline size={30} />
            </Link>
          </li>

          {paginationNumbers.map((page, index) => (
            <li
              key={index}
            >
              <Link
                className={
                    clsx(
                      "block py-1.5 px-3 border-0 outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none",
                      {
                        'bg-blue-600 shadow-sm text-white hover:text-white hover:bg-blue-700': page === currentPage
                      }
                    )
                  }
                href={createPageUrl(page)}
              >
                {page}
              </Link>
            </li>
          ))}

          <li>
            <Link
              className="block py-1.5 px-3 border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none"
              href={createPageUrl(currentPage + 1)}
            >
              <IoChevronForwardOutline size={30} />
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
