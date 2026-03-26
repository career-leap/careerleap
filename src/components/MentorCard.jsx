import { useState } from 'react';
import { Star, MapPin, Briefcase, DollarSign } from 'lucide-react';
import BookingModal from './BookingModal';

export default function MentorCard({ mentor }) {
  const [showBooking, setShowBooking] = useState(false);
  
  // Handle both Django and Node.js response formats
  // Django format: mentor has user nested object with mentor_profile
  // Node.js format: mentor has mentorProfile directly
  const user = mentor.user || mentor;
  const profile = mentor.mentor_profile || mentor.mentorProfile || mentor;
  
  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:shadow-gray-900/50 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all p-6 border border-gray-100 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {user.firstName?.[0]}{user.lastName?.[0]}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{user.industry || 'No industry'}</p>
            
            {/* Rating */}
            <div className="flex items-center gap-1 mt-1">
              <Star className="text-yellow-400 fill-current" size={16} />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {profile.average_rating || profile.averageRating || '0.0'}
              </span>
              <span className="text-gray-400 dark:text-gray-500 text-sm">
                ({profile.total_sessions || profile.totalSessions || 0} sessions)
              </span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {profile.bio || user.bio || 'No bio available'}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center gap-1">
            <Briefcase size={16} />
            <span>{user.yearsOfExperience || user.years_of_experience || 0} years exp.</span>
          </div>
          {user.location && (
            <div className="flex items-center gap-1">
              <MapPin size={16} />
              <span className="truncate">{user.location}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-bold">
            <DollarSign size={18} />
            <span>{profile.hourly_rate || profile.hourlyRate || 0}/hr</span>
          </div>
          <button 
            onClick={() => setShowBooking(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            Book Session
          </button>
        </div>
      </div>

      <BookingModal 
        isOpen={showBooking} 
        onClose={() => setShowBooking(false)} 
        mentor={mentor}
      />
    </>
  );
}
