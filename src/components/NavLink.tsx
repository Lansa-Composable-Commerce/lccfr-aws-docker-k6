import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { menuData } from "@/data/static/menu";

const NavLink = () => {
  const pathname = usePathname();
  return (
    <nav>
      <ul className="hidden items-center justify-between gap-3 lg:gap-4 xl:gap-6 lg:flex">
        {menuData.map(({ name, href }) => {
          const isActive = pathname === href;
          return (
            <li
              key={href}
              /* className={`text-gray01 text-sm cursor-pointer hover:text-slate-800 transition-[width] duration-300 ease hover:underline ${
                isActive
                  ? "w-full font-bold underline text-slate-800 border-b border-slate-800"
                  : "w-0"
              }`}*/
            >
              <Link href={href} className="relative group">
                {name}
                <span
                  className={`h-[1px] inline-block bg-brand absolute left-0 -bottom-0.5 group-hover:w-full transition-[width] ease duration-300 ${
                    isActive ? "w-full" : "w-0"
                  }`}
                >
                  &nbsp;
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default NavLink;
