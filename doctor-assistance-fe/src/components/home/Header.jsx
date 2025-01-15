import React from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';

import logo from '@/assets/images/svg/logo-icon.svg';

export default function Header() {
    return (
        <nav className="sticky top-0 left-0 z-50 py-3 bg-white border-b shadow-md md:py-4 section-padding">
            <div className="flex items-center justify-between mx-auto">
                
                <Link to={'/'} className="flex items-center">
                    <img src={logo} alt="Logo" className="w-8 h-8" />
                    <span className="hidden ml-3 font-semibold text-md text-primary xs:block">Doctor Assistance</span>
                </Link>
                
                <div className="flex items-center space-x-4">
                    <Button variant='ghost' className='hidden md:block'>
                        <Link to={'/signup'}>Sign Up</Link>
                    </Button>
                    <Button>
                        <Link to={'/login'}>Login</Link>
                    </Button>
                </div>
            
            </div>
        </nav>
    );
}
