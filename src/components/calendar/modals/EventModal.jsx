import React, { useState, useEffect } from 'react';
import { useCalendarContext } from '../context/CalendarContext';
import { useEvents } from '../hooks/useEvents';
import { EVENT_TYPES, DEPARTMENTS, TEAM_MEMBERS } from '../../../constants/constants';
import { formatDate } from '../../../utils/dateHelpers';

const EventModal = () => {
  const { isModalOpen, closeModal, selectedDate, selectedEvent } = useCalendarContext();
  const { createEvent, updateEvent } = useEvents();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'meeting',
    department: 'hr',
    date: '',
    start_time: '13:00',
    end_time: '14:00',
    location: '',
    meeting_link: '',
    participants: []
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize form data
  useEffect(() => {
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        date: formatDate(selectedDate)
      }));
    }

    if (selectedEvent) {
      setFormData({
        title: selectedEvent.title || '',
        description: selectedEvent.description || '',
        type: selectedEvent.type || 'meeting',
        department: selectedEvent.department || 'hr',
        date: selectedEvent.date || '',
        start_time: selectedEvent.start_time || '13:00',
        end_time: selectedEvent.end_time || '14:00',
        location: selectedEvent.location || '',
        meeting_link: selectedEvent.meeting_link || '',
        participants: selectedEvent.participants || []
      });
    }
  }, [selectedDate, selectedEvent]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isModalOpen) {
      setFormData({
        title: '',
        description: '',
        type: 'meeting',
        department: 'hr',
        date: '',
        start_time: '13:00',
        end_time: '14:00',
        location: '',
        meeting_link: '',
        participants: []
      });
      setSearchQuery('');
      setErrors({});
    }
  }, [isModalOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const toggleParticipant = (memberId) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.includes(memberId)
        ? prev.participants.filter(id => id !== memberId)
        : [...prev.participants, memberId]
    }));
  };

  const selectAllParticipants = () => {
    setFormData(prev => ({
      ...prev,
      participants: TEAM_MEMBERS.map(m => m.id)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (selectedEvent) {
        const result = await updateEvent(selectedEvent.id, formData);
        if (result.success) {
          closeModal();
        } else {
          setErrors({ submit: result.error || 'Failed to update event' });
        }
      } else {
        const result = await createEvent(formData);
        if (result.success) {
          closeModal();
        } else {
          setErrors({ submit: result.error || 'Failed to create event' });
        }
      }
    } catch (error) {
      console.error('Error saving event:', error);
      setErrors({ submit: 'An unexpected error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isModalOpen) return null;

  const filteredMembers = TEAM_MEMBERS.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={closeModal}
          aria-hidden="true"
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900" id="modal-title">
              {selectedEvent ? 'Edit Event' : 'Create New Event'}
            </h3>
            <button
              onClick={closeModal}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto scrollbar-thin">
            {/* Error Message */}
            {errors.submit && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {errors.submit}
              </div>
            )}

            {/* Event Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Event Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Team Meeting"
                className={`w-full px-3 py-2 border ${errors.title ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm`}
              />
              {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief event description..."
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm resize-none"
              />
            </div>

            {/* Event Type and Department */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Event Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                >
                  {Object.values(EVENT_TYPES).map(type => (
                    <option key={type.id} value={type.id}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                >
                  {DEPARTMENTS.filter(d => d.id !== 'all').map(dept => (
                    <option key={dept.id} value={dept.id}>
                      {dept.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.date ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm`}
                />
                {errors.date && <p className="mt-1 text-xs text-red-600">{errors.date}</p>}
              </div>

              <div>
                <label htmlFor="start_time" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  id="start_time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                />
              </div>

              <div>
                <label htmlFor="end_time" className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  id="end_time"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Conference Room A or Virtual"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              />
            </div>

            {/* Meeting Link */}
            <div>
              <label htmlFor="meeting_link" className="block text-sm font-medium text-gray-700 mb-1">
                Meeting Link
              </label>
              <input
                type="url"
                id="meeting_link"
                name="meeting_link"
                value={formData.meeting_link}
                onChange={handleChange}
                placeholder="e.g., https://zoom.us/j/123456789 or https://meet.google.com/abc-defg-hij"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                Add a video conference link for participants to join
              </p>
            </div>

            {/* Participants */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Participants
                </label>
              </div>

              {/* Search */}
              <div className="relative mb-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Name"
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                />
                <svg
                  className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Select Team Members Header */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Select Team Members <span className="text-red-500">*</span>
                </span>
                <button
                  type="button"
                  onClick={selectAllParticipants}
                  className="text-sm font-medium text-teal-600 hover:text-teal-700"
                >
                  Select All
                </button>
              </div>

              {/* Team Members List */}
              <div className="border border-gray-300 rounded-lg divide-y divide-gray-200 max-h-48 overflow-y-auto scrollbar-thin">
                {filteredMembers.map(member => (
                  <label
                    key={member.id}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.participants.includes(member.id)}
                      onChange={() => toggleParticipant(member.id)}
                      className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-2 focus:ring-teal-500"
                    />
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold text-sm">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {member.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {member.role}
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              <p className="mt-2 text-xs text-gray-500">
                {formData.participants.length} of {TEAM_MEMBERS.length} team members selected
              </p>
            </div>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting 
                ? 'Saving...' 
                : selectedEvent 
                  ? 'Update Event' 
                  : 'Create Event'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;