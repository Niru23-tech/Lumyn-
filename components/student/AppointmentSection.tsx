import React, { useState, useEffect } from 'react';
import { Appointment, AppointmentStatus, User } from '../../types';
import { getStudentAppointments, getCounsellors, bookAppointment } from '../../services/mockApi';
import { CheckCircleIcon, ClockIcon, XCircleIcon } from '../shared/icons/Icons';

interface AppointmentSectionProps {
  studentId: string;
}

const AppointmentCard: React.FC<{ appointment: Appointment }> = ({ appointment }) => {
    const getStatusInfo = () => {
        switch (appointment.status) {
            case AppointmentStatus.CONFIRMED:
                return {
                    icon: <CheckCircleIcon className="text-green-500" />,
                    color: 'border-green-500',
                    textColor: 'text-green-500',
                    reminder: true,
                };
            case AppointmentStatus.PENDING:
                return {
                    icon: <ClockIcon className="text-yellow-500" />,
                    color: 'border-yellow-500',
                    textColor: 'text-yellow-500',
                    reminder: false,
                };
            case AppointmentStatus.REJECTED:
                return {
                    icon: <XCircleIcon className="text-red-500" />,
                    color: 'border-red-500',
                    textColor: 'text-red-500',
                    reminder: false,
                };
            default:
                return {
                    icon: <ClockIcon className="text-gray-500" />,
                    color: 'border-gray-500',
                    textColor: 'text-gray-500',
                    reminder: false,
                };
        }
    };
    const { icon, color, textColor, reminder } = getStatusInfo();
    const isPast = new Date() > appointment.dateTime;

    return (
        <div className={`p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border-l-4 ${color}`}>
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800 dark:text-white">With {appointment.counsellorName}</h3>
                <span className={`flex items-center text-sm font-medium ${textColor}`}>
                    {icon} <span className="ml-1.5">{appointment.status}</span>
                </span>
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {appointment.dateTime.toLocaleString()}
            </p>
            {reminder && !isPast && (
                <div className="mt-3 p-2 text-xs text-blue-800 bg-blue-100 rounded-md dark:bg-blue-900 dark:text-blue-200">
                    Reminder: You have an upcoming session!
                </div>
            )}
        </div>
    );
}

const AppointmentSection: React.FC<AppointmentSectionProps> = ({ studentId }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [counsellors, setCounsellors] = useState<User[]>([]);
  const [isBooking, setIsBooking] = useState(false);
  const [selectedCounsellor, setSelectedCounsellor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    getStudentAppointments(studentId).then(setAppointments);
    getCounsellors().then(setCounsellors);
  }, [studentId]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCounsellor || !selectedDate) return;
    await bookAppointment(studentId, selectedCounsellor, new Date(selectedDate));
    // Refetch appointments
    getStudentAppointments(studentId).then(setAppointments);
    setIsBooking(false);
    setSelectedCounsellor('');
    setSelectedDate('');
  };

  // Fix: Correctly typed the initial value of the reduce function to ensure categorizedAppointments is properly typed.
  const categorizedAppointments = appointments.reduce((acc, curr) => {
    const category = curr.status;
    (acc[category] = acc[category] || []).push(curr);
    return acc;
  }, {} as Record<string, Appointment[]>);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">My Appointments</h2>
        <button onClick={() => setIsBooking(true)} className="px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
          Book New Appointment
        </button>
      </div>

      {isBooking && (
        <div className="p-6 mb-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <h3 className="mb-4 text-xl font-semibold">New Appointment</h3>
          <form onSubmit={handleBooking} className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="block mb-1 text-sm font-medium dark:text-gray-300">Counsellor</label>
              <select value={selectedCounsellor} onChange={e => setSelectedCounsellor(e.target.value)} required className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600">
                <option value="">Select a counsellor</option>
                {counsellors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium dark:text-gray-300">Date & Time</label>
              <input type="datetime-local" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} required className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/>
            </div>
            <div className="flex items-end space-x-2">
              <button type="submit" className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Confirm Booking</button>
              <button type="button" onClick={() => setIsBooking(false)} className="w-full px-4 py-2 font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {Object.entries(categorizedAppointments).map(([status, apps]) => (
            <div key={status}>
                <h3 className="mb-3 text-xl font-semibold text-gray-700 dark:text-gray-300">{status}</h3>
                {apps.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {apps.map(app => <AppointmentCard key={app.id} appointment={app} />)}
                    </div>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400">No {status.toLowerCase()} appointments.</p>
                )}
            </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentSection;