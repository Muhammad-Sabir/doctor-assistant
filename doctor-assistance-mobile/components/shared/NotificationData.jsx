import React from 'react';
import { CalendarClock, ClipboardPlus, Cross } from 'lucide-react-native';

export function getNotificationData(type) {

  const notificationMap = {
    appointment: {
      icon: <CalendarClock size={20} color="blue" />,
      url: 'appointments',
    },
    prescription: {
      icon: <Cross size={20} color="green" />,
      url: 'consultations',
    },
    consultation: {
      icon: <ClipboardPlus size={20} color="green" />,
      url: 'consultations',
    },
  };

  return notificationMap[type] || {};
}
