import React from 'react';

import ChatSection from '@/components/consultation/ChatSection';
import DoctorVideoSection from './DoctorVideoSection';

function VideoCall() {
  return (
    <div className="flex flex-col lg:flex-row h-[76vh]">
      <DoctorVideoSection />
      <ChatSection/>
    </div>
  );
}

export default VideoCall;
