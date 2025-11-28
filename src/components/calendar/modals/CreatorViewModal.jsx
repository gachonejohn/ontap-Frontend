import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, Check, Clock, MapPin, Link as LinkIcon, 
  Users, Calendar as CalendarIcon, Video 
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';

import { 
  useUpdateEventMutation, 
  useDeleteEventMutation 
} from '@store/services/calendar/eventService';
import { useGetDepartmentsQuery } from '@store/services/companies/companiesService';
import { useGetEmployeesQuery } from '@store/services/employees/employeesService';
import { getApiErrorMessage } from '@utils/errorHandler';
import { EVENT_TYPE_OPTIONS } from '@constants/constants';
import { updateEventSchema } from '@schemas/calendar/eventSchema';

const CreatorViewModal = ({ isOpen, onClose, event, currentUserId }) => {
  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();
  const { data: departmentsData } = useGetDepartmentsQuery();
  const { data: employeesData } = useGetEmployeesQuery();

  const [isEditing, setIsEditing] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(updateEventSchema),
  });

  const employees = useMemo(() => employeesData?.results || [], [employeesData]);

  const filteredEmployees = useMemo(() => {
    if (!searchQuery) return employees;
    const query = searchQuery.toLowerCase();
    return employees.filter(emp => {
      const fullName = `${emp.user.first_name} ${emp.user.last_name}`.toLowerCase();
      return fullName.includes(query);
    });
  }, [searchQuery, employees]);

  // Initialize form when event data loads
  useEffect(() => {
    if (event && isOpen) {
      reset({
        title: event.title || '',
        description: event.description || '',
        event_type: event.event_type || '',
        department: event.department || '',
        date: event.date || '',
        start_time: event.start_time?.slice(0, 5) || '13:00',
        end_time: event.end_time?.slice(0, 5) || '14:00',
        location: event.location || '',
        meeting_link: event.meeting_link || '',
      });
      setSelectedParticipants(event.participants?.map(p => p.employee.id) || []);
    }
  }, [event, isOpen, reset]);

  // Reset editing state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false);
      setSearchQuery('');
    }
  }, [isOpen]);

  const toggleParticipant = (employeeId) => {
    setSelectedParticipants(prev => 
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const onSubmit = async (formData) => {
    try {
      const updateData = {
        ...formData,
        participants: selectedParticipants,
      };
      await updateEvent({ id: event.id, ...updateData }).unwrap();
      toast.success('Event updated successfully');
      setIsEditing(false);
    } catch (error) {
      const message = getApiErrorMessage(error, 'Failed to update event');
      toast.error(message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEvent(event.id).unwrap();
      toast.success('Event deleted successfully');
      setIsDeleteModalOpen(false);
      onClose();
    } catch (error) {
      const message = getApiErrorMessage(error, 'Failed to delete event');
      toast.error(message);
    }
  };

  const handleCancelEdit = () => {
    // Reset form to original event data
    reset({
      title: event.title || '',
      description: event.description || '',
      event_type: event.event_type || '',
      department: event.department || '',
      date: event.date || '',
      start_time: event.start_time?.slice(0, 5) || '13:00',
      end_time: event.end_time?.slice(0, 5) || '14:00',
      location: event.location || '',
      meeting_link: event.meeting_link || '',
    });
    setSelectedParticipants(event.participants?.map(p => p.employee.id) || []);
    setIsEditing(false);
  };

  if (!isOpen || !event) return null;

  const isLoading = isUpdating || isDeleting;

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-green-100 text-green-800',
      DECLINED: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || styles.PENDING}`}>
        {status || 'PENDING'}
      </span>
    );
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto" aria-modal="true" role="dialog">
        <div className="flex items-center justify-center min-h-screen px-4">
          <div 
            className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity" 
            onClick={onClose} 
          />
          
          <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full my-8">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="text-blue-600" size={24} />
                  </div>
                  <div>
                    {isEditing ? (
                      <div>
                        <input
                          type="text"
                          {...register('title')}
                          className={`text-2xl font-bold text-gray-900 border-b-2 ${
                            errors.title ? 'border-red-500' : 'border-teal-500'
                          } focus:outline-none`}
                        />
                        {errors.title && (
                          <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>
                        )}
                      </div>
                    ) : (
                      <h2 className="text-2xl font-bold text-gray-900">{event.title}</h2>
                    )}
                    <span className="inline-block mt-1 px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
                      {event.event_type || 'Meeting'}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={onClose} 
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="px-6 py-5 space-y-5 max-h-[calc(100vh-250px)] overflow-y-auto">
                {/* Description */}
                <div>
                  {isEditing ? (
                    <div>
                      <textarea
                        {...register('description')}
                        rows="3"
                        placeholder="Brief event description..."
                        className={`w-full px-3 py-2 border ${
                          errors.description ? 'border-red-300' : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-teal-500`}
                      />
                      {errors.description && (
                        <p className="text-xs text-red-600 mt-1">{errors.description.message}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-600">{event.description || 'No description provided'}</p>
                  )}
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <CalendarIcon className="text-gray-400 mt-1" size={20} />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-500">Date</div>
                      {isEditing ? (
                        <div>
                          <input
                            type="date"
                            {...register('date')}
                            className={`mt-1 px-2 py-1 border ${
                              errors.date ? 'border-red-300' : 'border-gray-300'
                            } rounded text-gray-900`}
                          />
                          {errors.date && (
                            <p className="text-xs text-red-600 mt-1">{errors.date.message}</p>
                          )}
                        </div>
                      ) : (
                        <div className="text-gray-900 font-medium">
                          {new Date(event.date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            month: 'long', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="text-gray-400 mt-1" size={20} />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-500">Time</div>
                      {isEditing ? (
                        <div>
                          <div className="flex gap-2 mt-1">
                            <input
                              type="time"
                              {...register('start_time')}
                              className={`px-2 py-1 border ${
                                errors.start_time ? 'border-red-300' : 'border-gray-300'
                              } rounded`}
                            />
                            <span>-</span>
                            <input
                              type="time"
                              {...register('end_time')}
                              className={`px-2 py-1 border ${
                                errors.end_time ? 'border-red-300' : 'border-gray-300'
                              } rounded`}
                            />
                          </div>
                          {(errors.start_time || errors.end_time) && (
                            <p className="text-xs text-red-600 mt-1">
                              {errors.start_time?.message || errors.end_time?.message}
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="text-gray-900 font-medium">
                          {event.start_time?.slice(0, 5)} - {event.end_time?.slice(0, 5)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Event Type & Department (only in edit mode) */}
                {isEditing && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Event Type
                      </label>
                      <select
                        {...register('event_type')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      >
                        {EVENT_TYPE_OPTIONS.map(type => (
                          <option key={type.value} value={type.value} disabled={type.value === ''}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Department
                      </label>
                      <select
                        {...register('department')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="">None</option>
                        {departmentsData?.map(dept => (
                          <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Location */}
                <div className="flex items-start gap-3">
                  <MapPin className="text-gray-400 mt-1" size={20} />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-500">Location</div>
                    {isEditing ? (
                      <div>
                        <input
                          type="text"
                          {...register('location')}
                          placeholder="e.g., Conference Room A"
                          className={`mt-1 w-full px-2 py-1 border ${
                            errors.location ? 'border-red-300' : 'border-gray-300'
                          } rounded`}
                        />
                        {errors.location && (
                          <p className="text-xs text-red-600 mt-1">{errors.location.message}</p>
                        )}
                      </div>
                    ) : (
                      <>
                        <div className="text-gray-900 font-medium">
                          {event.location || 'No location specified'}
                        </div>
                        {event.location === 'Virtual' && (
                          <span className="inline-block mt-1 px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded">
                            <Video className="inline mr-1" size={12} />
                            Virtual
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Meeting Link */}
                {(event.meeting_link || isEditing) && (
                  <div className="flex items-start gap-3">
                    <LinkIcon className="text-gray-400 mt-1" size={20} />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-500">Meeting Link</div>
                      {isEditing ? (
                        <div>
                          <input
                            type="url"
                            {...register('meeting_link')}
                            placeholder="https://zoom.us/j/..."
                            className={`mt-1 w-full px-2 py-1 border ${
                              errors.meeting_link ? 'border-red-300' : 'border-gray-300'
                            } rounded`}
                          />
                          {errors.meeting_link && (
                            <p className="text-xs text-red-600 mt-1">{errors.meeting_link.message}</p>
                          )}
                        </div>
                      ) : event.meeting_link ? (
                        <>
                          <a
                            href={event.meeting_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 mt-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Video size={16} />
                            Join Virtual Meeting
                          </a>
                          <div className="mt-2 text-xs text-gray-500 break-all">
                            {event.meeting_link}
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>
                )}

                {/* Participants */}
                <div className="border-t pt-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Users className="text-gray-400" size={20} />
                      <span className="text-sm font-medium text-gray-900">Participants</span>
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
                      {filteredEmployees.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">No employees found</div>
                      ) : (
                        filteredEmployees.map(employee => {
                          const isSelected = selectedParticipants.includes(employee.id);
                          return (
                            <label
                              key={employee.id}
                              className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleParticipant(employee.id)}
                                className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                              />
                              <div className="ml-3 flex items-center flex-1">
                                {employee.user.profile_picture ? (
                                  <img
                                    src={employee.user.profile_picture}
                                    alt=""
                                    className="w-10 h-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                                    {employee.user.first_name[0]}{employee.user.last_name[0]}
                                  </div>
                                )}
                                <div className="ml-3">
                                  <div className="text-sm font-medium text-gray-900">
                                    {employee.user.first_name} {employee.user.last_name}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {employee.department?.name || 'No Department'}
                                  </div>
                                </div>
                              </div>
                            </label>
                          );
                        })
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {event.participants?.length === 0 ? (
                        <p className="text-sm text-gray-500">No participants added</p>
                      ) : (
                        event.participants?.map(participant => (
                          <div 
                            key={participant.id} 
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
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
                                  {participant.employee.user.first_name[0]}
                                  {participant.employee.user.last_name[0]}
                                </div>
                              )}
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {participant.employee.user.first_name}{' '}
                                  {participant.employee.user.last_name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {participant.employee.department || 'No Department'}
                                </div>
                              </div>
                            </div>
                            {getStatusBadge(participant.status)}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Creator Info */}
                <div className="flex items-center gap-2 pt-3 border-t">
                  <Check className="text-green-600" size={16} />
                  <span className="text-sm font-medium text-gray-900">
                    Organizer: {event.organizer?.user?.first_name || 'Organizer'}{' '}
                    {event.organizer?.user?.last_name || ''}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsDeleteModalOpen(true)}
                      disabled={isLoading}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                    >
                      Delete
                    </button>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading || isSubmitting}
                        className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 disabled:opacity-50 transition-colors"
                      >
                        {isUpdating ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Close
                    </button>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div 
              className="fixed inset-0 bg-gray-900 bg-opacity-75" 
              onClick={() => setIsDeleteModalOpen(false)} 
            />
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Confirm Deletion
              </h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete this event?
              </p>
              <p className="text-sm text-gray-500 mb-6">
                This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreatorViewModal;