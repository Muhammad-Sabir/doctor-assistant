import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PiVideoCameraLight, PiVideoCameraSlash } from "react-icons/pi";
import { CiMicrophoneOn, CiMicrophoneOff } from "react-icons/ci";
import { FiPhone, FiPhoneOff } from "react-icons/fi";
import { MdOutlineVideoCameraFront } from "react-icons/md";
import { useWebRTCContext } from '@/context/WebRTCContext';

export default function PatientVideoSection() {
    const navigate = useNavigate();
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(true);

    const {
        isCallActive,
        localStream,
        remoteStream,
        answerCall,
        endCall
    } = useWebRTCContext();

    const toggleMute = () => {
        setIsMuted((prev) => !prev);
        if (localStream) {
            const audioTrack = localStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = isMuted;
            }
        }
    };

    const toggleVideo = () => {
        setIsVideoOn((prev) => !prev);
        if (localStream) {
            const videoTrack = localStream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !isVideoOn;
            }
        }
    };

    const toggleCall = () => {
        if (isCallActive) {
            endCall();
            navigate('/patient/home');
        }
        answerCall();
    }

    return (
        <div className="lg:w-2/3 lg:pr-4">
            <div className="bg-gray-300 h-96 rounded-lg flex items-center justify-center relative">
                {!isCallActive ? (
                    <div className="h-full flex flex-col items-center gap-3 justify-center text-gray-500">
                        <MdOutlineVideoCameraFront size={100} />
                        <p>Press Join button to join the video call</p>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center gap-3 justify-center text-gray-500">
                        <video
                            ref={(video) => { if (video) video.srcObject = localStream }}
                            autoPlay
                            className="h-full w-full absolute object-cover" 
                        />
                        <video 
                            ref={(video) => { if (video) video.srcObject = remoteStream }}
                            autoPlay
                            className="w-1/3 h-1/3 absolute right-0 top-1"
                        />
                    </div>
                )}
            </div>

            <div className="flex justify-center space-x-6 p-4">
                <div className="flex flex-col items-center">
                    <button onClick={toggleVideo} className="p-3 bg-gray-200 rounded-full shadow-md hover:bg-gray-300 focus:outline-none">
                        {isVideoOn ? <PiVideoCameraLight className="text-xl" color='black' /> : <PiVideoCameraSlash className="text-xl" />}
                    </button>
                    <p className="mt-2 text-sm">{isVideoOn ? 'Cam' : 'No Cam'}</p>
                </div>

                <div className="flex flex-col items-center">
                    <button onClick={toggleCall} className={`p-3 ${isCallActive ? 'bg-red-500' : 'bg-green-500'} rounded-full shadow-md hover:opacity-90 focus:outline-none`}>
                        {isCallActive ? <FiPhoneOff className="text-xl text-white" /> : <FiPhone className="text-xl text-white" />}
                    </button>
                    <p className="mt-2 text-sm text-center">{isCallActive ? 'End' : 'Join'}</p>
                </div>

                <div className="flex flex-col items-center">
                    <button onClick={toggleMute} className="p-3 bg-gray-200 rounded-full shadow-md hover:bg-gray-300 focus:outline-none">
                        {isMuted ? <CiMicrophoneOff className="text-xl" /> : <CiMicrophoneOn className="text-xl" />}
                    </button>
                    <p className="mt-2 text-sm">{isMuted ? 'Unmute' : 'Mic'}</p>
                </div>
            </div>
        </div>
    );
}
