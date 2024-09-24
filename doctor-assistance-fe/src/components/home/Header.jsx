import React from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';

import logo from '@/assets/images/svg/logo-icon.svg';

export default function Header() {
    return (
        <nav className="py-3 md:py-4 section-padding sticky top-0 left-0 z-50 bg-white border-b shadow-md">
            <div className="mx-auto max-w-7xl flex justify-between items-center">
                
                <Link to={'/'} className="flex items-center">
                    <img src={logo} alt="Logo" className="w-8 h-8" />
                    <span className="ml-3 font-semibold text-md text-primary hidden xs:block">Doctor Assistance</span>
                </Link>
                
                <div className="flex items-center space-x-4">
                    <Button variant='ghost' className='hidden md:block'>
                        <Link to={'/signup'}>Signup</Link>
                    </Button>
                    <Button>
                        <Link to={'/login'}>Login</Link>
                    </Button>
                </div>
            
            </div>
        </nav>
    );
}
