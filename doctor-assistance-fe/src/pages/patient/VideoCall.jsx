import React from 'react';

import ChatSection from '@/components/consultation/ChatSection';
import PatientVideoSection from '@/components/consultation/PatientVideoSection';

function VideoCall() {
  return (
    <div className="px-2 flex flex-col lg:flex-row h-[84vh]">
      <PatientVideoSection />
      <ChatSection/>
    </div>
  );
}

export default VideoCall;
