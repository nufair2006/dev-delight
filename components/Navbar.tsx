import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <header>
      <nav>
        <Link href={"/"} className="logo">
          <Image src={"/icons/logo.png"} alt="logo" width={20} height={20} />
          <p>DevDelight</p>
        </Link>
        <ul>
          <li>
            <Link href={"/="}>Home</Link>
          </li>
          <li>
            <Link href={"/events"}>Events</Link>
          </li>
          <li>
            <Link href={"/create"}>Create</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
