import { useState, useEffect } from 'react';
import { useBookingStore } from '../store/bookingStore';
import { X, Calendar, Clock, Check } from 'lucide-react';

export default function BookingModal({ isOpen, onClose, mentor }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [topic, setTopic] = useState('');
  const [step, setStep] = useState(1);
  
  const {
    availability,
    selectedSlot,
    loading,
    error,
    bookingSuccess,
    fetchAvailability,
    selectSlot,
    bookSession,
    clearBooking,
    setSelectedMentor
  } = useBookingStore();

  useEffect(() => {
    if (isOpen && mentor) {
      setSelectedMentor(mentor);
    }
  }, [isOpen, mentor, setSelectedMentor]);

  if (!isOpen || !mentor) return null;

  // Extract user data from Django or Node.js format
  const user = mentor.user || mentor;
  const profile = mentor.mentor_profile || mentor.mentorProfile || mentor;
  const mentorId = user.id;

  const handleDateSelect = async (date) => {
    setSelectedDate(date);
    await fetchAvailability(mentorId, date);
    setStep(2);
  };

  const handleSlotSelect = (slot) => {
    selectSlot(slot);
    setStep(3);
  };

  const handleBook = async () => {
    const result = await bookSession(topic);
    if (result.success) {
      setTimeout(() => {
        clearBooking();
        onClose();
      }, 2000);
    }
  };

  const handleClose = () => {
    clearBooking();
    setStep(1);
    setSelectedDate('');
    setTopic('');
    onClose();
  };

  const getNextDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push({
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: date.getDate()
      });
    }
    return days;
  };

  if (bookingSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center transition-colors">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="text-green-600 dark:text-green-400" size={32} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Booking Confirmed!</h3>
          <p className="text-gray-600 dark:text-gray-400">Your session has been scheduled successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto transition-colors">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Book a Session</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">with {user.firstName} {user.lastName}</p>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        {step === 1 && (
          <div className="p-6">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              <Calendar size={18} /> Select a Date
            </h4>
            <div className="grid grid-cols-7 gap-2">
              {getNextDays().map((day) => (
                <button
                  key={day.date}
                  onClick={() => handleDateSelect(day.date)}
                  className={`p-3 rounded-lg text-center transition-colors ${
                    selectedDate === day.date
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                  }`}
                >
                  <div className="text-xs uppercase">{day.dayName}</div>
                  <div className="text-lg font-bold">{day.dayNum}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="p-6">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
              <Clock size={18} /> Select a Time
            </h4>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
              </div>
            ) : availability.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">No available slots for this date.</p>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {availability.map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => handleSlotSelect(slot)}
                    className={`p-3 rounded-lg text-center border transition-colors ${
                      selectedSlot?.time === slot.time
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white'
                    }`}
                  >
                    {slot.hour}
                  </button>
                ))}
              </div>
            )}
            <button
              onClick={() => setStep(1)}
              className="mt-4 text-gray-500 dark:text-gray-400 text-sm hover:text-gray-700 dark:hover:text-gray-300"
            >
              ← Back to dates
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="p-6">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-4">Confirm Booking</h4>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500 dark:text-gray-400">Mentor</span>
                <span className="font-medium text-gray-900 dark:text-white">{user.firstName} {user.lastName}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-500 dark:text-gray-400">Date</span>
                <span className="font-medium text-gray-900 dark:text-white">{selectedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Time</span>
                <span className="font-medium text-gray-900 dark:text-white">{selectedSlot?.hour}</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                What would you like to discuss?
              </label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 transition-colors"
                placeholder="e.g., Career transition advice, interview prep..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleBook}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
