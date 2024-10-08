import React from 'react'

export default function ListGrid({ data, icon: Icon, color }) {
    return (
        <div className="grid grid-cols-1 text-sm sm:grid-cols-2 gap-4 mt-4">
            {data.length > 0 ? (
                data.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <Icon size={20} className={`${color}`} />
                        <p className="text-gray-700">{item.name}</p>
                    </div>
                ))
            ) : (
                <p className="text-gray-600 text-sm">N/A</p>
            )}
        </div>
    )
}
