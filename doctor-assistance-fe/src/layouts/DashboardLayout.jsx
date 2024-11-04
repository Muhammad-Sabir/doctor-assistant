import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import Sidebar from '@/components/dashboard/Sidebar.jsx';
import Header from '@/components/dashboard/Header.jsx';
import IncomingCall from '@/components/dialogs/IncomingCall';
import { getAuthStatus } from '@/utils/auth';
import { getCallSocket } from '@/utils/callSocket';
import { useWebRTCContext} from '@/context/WebRTCContext';

export default function DashboardLayout() {
	const { user } = getAuthStatus();
	const webRTCContext = user.role === 'patient' ? useWebRTCContext() : null;

	useEffect(() => {
		getCallSocket()
	}, [user.role]);

	return (
		<div className="flex min-h-screen">
			<div className="hidden md:block">
				<Sidebar />
			</div>
			<div className="flex flex-col flex-1 md:ml-[218px] lg:ml-[234px]">
				<Header />
				<main className="flex-1 overflow-auto p-4">
					{user.role === 'patient' && webRTCContext?.isIncomingCall && (
						<IncomingCall />
					)}
					<Outlet />
				</main>
			</div>
		</div>
	);
}
