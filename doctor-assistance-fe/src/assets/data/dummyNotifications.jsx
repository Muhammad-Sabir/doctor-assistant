const dummyNotifications = [
    { id: 1, type: 'appointment', message: 'You have a new appointment at 3 PM', timestamp: '2h ago', is_read: false },
    { id: 2, type: 'appointment', message: 'Appointment with Dr. Smith has been scheduled', timestamp: '1h ago', is_read: false },
    { id: 3, type: 'appointment', message: 'Reminder: Appointment with Dr. Lee tomorrow', timestamp: '30m ago', is_read: false },
    { id: 4, type: 'appointment', message: 'Your appointment with Dr. Smith has been confirmed', timestamp: '10m ago', is_read: false },
    { id: 5, type: 'consultation', message: 'Your consultation has been started', timestamp: '10m ago', is_read: false },
    { id: 6, type: 'appointment', message: 'New appointment booked for 5 PM', timestamp: '3h ago', is_read: false },
    { id: 7, type: 'prescription', message: 'It\'s time to take your medication', timestamp: '45m ago', is_read: true },
    { id: 8, type: 'prescription', message: 'Prescription refill reminder', timestamp: '20m ago', is_read: true },
    { id: 9, type: 'appointment', message: 'Your follow-up appointment is confirmed', timestamp: '2h ago', is_read: true },
];

export default dummyNotifications;
