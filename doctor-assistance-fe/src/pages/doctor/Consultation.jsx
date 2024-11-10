import React, { useState } from "react";
import { useParams } from "react-router-dom";

import ProfileTabs from "@/components/shared/ProfileTabs";
import Transcript from "@/components/consultation/Transcript";
import Notes from "@/components/consultation/Notes";
import Prescriptions from "@/components/consultation/Prescriptions";
import VideoCall from "@/components/consultation/VideoCall";

export default function Consultation() {
  const [activeTab, setActiveTab] = useState("consultationTranscript");
  const [notes, setNotes] = useState(null);
  const { consultationId } = useParams();

  const consultationTabs = [
    { label: "Video Call", key: "videoCall" },
    { label: "Transcript", key: "consultationTranscript" },
    { label: "Notes", key: "consultationNotes" },
    { label: "Prescriptions", key: "consultationPrescriptions" },
  ];

  const tabComponents = {
    videoCall: <VideoCall />,
    consultationTranscript: (
      <Transcript consultationId={consultationId} setNotes={setNotes} />
    ),
    consultationNotes: notes ? (
      <Notes notes={notes} />
    ) : (
      <h1 className="flex items-center justify-center w-full h-72">
        Waiting for notes to be generated, please wait.
      </h1>
    ),
    consultationPrescriptions: <Prescriptions />,
  };

  return (
    <section className="mx-2">
      <ProfileTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={consultationTabs}
      />
      {tabComponents[activeTab]}
    </section>
  );
}
