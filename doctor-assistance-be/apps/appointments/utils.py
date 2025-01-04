from datetime import timedelta


def generate_time_slots(start_time, end_time, duration_minutes):
    """Generate time slots between start and end time with given duration."""
    slots = []
    current_time = start_time
    
    while current_time + timedelta(minutes=duration_minutes) <= end_time:
        end_slot = current_time + timedelta(minutes=duration_minutes)
        slots.append({
            'start_time': current_time.time(),
            'end_time': end_slot.time(),
            'duration': duration_minutes
        })
        current_time = end_slot
    
    return slots 
