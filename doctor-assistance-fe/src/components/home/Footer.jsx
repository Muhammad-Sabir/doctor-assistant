import React from 'react';
import { Link } from 'react-router-dom';
import { MdOutlineArrowForwardIos } from 'react-icons/md';
import { LuCopyright } from "react-icons/lu";

import { Button } from '@/components/ui/button';

import logo from '@/assets/images/svg/logo-icon.svg';

const year = new Date().getFullYear()

const Footer = () => {
  const topCities = ['Lahore', 'Islamabad', 'Karachi', 'Multan'];
  const specialties = ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics'];
  const symptoms = ['Cough', 'Fever', 'Fatigue', 'Headache'];

  return (
    <footer className="w-full mt-8 lg:mt-14 section-padding border-t border-gray-300">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 py-8">
        
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

        {[{ title: 'Top Cities', items: topCities },
        { title: 'Top Specialties', items: specialties },
        { title: 'Top Symptoms', items: symptoms }].map(({ title, items }, index) => (
          <div key={index} className="lg:mx-auto">
            <h4 className="text-md text-primary font-medium mb-4">{title}</h4>
            <ul className="text-sm transition-all duration-500">
              {items.map((item, idx) => (
                <li key={idx} className="mb-3">
                  <Link to={'/'} className="cursor-pointer text-gray-600 hover:text-primary">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

      </div>

      <div className="py-6 border-t border-gray-300">
        <span className="flex text-sm text-gray-500"><LuCopyright className='mt-1 mr-1'/>copyright {year} All rights reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;
