import React, { useLayoutEffect } from 'react';
import { useLocation, useParams} from 'react-router-dom';

import ChatSection from '@/components/consultation/ChatSection';
import DoctorVideoSection from './DoctorVideoSection';
import useChatStore from '@/store/ChatStore';

function VideoCall() {
	const location = useLocation();
	const { patientId } = useParams();
	const { setRecipient } = useChatStore();

	const { patientName } = location.state || ''

	useLayoutEffect(()=> {
		setRecipient(patientId, patientName);
	}, [setRecipient, patientName, patientId])

	return (
		<div className="flex flex-col lg:flex-row h-[76vh]">
			<DoctorVideoSection />
			<ChatSection/>
		</div>
	);
}

export default VideoCall;
