import React, { useEffect } from 'react';

export default function ProfileTabs({ activeTab, setActiveTab, tabs }) {

    useEffect(() => {
        const savedTab = sessionStorage.getItem('activeTab');
        const isValidTab = tabs.some(tab => tab.key === savedTab);
        
        if (savedTab && isValidTab) {
            setActiveTab(savedTab);
        } else {
            const defaultTab = tabs[0]?.key;
            setActiveTab(defaultTab);
            sessionStorage.setItem('activeTab', defaultTab);
        }
    }, [setActiveTab, tabs]);

    const handleTabClick = (tabKey) => {
        setActiveTab(tabKey);
        sessionStorage.setItem('activeTab', tabKey); 
    };

    return (
        <div className="border-b border-gray-300 mt-7 flex max-sm:flex-wrap max-sm:justify-center items-center gap-3 md:gap-5 lg:gap-7 mb-5">
            {tabs.map(tab => (
                <div
                    key={tab.key}
                    className={`cursor-pointer text-gray-700 font-semibold text-sm pb-2 border-b-2 transition-all duration-300
                          ${activeTab === tab.key ? "border-primary text-primary" : "border-transparent hover:text-secondary hover:border-secondary"}`}
                    onClick={() => handleTabClick(tab.key)}
                >
                    {tab.label}
                </div>
            ))}
        </div>
    );
}
