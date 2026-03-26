import { useEffect } from 'react';
import { useBookingStore } from '../store/bookingStore';
import { Calendar, Clock, User, Video } from 'lucide-react';

export default function MySessions() {
  const { mySessions, loading, fetchMySessions } = useBookingStore();

  useEffect(() => {
    fetchMySessions();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
      case 'completed': return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400';
      case 'cancelled': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 transition-colors">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Sessions</h1>

        {mySessions.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-sm dark:shadow-gray-900/50 transition-colors">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No sessions booked yet.</p>
            <a href="/mentors" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline mt-2 inline-block">
              Find a mentor
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {mySessions.map((session) => (
              <div key={session.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm dark:shadow-gray-900/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {session.topic || 'Career Mentoring Session'}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(session.status)}`}>
                        {session.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        {formatDate(session.scheduledAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        {formatTime(session.scheduledAt)} ({session.duration} min)
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <User size={16} className="text-gray-400 dark:text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {session.mentorId === session.mentee?.id ? 'Mentee: ' : 'Mentor: '}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {session.mentor?.firstName} {session.mentor?.lastName}
                      </span>
                    </div>

                    {session.meetingLink && (
                      <a
                        href={session.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-3 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                      >
                        <Video size={16} />
                        Join Meeting
                      </a>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">${session.price}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{session.paymentStatus}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
