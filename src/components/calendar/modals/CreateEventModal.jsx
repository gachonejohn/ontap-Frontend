import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, UserPlus, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { IoCloseOutline } from 'react-icons/io5';

import { useCreateEventMutation } from '@store/services/calendar/eventService';
import { useGetDepartmentsQuery } from '@store/services/companies/companiesService';
import { useGetEmployeesQuery } from '@store/services/employees/employeesService';
import { formatDate } from '@utils/dateHelpers';
import { getApiErrorMessage } from '@utils/errorHandler';
import { EVENT_TYPE_OPTIONS } from '@constants/constants';
import { createEventSchema } from '@schemas/calendar/eventSchema';
import SubmitCancelButtons from '../../common/Buttons/ActionButton';

const CreateEventModal = ({ isOpen, onClose, selectedDate }) => {
  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();
  const { data: departmentsData, isLoading: isLoadingDepartments } = useGetDepartmentsQuery();
  const { data: employeesData, isLoading: isLoadingEmployees } = useGetEmployeesQuery();

  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [externalParticipants, setExternalParticipants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showExternalForm, setShowExternalForm] = useState(false);
  const [externalForm, setExternalForm] = useState({ name: '', email: '' });
  const [externalErrors, setExternalErrors] = useState({ name: '', email: '' });

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
      setExternalParticipants([]);
      setSearchQuery('');
      setShowExternalForm(false);
      setExternalForm({ name: '', email: '' });
      setExternalErrors({ name: '', email: '' });
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

  const validateExternalForm = () => {
    const errors = { name: '', email: '' };
    let isValid = true;

    if (!externalForm.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }

    if (!externalForm.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(externalForm.email)) {
      errors.email = 'Invalid email format';
      isValid = false;
    }

    // Check for duplicate email
    if (externalParticipants.some(p => p.email === externalForm.email)) {
      errors.email = 'This email is already added';
      isValid = false;
    }

    setExternalErrors(errors);
    return isValid;
  };

  const handleAddExternal = () => {
    if (validateExternalForm()) {
      setExternalParticipants(prev => [...prev, { ...externalForm }]);
      setExternalForm({ name: '', email: '' });
      setExternalErrors({ name: '', email: '' });
      setShowExternalForm(false);
      toast.success('External participant added');
    }
  };

  const handleRemoveExternal = (index) => {
    setExternalParticipants(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (formData) => {
    try {
      const submitData = {
        ...formData,
        internal_participants: selectedParticipants,
        external_participants: externalParticipants,
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
    <div 
      className="relative z-50 animate-fadeIn" 
      aria-labelledby="modal-title" 
      role="dialog" 
      aria-modal="true"
    >
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity animate-fadeIn cursor-pointer" 
        aria-hidden="true"
      />
      
      <div className="fixed inset-0 min-h-full z-50 w-screen flex flex-col text-center md:items-center justify-center p-2 md:p-3 pointer-events-none">
        <div 
          className="relative transform justify-center animate-fadeIn max-h-[90vh] overflow-y-auto rounded-md bg-white text-left shadow-xl transition-all w-full sm:max-w-c-500 md:max-w-2xl px-3 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header - sticky */}
          <div className="sticky top-0 bg-white z-40 flex px-4 justify-between items-center py-4 border-b border-gray-100">
            <p className="text-sm md:text-lg lg:text-lg font-semibold">Create New Event</p>
            <IoCloseOutline
              size={20}
              className="cursor-pointer hover:text-gray-600"
              onClick={onClose}
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Event Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('title')}
                placeholder="E.g. Team Meeting"
                className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white placeholder:text-[12px]"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                {...register('description')}
                rows="3"
                placeholder="Brief event description..."
                className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white placeholder:text-[12px] resize-none"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            {/* Event Type & Department */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Event Type
                </label>
                <select
                  {...register('event_type')}
                  className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white"
                >
                  {EVENT_TYPE_OPTIONS.map(type => (
                    <option key={type.value} value={type.value} disabled={type.value === ''}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Department
                </label>
                <select
                  {...register('department')}
                  className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white"
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register('date')}
                  className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white"
                />
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  {...register('start_time')}
                  className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white"
                />
                {errors.start_time && (
                  <p className="text-red-500 text-sm mt-1">{errors.start_time.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  {...register('end_time')}
                  className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white"
                />
                {errors.end_time && (
                  <p className="text-red-500 text-sm mt-1">{errors.end_time.message}</p>
                )}
              </div>
            </div>

            {/* Location & Meeting Link */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Location
                </label>
                <input
                  type="text"
                  {...register('location')}
                  placeholder="E.g. Conference Room A"
                  className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white placeholder:text-[12px]"
                />
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Meeting Link
                </label>
                <input
                  type="url"
                  {...register('meeting_link')}
                  placeholder="https://zoom.us/j/..."
                  className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white placeholder:text-[12px]"
                />
                {errors.meeting_link && (
                  <p className="text-red-500 text-sm mt-1">{errors.meeting_link.message}</p>
                )}
              </div>
            </div>

            {/* Participants Section */}
            <div className="border-t pt-4">
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Internal Team Members
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
                    placeholder="Search by name or department"
                    className="w-full pl-10 pr-3 py-2 border rounded-md bg-slate-50 focus:outline-none focus:border-primary focus:bg-white placeholder:text-[12px]"
                  />
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    {selectedParticipants.length} of {employees.length} selected
                  </span>
                  <button
                    type="button"
                    onClick={selectAll}
                    className="text-sm text-primary hover:text-primary-600 font-medium"
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
                            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                          />
                          <div className="ml-3 flex items-center flex-1">
                            {employee.user.profile_picture ? (
                              <img
                                src={employee.user.profile_picture}
                                alt=""
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
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

              {/* External Participants Section */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-900">
                    External Participants
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowExternalForm(!showExternalForm)}
                    className="text-sm text-primary hover:text-primary-600 font-medium flex items-center gap-1"
                  >
                    <UserPlus size={16} />
                    Add External
                  </button>
                </div>

                {/* External Form */}
                {showExternalForm && (
                  <div className="mb-3 p-3 border border-gray-200 rounded-lg bg-slate-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div>
                        <input
                          type="text"
                          value={externalForm.name}
                          onChange={(e) => setExternalForm({ ...externalForm, name: e.target.value })}
                          placeholder="Full Name"
                          className="w-full py-2 px-4 rounded-md border bg-white focus:outline-none focus:border-primary placeholder:text-[12px]"
                        />
                        {externalErrors.name && (
                          <p className="text-red-500 text-xs mt-1">{externalErrors.name}</p>
                        )}
                      </div>
                      <div>
                        <input
                          type="email"
                          value={externalForm.email}
                          onChange={(e) => setExternalForm({ ...externalForm, email: e.target.value })}
                          placeholder="email@example.com"
                          className="w-full py-2 px-4 rounded-md border bg-white focus:outline-none focus:border-primary placeholder:text-[12px]"
                        />
                        {externalErrors.email && (
                          <p className="text-red-500 text-xs mt-1">{externalErrors.email}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleAddExternal}
                        className="px-3 py-1.5 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-600"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowExternalForm(false);
                          setExternalForm({ name: '', email: '' });
                          setExternalErrors({ name: '', email: '' });
                        }}
                        className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* External Participants List */}
                {externalParticipants.length > 0 && (
                  <div className="border border-gray-200 rounded-lg">
                    {externalParticipants.map((participant, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                            {participant.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {participant.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {participant.email}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveExternal(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {externalParticipants.length === 0 && !showExternalForm && (
                  <p className="text-sm text-gray-500 text-center py-3">
                    No external participants added
                  </p>
                )}
              </div>
            </div>

            <SubmitCancelButtons
              onCancel={onClose}
              isSubmitting={isSubmitting}
              isProcessing={isCreating}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEventModal;