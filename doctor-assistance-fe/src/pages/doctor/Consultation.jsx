import React, { useState } from 'react'

import ProfileTabs from '@/components/shared/ProfileTabs';
import Transcript from '@/components/consultation/Transcript';
import Notes from '@/components/consultation/Notes';
import Prescriptions from '@/components/consultation/Prescriptions';
import VideoCall from '@/components/consultation/VideoCall';

export default function Consultation() {

  const [activeTab, setActiveTab] = useState("consultationTranscript");

  const consultationTabs = [
    { label: "Video Call", key: "videoCall" },
    { label: "Transcript", key: "consultationTranscript" },
    { label: "Notes", key: "consultationNotes" },
    { label: "Prescriptions", key: "consultationPrescriptions" },
  ];

  const tabComponents = {
    videoCall: <VideoCall/>,
    consultationTranscript: <Transcript/>,
    consultationNotes: <Notes/>,
    consultationPrescriptions: <Prescriptions/>
  };

  return (
    <section className="mx-2">
        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={consultationTabs} />
        {tabComponents[activeTab]}
    </section>
  )
}
