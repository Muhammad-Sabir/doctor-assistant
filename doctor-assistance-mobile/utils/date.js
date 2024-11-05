import { format, isToday, isYesterday, isThisWeek } from 'date-fns';

export const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--; 
    }
    return age;
};

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'short', year: 'numeric',
        month: 'short', day: 'numeric',
    });
};

export const formatChatPreviewDate = (dateString) => {
    const date = new Date(dateString);

    if (isToday(date)) {
        return format(date, 'h:mm a');
    } else if (isYesterday(date)) {
        return 'Yesterday';
    } else if (isThisWeek(date)) {
        return format(date, 'EEEE');
    } else {
        return format(date, 'dd/MM/yy');
    }
};
