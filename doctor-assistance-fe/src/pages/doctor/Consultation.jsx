import React, { useState } from "react";
import { useParams } from "react-router-dom";

import ProfileTabs from "@/components/shared/ProfileTabs";
import Transcript from "@/components/consultation/Transcript";
import Notes from "@/components/consultation/Notes";
import Prescriptions from "@/components/consultation/Prescriptions";
import VideoCall from "@/components/consultation/VideoCall";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import { fetchWithAuth } from "@/utils/fetchApis";

export default function Consultation() {
  const [activeTab, setActiveTab] = useState("consultationTranscript");
  const [notes, setNotes] = useState(null);
  const { consultationId, appointmentId } = useParams();

  const consultationTabs = [
    { label: "Video Call", key: "videoCall" },
    { label: "Transcript", key: "consultationTranscript" },
    { label: "Notes", key: "consultationNotes" },
    { label: "Prescriptions", key: "consultationPrescriptions" },
  ];

  const { data: appointmentData, isFetching: isAppointmentFetching } = useFetchQuery({
    url: `appointments/${appointmentId}/`,
    queryKey: ['appointmentConsultation'],
    fetchFunction: fetchWithAuth,
  });

  const isCompleted = appointmentData?.completed || false;
  
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
    consultationPrescriptions: <Prescriptions consultationId={consultationId} />,
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
