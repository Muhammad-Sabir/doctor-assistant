import React, { useEffect, useState } from "react";
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

  let consultationTabs = [
    { label: "Video Call", key: "videoCall" },
    { label: "Transcript", key: "consultationTranscript" },
    { label: "Notes", key: "consultationNotes" },
    { label: "Prescriptions", key: "consultationPrescriptions" },
  ];

  const { data: appointmentData, isFetching: isAppointmentFetching } =
    useFetchQuery({
      url: `appointments/${appointmentId}/`,
      queryKey: ["appointmentConsultation"],
      fetchFunction: fetchWithAuth,
    });

  const { data: soapData, isFetching: soapIsFetching } = useFetchQuery({
    url: `soap-notes/?consultation_id=${consultationId}`,
    queryKey: ["consultationSoap", consultationId],
    fetchFunction: fetchWithAuth,
  });

  useEffect(() => {
    if (soapData && soapData?.results[0]) {
      setNotes(soapData?.results[0]);
    }
  }, [soapData]);

  const isCompleted = appointmentData?.completed || false;
  const appointmentMode = appointmentData?.appointment_mode || "physical";

  if (isCompleted || appointmentMode == "physical") {
    consultationTabs = consultationTabs.filter(
      (tab) => tab.key !== "videoCall"
    );
  }

  const tabComponents = {
    videoCall: <VideoCall isCompleted={isCompleted} />,
    consultationTranscript: (
      <Transcript
        consultationId={consultationId}
        setNotes={setNotes}
        isCompleted={isCompleted}
      />
    ),
    consultationNotes: notes ? (
      <Notes notes={notes?.description} isCompleted={isCompleted} />
    ) : (
      <h1 className="flex items-center justify-center w-full h-72">
        Waiting for notes to be generated, please wait.
      </h1>
    ),
    consultationPrescriptions: (
      <Prescriptions
        consultationId={consultationId}
        isCompleted={isCompleted}
      />
    ),
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
