from rest_framework import serializers
from django.utils import timezone
from datetime import datetime

from apps.appointments.models import (
    Appointment, 
    TimeSlot, 
    DoctorSchedule, 
    DoctorDateOverride
)
from apps.appointments.utils import generate_time_slots


class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.name', read_only=True)
    doctor_name = serializers.CharField(source='doctor.name', read_only=True)
    
    class Meta:
        model = Appointment
        fields = '__all__'
  

    def get_fields(self):
        fields = super().get_fields()
        user = self.context['request'].user

        if user.role == 'patient':
            fields['status'].read_only = True
            fields['cancellation_reason'].read_only = True
        elif user.role == 'doctor':
            fields['patient'].read_only = True
            fields['message'].read_only = True
            fields['doctor'].read_only = True
            fields['appointment_mode'].read_only=True

        return fields

    def validate_patient(self, value):
        user = self.context['request'].user
        if user.role == 'patient' and value != user.patient and value.primary_patient != user.patient:
            raise serializers.ValidationError(
                "You can only create appointments for yourself or your dependents."
            )
        return value

    def validate_date_of_appointment(self, value):
        if value < timezone.now().date():
            raise serializers.ValidationError("The appointment date cannot be in the past.")
        return value


class TimeSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSlot
        fields = ['id','start_time', 'end_time']


class DoctorScheduleSerializer(serializers.ModelSerializer):
    day_name = serializers.CharField(source='get_day_of_week_display', read_only=True)
    time_slots = TimeSlotSerializer(many=True, read_only=True)
    original_time_slots = serializers.SerializerMethodField()
    hospital_name = serializers.SerializerMethodField()

    class Meta:
        model = DoctorSchedule
        fields = ['id', 'doctor', 'hospital', 'hospital_name', 'day_of_week', 'day_name', 
                  'time_slots', 'original_time_slots', 'is_available']
        read_only_fields = ['doctor']

    def get_hospital_name(self, obj):
        return obj.hospital.name

    def get_original_time_slots(self, obj):
        time_slots = list(obj.time_slots.order_by('start_time'))
        if not time_slots:
            return []
            
        original_slots = []
        current_chunk = {
            'start_time': time_slots[0].start_time,
            'end_time': time_slots[0].end_time,
            'duration': time_slots[0].duration
        }
        
        for i in range(1, len(time_slots)):
            current_slot = time_slots[i]
            
            # Check if this slot is consecutive and has same duration
            if (current_slot.start_time == time_slots[i-1].end_time and 
                current_slot.duration == current_chunk['duration']):
                current_chunk['end_time'] = current_slot.end_time
            else:
                original_slots.append(current_chunk)
                current_chunk = {
                    'start_time': current_slot.start_time,
                    'end_time': current_slot.end_time,
                    'duration': current_slot.duration
                }
        
        # Add the last chunk
        original_slots.append(current_chunk)
        
        return original_slots

    def validate(self, data):
        # Only validate time_slots if they are present in the request
        if 'time_slots' in self.initial_data:
            time_slots = self.initial_data.get('time_slots', [])
            
            for slot in time_slots:
                start_time_str = slot.get('start_time')
                end_time_str = slot.get('end_time')
                duration = slot.get('duration')

                if not all([start_time_str, end_time_str, duration]):
                    raise serializers.ValidationError(
                        "Each time slot must include start_time, end_time, and duration"
                    )

                start_time = datetime.strptime(start_time_str, '%H:%M').time()
                end_time = datetime.strptime(end_time_str, '%H:%M').time()

                if start_time >= end_time:
                    raise serializers.ValidationError("Each start time must be before its corresponding end time")

        # Validate other fields if they are present
        doctor = self.context.get('doctor')
        if not doctor:
            raise serializers.ValidationError("Doctor context is required")

        if 'hospital' in data:
            hospital = data.get('hospital')
            if hospital and not doctor.hospitals.filter(id=hospital.id).exists():
                raise serializers.ValidationError(
                    f"Doctor {doctor.name} is not associated with the selected hospital"
                )

        if 'day_of_week' in data:
            existing_schedule = DoctorSchedule.objects.filter(
                doctor=doctor,
                hospital=data.get('hospital', getattr(self.instance, 'hospital', None)),
                day_of_week=data['day_of_week']
            ).exists()
            
            if existing_schedule:
                raise serializers.ValidationError(
                    "A schedule already exists for this doctor at this hospital on this day"
                )
            
        return data

    def create(self, validated_data):
        time_slots = self.initial_data.get('time_slots', [])
        
        schedule = DoctorSchedule.objects.create(**validated_data)
        
        for slot in time_slots:
            start_time = datetime.strptime(slot['start_time'], '%H:%M').time()
            end_time = datetime.strptime(slot['end_time'], '%H:%M').time()
            duration = int(slot['duration'])

            slots_data = generate_time_slots(
                datetime.combine(datetime.today(), start_time),
                datetime.combine(datetime.today(), end_time),
                duration
            )
            for slot_data in slots_data:
                time_slot, _ = TimeSlot.objects.get_or_create(**slot_data)
                schedule.time_slots.add(time_slot)
        
        return schedule

    def update(self, instance, validated_data):
        instance.time_slots.clear()
        
        time_slots = self.initial_data.get('time_slots', [])
        
        for slot in time_slots:
            start_time = datetime.strptime(slot['start_time'], '%H:%M').time()
            end_time = datetime.strptime(slot['end_time'], '%H:%M').time()
            duration = int(slot['duration'])

            slots_data = generate_time_slots(
                datetime.combine(datetime.today(), start_time),
                datetime.combine(datetime.today(), end_time),
                duration
            )
            for slot_data in slots_data:
                time_slot, _ = TimeSlot.objects.get_or_create(**slot_data)
                instance.time_slots.add(time_slot)
        
        instance.save()
        return instance


class DoctorDateOverrideSerializer(serializers.ModelSerializer):
    time_slots = TimeSlotSerializer(many=True, read_only=True)
    slot_duration = serializers.IntegerField(write_only=True)
    start_time = serializers.TimeField(write_only=True)
    end_time = serializers.TimeField(write_only=True)

    class Meta:
        model = DoctorDateOverride
        fields = ['id', 'doctor', 'hospital', 'date', 'time_slots', 
                 'is_available', 'reason', 'slot_duration', 
                 'start_time', 'end_time']
        read_only_fields = ['doctor']

    def validate(self, data):
        if not all(key in data for key in ['slot_duration', 'start_time', 'end_time']):
            raise serializers.ValidationError(
                "slot_duration, start_time, and end_time are required"
            )
        
        if data['start_time'] >= data['end_time']:
            raise serializers.ValidationError("Start time must be before end time")

        doctor = self.context.get('doctor')
        if not doctor:
            raise serializers.ValidationError("Doctor context is required")

        hospital = data.get('hospital')
        if hospital and not doctor.hospitals.filter(id=hospital.id).exists():
            raise serializers.ValidationError(
                f"Doctor {doctor.name} is not associated with the selected hospital"
            )

        if data['date'] < timezone.now().date():
            raise serializers.ValidationError("Cannot create override for past dates")
        
        return data

    def create(self, validated_data):
        slot_duration = validated_data.pop('slot_duration')
        start_time = validated_data.pop('start_time')
        end_time = validated_data.pop('end_time')
        
        override = DoctorDateOverride.objects.create(**validated_data)
        
        slots_data = generate_time_slots(
            datetime.combine(override.date, start_time),
            datetime.combine(override.date, end_time),
            slot_duration
        )
    
        for slot_data in slots_data:
            time_slot, _ = TimeSlot.objects.get_or_create(**slot_data)
            override.time_slots.add(time_slot)
        
        return override

    def update(self, instance, validated_data):
        instance.is_available = validated_data.get('is_available', instance.is_available)
        instance.reason = validated_data.get('reason', instance.reason)
        instance.hospital = validated_data.get('hospital', instance.hospital)
        instance.date = validated_data.get('date', instance.date)
        
        if all(key in validated_data for key in ['slot_duration', 'start_time', 'end_time']):
            instance.time_slots.clear()
            
            slots_data = generate_time_slots(
                datetime.combine(instance.date, validated_data['start_time']),
                datetime.combine(instance.date, validated_data['end_time']),
                validated_data['slot_duration']
            )
            
            for slot_data in slots_data:
                time_slot, _ = TimeSlot.objects.get_or_create(**slot_data)
                instance.time_slots.add(time_slot)
        
        instance.save()
        return instance
