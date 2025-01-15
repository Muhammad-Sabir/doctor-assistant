import React from 'react';
import { Link } from 'react-router-dom';
import { MdOutlineArrowForwardIos, MdOutlineInstallMobile } from 'react-icons/md';
import { LuCopyright } from "react-icons/lu";
import { HashLink } from 'react-router-hash-link';

import { Button } from '@/components/ui/button';

import logo from '@/assets/images/svg/logo-icon.svg';

const year = new Date().getFullYear()

const Footer = () => {
  const quicklinks1 = [
    { name: 'Home', url: '#home' },
    { name: 'About', url: '#about' },
    { name: 'Features', url: '#feature' },
  ];
  const quicklinks2 = [
    { name: 'Doctors', url: '#topDoctors' },
    { name: 'Discover', url: '#discover' },
    { name: 'Faqs', url: '#faq' },

  ];
  const quicklinks3 = [
    { name: 'SignUp', url: '/signup' },
    { name: 'Login', url: '/login' },
    { name: 'Get Mobile App', url: 'https://drive.google.com/drive/folders/18jguCAutzK3pfUGV5pJvPum2tcF7_5-9?usp=drive_link' },
  ];

  return (
    <footer className="w-full mt-8 lg:mt-14 section-padding border-t border-gray-300">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 py-6">

        <div className="col-span-full mb-10 lg:col-span-2 lg:mb-0 text-center lg:text-left">
          <Link to={'/'} className="flex justify-center lg:justify-start">
            <img src={logo} alt="Logo" className="w-8 h-8" />
            <span className="ml-3 font-semibold text-md text-primary">Doctor Assistance</span>
          </Link>
          <p className="my-4 text-sm text-gray-500 lg:max-w-xs">Simplifying your healthcare journey with smart solutions.</p>
          <Button className="block mx-auto lg:mx-0 my-4">
            <Link className="flex" to="/signup"> Get Started <MdOutlineArrowForwardIos className="mt-1 ml-1" /></Link>
          </Button>
        </div>

        {[{ title: 'Quick Links', items: quicklinks1 },
        { title: 'Quick Links', items: quicklinks2 },
        { title: 'For Users', items: quicklinks3 }].map(({ title, items }, index) => (
          <div key={index} className="lg:mx-auto">
            <h4 className="text-md text-primary font-medium mb-4">{title}</h4>
            <ul className="text-sm transition-all duration-500">
              {items.map((item, idx) => (
                <li key={idx} className="mb-3">
                  <HashLink to={item.url} className="cursor-pointer text-gray-600 hover:text-primary text-md">
                    {item.name}
                  </HashLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="py-6 border-t border-gray-300">
        <span className="flex text-sm text-gray-500"><LuCopyright className='mt-1 mr-1' />copyright {year} All rights reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;
