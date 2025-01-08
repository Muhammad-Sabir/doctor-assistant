import React, { useState } from 'react'

import ProfileTabs from '@/components/shared/ProfileTabs'
import DefaultSchedule from '@/components/schedules/DefaultSchedule';
import SpecificSchedule from '@/components/schedules/SpecificSchedule';

export default function MySchedule() {

  const [activeTab, setActiveTab] = useState("defaultSchedule");

  const scheduleTabs = [
    { label: "Setup Default Schedule", key: "defaultSchedule" },
    { label: "Setup for Specific Date", key: "specificSchedule" },
  ];

  const tabComponents = {
    defaultSchedule: <DefaultSchedule/>,
    specificSchedule: <SpecificSchedule/>
  };

  return (
    <div className='px-2 pb-4'>
      <h2 className="text-md font-medium text-primary mb-2">My Schedule:</h2>
      <p className="text-gray-600 text-sm mb-4">View your available time slots and manage your schedule efficiently.</p>
    
      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={scheduleTabs} />

      {tabComponents[activeTab]}

    </div>
  )
}
