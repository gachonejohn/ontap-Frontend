import React, { useState, useEffect, useMemo } from 'react';
import { X, Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';

import { useCreateEventMutation } from '@store/services/calendar/eventService';
import { useGetDepartmentsQuery } from '@store/services/companies/companiesService';
import { useGetEmployeesQuery } from '@store/services/employees/employeesService';
import { formatDate } from '@utils/dateHelpers';
import { getApiErrorMessage } from '@utils/errorHandler';
import { EVENT_TYPE_OPTIONS } from '@constants/constants';
import { createEventSchema } from '@schemas/calendar/eventSchema';

const CreateEventModal = ({ isOpen, onClose, selectedDate }) => {
  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();
  const { data: departmentsData, isLoading: isLoadingDepartments } = useGetDepartmentsQuery();
  const { data: employeesData, isLoading: isLoadingEmployees } = useGetEmployeesQuery();

  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: '',
      description: '',
      event_type: '',
      department: '',
      date: '',
      start_time: '13:00',
      end_time: '14:00',
      location: '',
      meeting_link: '',
    },
  });

  useEffect(() => {
    if (selectedDate && isOpen) {
      setValue('date', formatDate(selectedDate));
    }
  }, [selectedDate, isOpen, setValue]);

  useEffect(() => {
    if (!isOpen) {
      reset();
      setSelectedParticipants([]);
      setSearchQuery('');
    }
  }, [isOpen, reset]);

  const employees = useMemo(() => employeesData || [], [employeesData]);

  const filteredEmployees = useMemo(() => {
    if (!searchQuery) return employees;
    const query = searchQuery.toLowerCase();
    return employees.filter(emp => {
      const fullName = `${emp.user.first_name} ${emp.user.last_name}`.toLowerCase();
      const deptName = emp.department?.name?.toLowerCase() || '';
      return fullName.includes(query) || deptName.includes(query);
    });
  }, [searchQuery, employees]);

  const toggleParticipant = (employeeId) => {
    setSelectedParticipants(prev => 
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const selectAll = () => {
    setSelectedParticipants(employees.map(emp => emp.id));
  };

  const onSubmit = async (formData) => {
    try {
      const submitData = {
        ...formData,
        participants: selectedParticipants,
      };
      await createEvent(submitData).unwrap();
      toast.success('Event created successfully');
      onClose();
    } catch (error) {
      const message = getApiErrorMessage(error, 'Failed to create event');
      toast.error(message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-modal="true" role="dialog">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity" 
          onClick={onClose} 
        />
        
        <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full my-8 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">Create New Event</h3>
            <button 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Form */}
          <form 
            onSubmit={handleSubmit(onSubmit)} 
            className="px-6 py-4 space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto"
          >
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('title')}
                placeholder="e.g., Team Meeting"
                className={`w-full px-3 py-2 border ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
              />
              {errors.title && (
                <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                {...register('description')}
                rows="3"
                placeholder="Brief event description..."
                className={`w-full px-3 py-2 border ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                } rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none`}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Event Type & Department */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Type
                </label>
                <select
                  {...register('event_type')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="">None</option>
                  {isLoadingDepartments ? (
                    <option>Loading...</option>
                  ) : departmentsData?.length ? (
                    departmentsData.map(dept => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))
                  ) : (
                    <option>No departments found</option>
                  )}
                </select>
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register('date')}
                  className={`w-full px-3 py-2 border ${
                    errors.date ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                />
                {errors.date && (
                  <p className="mt-1 text-xs text-red-600">{errors.date.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  {...register('start_time')}
                  className={`w-full px-3 py-2 border ${
                    errors.start_time ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                />
                {errors.start_time && (
                  <p className="mt-1 text-xs text-red-600">{errors.start_time.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  {...register('end_time')}
                  className={`w-full px-3 py-2 border ${
                    errors.end_time ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                />
                {errors.end_time && (
                  <p className="mt-1 text-xs text-red-600">{errors.end_time.message}</p>
                )}
              </div>
            </div>

            {/* Location & Meeting Link */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  {...register('location')}
                  placeholder="e.g., Conference Room A"
                  className={`w-full px-3 py-2 border ${
                    errors.location ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                />
                {errors.location && (
                  <p className="mt-1 text-xs text-red-600">{errors.location.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Link
                </label>
                <input
                  type="url"
                  {...register('meeting_link')}
                  placeholder="https://zoom.us/j/..."
                  className={`w-full px-3 py-2 border ${
                    errors.meeting_link ? 'border-red-300' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                />
                {errors.meeting_link && (
                  <p className="mt-1 text-xs text-red-600">{errors.meeting_link.message}</p>
                )}
              </div>
            </div>

            {/* Participants Section */}
            <div className="border-t pt-5">
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Select Team Members
                </label>
                
                {/* Search */}
                <div className="relative mb-3">
                  <Search 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                    size={18} 
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by Name"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    {selectedParticipants.length} of {employees.length} team members selected
                  </span>
                  <button
                    type="button"
                    onClick={selectAll}
                    className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                  >
                    Select All
                  </button>
                </div>

                {/* Participants List */}
                <div className="border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
                  {isLoadingEmployees ? (
                    <div className="p-4 text-center text-gray-500">Loading employees...</div>
                  ) : filteredEmployees.length === 0 ? (
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
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              disabled={isCreating || isSubmitting}
              className="px-5 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isCreating ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEventModal;