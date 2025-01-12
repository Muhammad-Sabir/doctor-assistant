import React from "react";
import { Link } from "react-router-dom";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { LuCopyright } from "react-icons/lu";

import { Button } from "@/components/ui/button";

import logo from "@/assets/images/svg/logo-icon.svg";

const year = new Date().getFullYear();

const Footer = () => {
  return (
    <footer className="w-full mt-8 border-t border-gray-300 lg:mt-14 section-padding">
      <div className="grid grid-cols-2 gap-8 py-8 md:grid-cols-3 lg:grid-cols-2">
        <div className="flex justify-between w-full mb-10 text-center col-span-full lg:col-span-2 lg:mb-0 lg:text-left">
          <div>
            <Link to={"/"} className="flex justify-center lg:justify-start">
              <img src={logo} alt="Logo" className="w-8 h-8" />
              <span className="ml-3 font-semibold text-md text-primary">
                Doctor Assistance
              </span>
            </Link>
            <p className="my-4 text-sm text-gray-500 lg:max-w-xs">
              Simplifying your healthcare journey with smart solutions.
            </p>
          </div>
          <Button className="block mx-auto my-4 lg:mx-0">
            <Link className="flex" to="/signup">
              {" "}
              Get Started <MdOutlineArrowForwardIos className="mt-1 ml-1" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="py-6 border-t border-gray-300">
        <span className="flex text-sm text-gray-500">
          <LuCopyright className="mt-1 mr-1" />
          Copyright {year}. All rights reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
