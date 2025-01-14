import React, { useState, useEffect, useRef } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { IoCopyOutline, IoCopy, IoPlayOutline } from "react-icons/io5";
import { PiPauseLight, PiStop } from "react-icons/pi";
import { TbUserCircle } from "react-icons/tb";

import { Button } from "@/components/ui/button";
import Pulse from "@/components/shared/Pulse";
import { useAudioTranscription } from "@/hooks/useAudioTranscription";
import { useCreateUpdateMutation } from "@/hooks/useCreateUpdateMutation";
import { fetchWithAuth } from "@/utils/fetchApis";
import { useFetchQuery } from "@/hooks/useFetchQuery";

const LABEL_SPEAKER = {
  spk_0: "Doctor",
  spk_1: "Patient",
};

export default function TranscriptionPage({
  consultationId,
  setNotes,
  isCompleted,
}) {
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  const transcriptEndRef = useRef(null);

  const {
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    transcription,
    loadingMessage,
  } = useAudioTranscription(consultationId);

  const { data, isFetching, isError } = useFetchQuery({
    url: `transcriptions/?consultation_id=${consultationId}`,
    queryKey: ["consultationTranscription", consultationId],
    fetchFunction: fetchWithAuth,
  });

  const updateTranscriptionMutation = useCreateUpdateMutation({
    url: `transcriptions/${data?.results[0]?.id}/`,
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    fetchFunction: fetchWithAuth,
    onErrorMessage: "Failed to Update Transcription",
  });

  useEffect(() => {
    if (transcription.length) {
      setChatMessages(transcription);
    } else if (data?.results && data?.results[0]?.transcription_text) {
      const inValidData = data?.results[0]?.transcription_text;
      const validJsonString = inValidData.replace(/'/g, '"');
      const arrayOfObjects = JSON.parse(validJsonString);

      setChatMessages(arrayOfObjects);
    }
  }, [transcription, data]);

  const scrollToEnd = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    let timer;
    if (isTranscribing && !isPaused) {
      timer = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTranscribing, isPaused]);

  useEffect(() => {
    scrollToEnd(transcriptEndRef);

    if (isMounted) {
      const filteredMessages = chatMessages.filter(
        (obj) => obj.transcript !== null && obj.transcript !== ""
      );

      if (filteredMessages.length !== chatMessages.length) {
        setChatMessages(filteredMessages);
      }

      updateTranscriptionMutation.mutate(
        JSON.stringify({
          transcription_text: JSON.stringify(chatMessages).replace(/"/g, "'"),
        })
      );
    } else {
      setIsMounted(true);
    }
  }, [chatMessages]);

  const generateNotesMutation = useCreateUpdateMutation({
    url: `soap-notes/`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    fetchFunction: fetchWithAuth,
    onSuccessMessage: "Successfully generated SOAP Notes.",
    onErrorMessage: "Failed to generate SOAP Notes.",
  });

  const handleNotesGeneration = () => {
    updateTranscriptionMutation.mutate(
      JSON.stringify({
        consultation: consultationId,
        transcription_text: JSON.stringify(chatMessages).replace(/"/g, "'"),
      })
    );

    generateNotesMutation.mutate(
      JSON.stringify({
        consultation: consultationId,
        transcription_text: chatMessages,
      })
    );
  };

  const handleStart = () => {
    setIsTranscribing(true);
    setElapsedTime(0);
    startRecording();
  };

  const handleStop = () => {
    setIsTranscribing(false);
    setIsPaused(false);
    setElapsedTime(0);
    stopRecording();
  };

  const togglePauseResume = () => {
    isPaused ? resumeRecording() : pauseRecording();
    setIsPaused((prev) => !prev);
  };

  const handleCopy = () => {
    const textToCopy = chatMessages
      .map((msg) => `${msg.sender}: ${msg.text} (${msg.time})`)
      .join("\n");
    navigator.clipboard.writeText(textToCopy).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1000);
    });
  };

  const handleSend = () => {
    if (isCompleted) return;
    if (additionalInfo.trim()) {
      const newMessage = {
        id: chatMessages.length + 1,
        transcript: additionalInfo,
        speaker_label: "spk_0",
        start_time: "None",
        end_time: "None",
      };
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);
      setAdditionalInfo("");
    }
  };

  const handleEditMessage = (e, id) => {
    if (isCompleted) return;
    const updatedText = e.target.textContent;
    setChatMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === id ? { ...msg, transcript: updatedText } : msg
      )
    );
  };

  return (
    <div className="mx-2 flex flex-col h-[76vh]">
      <div className="flex-grow overflow-y-auto bg-gray-50">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.speaker_label === "spk_0" ? "justify-end" : "justify-start"
            } mb-10`}
          >
            <div
              className={`flex items-center ${
                msg.speaker_label === "spk_0" ? "flex-row-reverse" : ""
              } gap-3`}
            >
              <TbUserCircle size={30} className="text-gray-400" />

              <div
                className={`${
                  msg.speaker_label === "spk_0" ? "bg-blue-100" : "bg-gray-200"
                } max-w-lg px-4 py-2 rounded-md shadow-md relative`}
              >
                <div className="flex gap-1 text-sm text-gray-800">
                  <span>{LABEL_SPEAKER[msg.speaker_label]}:</span>
                  <div
                    contentEditable
                    suppressContentEditableWarning={true}
                    onBlur={(e) => handleEditMessage(e, msg.id)}
                    className="break-words focus:text-primary focus:outline-none"
                  >
                    {msg.transcript}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={transcriptEndRef} />
      </div>

      <div className="relative flex items-center justify-center w-full h-5 my-2 text-sm">
        {isTranscribing && !isPaused ? <Pulse /> : <></>}
      </div>

      {loadingMessage && (
        <div className="relative flex items-center justify-center w-full h-10 my-4">
          <p className="text-sm font-medium text-gray-600 animate-pulse">
            {loadingMessage}
          </p>
        </div>
      )}

      <div className="flex items-center px-2 py-2 bg-gray-50">
        <textarea
          className="w-full"
          rows="2"
          placeholder="Add additional Info..."
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          disabled={isCompleted}
        />
        <button onClick={handleSend} disabled={isCompleted}>
          <FaPaperPlane
            className={`ml-3 ${
              isCompleted ? "cursor-not-allowed" : "cursor-pointer"
            } text-primary`}
          />
        </button>
      </div>

      <div className="flex justify-end gap-3 px-2 pt-2 bg-white">
        {!isTranscribing ? (
          <>
            <Button
              onClick={handleNotesGeneration}
              className="flex items-center gap-2"
              disabled={chatMessages.length === 0 || isCompleted}
            >
              Generate Notes
            </Button>

            <Button
              onClick={handleStart}
              className="flex items-center gap-2"
              disabled={isCompleted}
            >
              <IoPlayOutline /> Start
            </Button>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Button
              onClick={handleStop}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-600/90"
              disabled={isCompleted}
            >
              <PiStop /> Stop
            </Button>
            <Button
              disabled={isCompleted}
              onClick={togglePauseResume}
              className={`flex items-center gap-2 ${
                isPaused
                  ? "bg-green-500 hover:bg-green-500/90"
                  : "bg-yellow-500 hover:bg-yellow-500/90"
              } text-white px-4 py-2 rounded-lg`}
            >
              {isPaused ? <IoPlayOutline /> : <PiPauseLight />}{" "}
              {isPaused ? "Resume" : "Pause"}
            </Button>
          </div>
        )}

        <Button onClick={handleCopy} variant="outline">
          {isCopied ? <IoCopy /> : <IoCopyOutline />}
        </Button>
      </div>
    </div>
  );
}
