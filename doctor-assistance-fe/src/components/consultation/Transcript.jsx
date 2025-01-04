import React, { useState, useEffect, useRef } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { IoCopyOutline, IoCopy, IoPlayOutline } from "react-icons/io5";
import { PiPauseLight, PiStop } from "react-icons/pi";
import { TbUserCircle } from "react-icons/tb";

import { Button } from "@/components/ui/button";
import Pulse from "@/components/shared/Pulse";
import { useAudioTranscription } from "@/hooks/useAudioTranscription";
import { getAuthStatus } from "@/utils/auth";

const LABEL_SPEAKER = {
  spk_0: "Doctor",
  spk_1: "Patient",
};

export default function TranscriptionPage({ consultationId, setNotes }) {
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);

  function processTranscripts(transcripts) {
    return transcripts
      .map((entry) => {
        const label =
          entry.speaker_label === "spk_0" ? "[doctor]" : "[patient]";

        return `${label} ${entry.transcript}`;
      })
      .join(" ");
  }

  const transcriptEndRef = useRef(null);

  const {
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    transcription,
  } = useAudioTranscription(consultationId);

  useEffect(() => {
    if (transcription) {
      setChatMessages(transcription);
    }
  }, [transcription]);

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
  }, [chatMessages]);

  const formatTime = (seconds) => {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${minutes}:${secs}`;
  };

  const handleNotesGeneration = () => {
    const { user } = getAuthStatus();
    let accessToken = user.access_token;

    const transcript = processTranscripts(chatMessages);

    fetch("http://localhost:8000/api/transcriptions/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        consultation: consultationId,
        transcription_text: transcript,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setNotes(data.soap_notes.description);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
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
    if (additionalInfo.trim()) {
      const newMessage = {
        id: chatMessages.length + 1,
        text: additionalInfo,
        sender: "Doctor",
        time: formatTime(elapsedTime),
      };
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);
      setAdditionalInfo("");
    }
  };

  const handleEditMessage = (e, id) => {
    const updatedText = e.target.textContent;
    setChatMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === id ? { ...msg, text: updatedText } : msg
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

      <div className="flex items-center px-2 py-2 bg-gray-50">
        <textarea
          className="w-full"
          rows="2"
          placeholder="Add additional Info..."
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
        />
        <button onClick={handleSend}>
          <FaPaperPlane className="ml-3 cursor-pointer text-primary" />
        </button>
      </div>

      <div className="flex justify-end gap-3 px-2 pt-2 bg-white">
        {!isTranscribing ? (
          <>
            <Button
              onClick={handleNotesGeneration}
              className="flex items-center gap-2"
              disabled={transcription.length === 0}
            >
              Generate Notes
            </Button>

            <Button onClick={handleStart} className="flex items-center gap-2">
              <IoPlayOutline /> Start
            </Button>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Button
              onClick={handleStop}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-600/90"
            >
              <PiStop /> Stop
            </Button>
            <Button
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
