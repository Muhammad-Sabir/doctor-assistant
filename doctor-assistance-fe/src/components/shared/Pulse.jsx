import React from 'react'

import barsSVG from '@/assets/images/svg/pulse.svg';

export default function Pulse() {
    return (
        <div className='flex justify-center items-center'>
            <img src={barsSVG} alt="Loading" className="w-9 h-9" />
        </div>
    )
}