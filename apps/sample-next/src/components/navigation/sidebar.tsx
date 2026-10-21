"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoDark from "@/../public/assets/logo-dark.svg";
import Logo from "@/../public/assets/logo.svg";
import { useNavigation } from "@/context/navigation";
import { SideBarNavigationItem, sideBarNavigationItems } from "@/data/navigation";
import { classNames } from "@/utils/css";

export function Sidebar() {
  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 dark:border-none bg-white px-6 pb-4 dark:bg-neutral-900">
      <div className="flex h-22 shrink-0 items-center">
        <Image className="h-14 w-auto dark:hidden" src={Logo} alt="Actito" />
        <Image className="h-14 w-auto hidden dark:block" src={LogoDark} alt="Actito" />
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {sideBarNavigationItems.map((item) => (
                <NavigationItem key={item.href} item={item} />
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
}

function NavigationItem({ item }: NavigationItemProps) {
  const { label, href, icon: Icon } = item;
  const { sidebar } = useNavigation();

  const pathname = usePathname();
  const isActive = useMemo(
    () => pathname === href || (href !== "/" && pathname.startsWith(href)),
    [pathname, href],
  );

  return (
    <li>
      <Link
        href={href}
        onClick={() => sidebar.setOpen(false)}
        className={classNames(
          isActive
            ? "bg-gray-50 text-indigo-600 dark:bg-neutral-800 dark:text-indigo-400"
            : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50 dark:text-gray-100 hover:dark:bg-neutral-800 hover:dark:text-indigo-400",
          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
        )}
      >
        <Icon
          className={classNames(
            isActive ? "text-indigo-600 dark:text-indigo-400 " : "text-gray-400 dark:text-gray-200",
            "h-6 w-6 shrink-0 group-hover:text-indigo-600 group-hover:dark:text-indigo-400",
          )}
          aria-hidden="true"
        />
        {label}

        {item.EndContent && (
          <div className="flex justify-end items-center w-full">
            <item.EndContent />
          </div>
        )}
      </Link>
    </li>
  );
}

interface NavigationItemProps {
  item: SideBarNavigationItem;
}
