"use client";

import { generatePagination } from "@/app/lib/utils";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const allPages = generatePagination(currentPage, totalPages);

  return (
    <div className="inline-flex">
      <PaginationArrow
        direction="left"
        href={createPageURL(currentPage - 1)}
        isDisabled={currentPage <= 1}
      />
      <div className="flex -space-x-px">
        {allPages.map((page, index) => {
          let position: 'first' | 'last' | 'single' | 'middle' | undefined;
          if (index === 0) position = 'first';
          if (index === allPages.length - 1) position = 'last';
          if (allPages.length === 1) position = 'single';
          if (page === '...') position = 'middle';
          return (
            <PaginationNumber
              key={`${page}-${index}`}
              href={createPageURL(page)}
              page={page}
              position={position}
              isActive={currentPage === page}
            />
          );
        })}
      </div>
      <PaginationArrow
        direction="right"
        href={createPageURL(currentPage + 1)}
        isDisabled={currentPage >= totalPages}
      />
    </div>
  );
}

function PaginationArrow({ direction, href, isDisabled }: { direction: 'left' | 'right'; href: string; isDisabled: boolean; }) {
  const Icon = direction === 'left' ? ArrowLeftIcon : ArrowRightIcon;
  return (
    <Link
      href={href}
      className={clsx(
        'flex h-10 w-10 items-center justify-center rounded-md border',
        isDisabled ? 'pointer-events-none text-gray-300' : 'hover:bg-gray-100',
      )}
      aria-disabled={isDisabled}
      tabIndex={isDisabled ? -1 : 0}
    >
      <Icon className="w-5" />
    </Link>
  );
}

function PaginationNumber({ href, page, position, isActive }: { href: string; page: number | string; position?: string; isActive: boolean; }) {
  return (
    <Link
      href={href}
      className={clsx(
        'flex h-10 w-10 items-center justify-center border',
        isActive ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100',
        position === 'first' && 'rounded-l-md',
        position === 'last' && 'rounded-r-md',
      )}
    >
      {page}
    </Link>
  );
}
