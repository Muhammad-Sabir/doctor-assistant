import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Header from '@/components/home/Header'
import HeroSection from '@/components/home/HeroSection'
import AboutSection from '@/components/home/AboutSection'
import FeatureSection from '@/components/home/FeatureSection'
import TopDoctorsSection from '@/components/home/TopDoctorsSection'
import MobileAppBanner from '@/components/home/MobileAppBanner'
import FaqSection from '@/components/home/FaqSection'
import Footer from '@/components/home/Footer'
import { getAuthStatus } from '@/utils/auth';
import { getChatSocket } from '@/utils/chatSocket';

export default function HomePage() {

	const navigate = useNavigate();

	useEffect(() => {
		const { isAuthenticated, user } = getAuthStatus();

		if (isAuthenticated) {
			getChatSocket(user.access_token);
			navigate(`/${user.role}`);
		}
	}, [navigate]);

  return (
	<div>
		<Header/>
		<HeroSection/>
		<AboutSection/>
		<FeatureSection/>
		<TopDoctorsSection/>
		<MobileAppBanner/>
		<FaqSection/>
		<Footer/>
	</div>
  )
}
