import React from 'react'

import barsSVG from '@/assets/images/svg/pulse.svg';

export default function Pulse() {
    return (
        <div className="flex items-center gap-2">
            <div className='flex justify-center items-center'>
                <img src={barsSVG} alt="Loading" className="w-9 h-9" />
            </div>
            <span className="text-gray-500">Listening...</span>
        </div>
    )
}