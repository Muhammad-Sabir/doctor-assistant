import React from 'react';

import VideoSection from '@/components/consultation/VideoSection';
import ChatSection from '@/components/consultation/ChatSection';

function VideoCall() {
  return (
    <div className="flex flex-col lg:flex-row h-[76vh]">
      <VideoSection />
      <ChatSection/>
    </div>
  );
}

export default VideoCall;
