import React from "react";
import {
  Button,
  Navbar,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
  TextInput,
} from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon } from "react-icons/fa";

const Header = () => {
  const path = useLocation().pathname;
  return (
    <Navbar className="border-b-2">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm 
        sm:text-xl font-semibold dark: text-white"
      >
        <span
          className="px-2 py-1 bg-linear-to-r 
        from-slate-900 via-teal-500 to-cyan-400
        rounded-lg text-white"
        >
          Nexora
        </span>
        <span className="text-black dark:text-white">Blogs</span>
      </Link>

      <form>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
        />
      </form>

      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>

      <div className="flex gap-2 md:order-2">
        <Button className="w-12 h-10 hidden sm:inline" color="gray" pill>
          <FaMoon />
        </Button>

        <Link to="/sign-in">
          <Button
            className="bg-linear-to-r 
        from-slate-900 via-teal-500 to-cyan-400"
          >
            Sign In
          </Button>
        </Link>
      </div>

      <NavbarToggle />

      <NavbarCollapse>
        <NavbarLink active={path === "/"} as={Link} href="/">
          Home
        </NavbarLink>
        <NavbarLink active={path === "/about"} as={Link} href="/about">
          About
        </NavbarLink>
        <NavbarLink active={path === "/projects"} as={Link} href="/projects">
          Projects
        </NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
};

export default Header;
