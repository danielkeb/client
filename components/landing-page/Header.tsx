"use client";

import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";
import { BiDonateHeart, BiMenu, BiX } from "react-icons/bi";

export default function Header() {
  const [navHidden, setNavHidden] = useState(true);

  return (
    <div className="bg-accent text-accent-content">
      <nav className="container relative flex items-center justify-between py-1">
        {/* Logo icon */}
        <Link href="/">
          <BiDonateHeart size={40} />
        </Link>

        {/* Nav links */}
        <div
          className={clsx(
            { "hidden lg:flex": navHidden },
            "absolute right-0 top-full flex min-h-fit w-full items-center rounded-md px-5 py-4 shadow-lg duration-500 md:py-0 lg:static lg:w-auto lg:shadow-none",
          )}
        >
          <ul className="flex w-full flex-col text-lg md:p-4 lg:flex-row lg:items-center lg:gap-8 lg:p-0 [&>li]:py-4">
            <li>
              <Link href="/contact-us">Contact Us</Link>
            </li>
            <li>
              <Link href="/sign-in">
                <button className="btn">Sign In</button>
              </Link>
            </li>
          </ul>
        </div>

        {/* Hamburger menu on small screens */}
        <div className="flex items-center gap-6 lg:hidden">
          {navHidden ? (
            <BiMenu size={40} onClick={() => setNavHidden(!navHidden)} />
          ) : (
            <BiX size={40} onClick={() => setNavHidden(!navHidden)} />
          )}
        </div>
      </nav>
    </div>
  );
}
