import React from 'react'

import loadingSVG from '@/assets/images/svg/loading.svg';

export default function Loading() {
    return (
        <div className='flex justify-center items-center h-[70vh]'>
            <img src={loadingSVG} alt="Loading" className="w-24 h-24 -ml-2" />
        </div>
    )
}
