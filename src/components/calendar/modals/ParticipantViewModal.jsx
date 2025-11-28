import React, { useState, useEffect } from 'react';
import { X, Check, Clock, MapPin, Link as LinkIcon, Users, Calendar as CalendarIcon, Video } from 'lucide-react';
import { useUpdateParticipantStatusMutation } from '@store/services/calendar/eventService';
import { toast } from 'react-toastify';

const ParticipantViewModal = ({ isOpen, onClose, event, currentUserId }) => {
  const [updateParticipantStatus, { isLoading: isUpdatingStatus }] = useUpdateParticipantStatusMutation();
  const [userStatus, setUserStatus] = useState('PENDING');
  const [userParticipantId, setUserParticipantId] = useState(null);
  const [localParticipants, setLocalParticipants] = useState([]);

  useEffect(() => {
    if (event && currentUserId) {
      setLocalParticipants(event.participants || []);
      
      const participant = event.participants?.find(p => p.employee.id === currentUserId);
      if (participant) {
        setUserStatus(participant.status || 'PENDING');
        setUserParticipantId(participant.id);
      }
    }
  }, [event, currentUserId]);

  const handleStatusUpdate = async (newStatus) => {
    if (!userParticipantId) return;
    
    try {
      await updateParticipantStatus({
        eventId: event.id,
        participantId: userParticipantId,
        status: newStatus
      }).unwrap();
      
      setUserStatus(newStatus);
      
      setLocalParticipants(prevParticipants => 
        prevParticipants.map(p => 
          p.id === userParticipantId 
            ? { ...p, status: newStatus }
            : p
        )
      );
      
      toast.success(`Status updated to ${newStatus.toLowerCase()}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error?.data?.error || error?.data?.message || 'Failed to update status');
    }
  };

  if (!isOpen || !event) return null;

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-green-100 text-green-800',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || styles.PENDING}`}>
        {status || 'PENDING'}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-modal="true" role="dialog">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity" onClick={onClose} />
        
        <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full my-8">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="text-blue-600" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{event.title}</h2>
                  <span className="inline-block mt-1 px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
                    {event.event_type || 'Meeting'}
                  </span>
                </div>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-5 space-y-5 max-h-[calc(100vh-250px)] overflow-y-auto">
            {/* Description */}
            <p className="text-gray-600">{event.description}</p>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CalendarIcon className="text-gray-400 mt-1" size={20} />
                <div>
                  <div className="text-sm font-medium text-gray-500">Date</div>
                  <div className="text-gray-900 font-medium">
                    {new Date(event.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="text-gray-400 mt-1" size={20} />
                <div>
                  <div className="text-sm font-medium text-gray-500">Time</div>
                  <div className="text-gray-900 font-medium">
                    {event.start_time?.slice(0, 5)} - {event.end_time?.slice(0, 5)}
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3">
              <MapPin className="text-gray-400 mt-1" size={20} />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-500">Location</div>
                <div className="text-gray-900 font-medium">{event.location}</div>
                {event.location === 'Virtual' && (
                  <span className="inline-block mt-1 px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded">
                    <Video className="inline mr-1" size={12} />
                    Virtual
                  </span>
                )}
              </div>
            </div>

            {/* Meeting Link */}
            {event.meeting_link && (
              <div className="flex items-start gap-3">
                <LinkIcon className="text-gray-400 mt-1" size={20} />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-500 mb-2">Meeting Link</div>
                  <a
                    href={event.meeting_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Video size={16} />
                    Join Virtual Meeting
                  </a>
                  <div className="mt-2 text-xs text-gray-500 break-all">{event.meeting_link}</div>
                </div>
              </div>
            )}

            {/* Participants */}
            <div className="border-t pt-5">
              <div className="flex items-center gap-2 mb-3">
                <Users className="text-gray-400" size={20} />
                <span className="text-sm font-medium text-gray-900">Participants</span>
              </div>

              <div className="space-y-2">
                {localParticipants?.map(participant => {
                  const isCurrentUser = participant.employee.id === currentUserId;
                  return (
                    <div 
                      key={participant.id} 
                      className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                        isCurrentUser ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {participant.employee.user.profile_picture ? (
                          <img
                            src={participant.employee.user.profile_picture}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                            {participant.employee.user.first_name[0]}{participant.employee.user.last_name[0]}
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {participant.employee.user.first_name} {participant.employee.user.last_name}
                            {isCurrentUser && <span className="ml-2 text-blue-600">(You)</span>}
                          </div>
                          <div className="text-xs text-gray-500">{participant.employee.department || 'No Department'}</div>
                        </div>
                      </div>
                      {getStatusBadge(participant.status)}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* User Status Update Section */}
            <div className="border-t pt-5">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-900 mb-3">Your Response</div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleStatusUpdate('CONFIRMED')}
                    disabled={isUpdatingStatus || userStatus === 'CONFIRMED'}
                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      userStatus === 'CONFIRMED'
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {userStatus === 'CONFIRMED' && <Check className="inline mr-1" size={16} />}
                    Yes
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('PENDING')}
                    disabled={isUpdatingStatus || userStatus === 'PENDING'}
                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      userStatus === 'PENDING'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {userStatus === 'PENDING' && <Clock className="inline mr-1" size={16} />}
                    No
                  </button>
                </div>
              </div>
            </div>

            {/* Creator Info */}
            <div className="flex items-center gap-2 pt-3 border-t">
              <Check className="text-green-600" size={16} />
              <span className="text-sm font-medium text-gray-900">
                Organizer: {event.organizer?.user?.first_name || 'Organizer'} {event.organizer?.user?.last_name || ''}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantViewModal;