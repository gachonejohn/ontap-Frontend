import React from 'react';
import { 
  X, Clock, MapPin, Link as LinkIcon, 
  Users, Calendar as CalendarIcon, Video, Search, UserPlus, Trash2
} from 'lucide-react';
import { IoCloseOutline } from 'react-icons/io5';


const EventDetailsModal = ({
  isOpen,
  onClose,
  event,
  isEditing,
  isUpdating,
  isAddingParticipants,
  isRemovingParticipant,
  isSubmitting,
  isLoading,
  errors,
  register,
  handleSubmit,
  onSubmit,
  handleCancelEdit,
  setIsEditing,
  setIsDeleteModalOpen,
  EVENT_TYPE_OPTIONS,
  departmentsData,
  searchQuery,
  setSearchQuery,
  filteredEmployees,
  selectedInternalIds, 
  toggleParticipant,
  localParticipants,
  handleRemoveExternalParticipant,
  getStatusBadge,

  newExternalParticipant,
  setNewExternalParticipant,
  showExternalForm,
  setShowExternalForm,
  handleAddExternalParticipant,
}) => {
  if (!isOpen || !event) return null;

  const baseInputClass = "w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white";
  const errorClass = (field) => errors[field] ? 'border-red-500' : 'border-gray-300';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-inter" aria-modal="true" role="dialog">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity" 
          onClick={onClose} 
        />
        
        <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full my-8">
          {/* Close Button on Top Right */}
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 z-10"
          >
            <X size={24} />
          </button>

          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                <Users className="text-teal-600" size={24} />
              </div>
              <div>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      {...register('title')}
                      placeholder="Event Title"
                      className={`text-2xl font-bold text-gray-900 border-b-2 bg-white px-0 ${
                        errors.title ? 'border-red-500' : 'border-gray-300 focus:border-teal-500'
                      } focus:outline-none`}
                    />
                    {errors.title && (
                      <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>
                    )}
                  </div>
                ) : (
                  <h2 className="text-2xl font-bold text-gray-900">{event.title}</h2>
                )}
                <span className="inline-block mt-1 px-3 py-1 text-sm font-medium text-teal-700 bg-teal-100 rounded-full">
                  {event.event_type || 'Meeting'}
                </span>
              </div>
            </div>
          </div>

          {/* Content Form */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="px-6 py-5 space-y-6 max-h-[calc(100vh-250px)] overflow-y-auto">
              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                {isEditing ? (
                  <div>
                    <textarea
                      {...register('description')}
                      rows="3"
                      placeholder="Brief event description..."
                      className="w-full py-2 px-4 rounded-md border bg-slate-50 focus:outline-none focus:border-primary focus:bg-white placeholder:text-[12px] resize-none"
                    />
                    {errors.description && (
                      <p className="text-xs text-red-600 mt-1">{errors.description.message}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-200">
                    {event.description || 'No description provided'}
                  </p>
                )}
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Date */}
                <div className="flex items-start gap-3">
                  <CalendarIcon className="text-teal-500 mt-1" size={20} />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-500">Date</div>
                    {isEditing ? (
                      <div>
                        <input
                          type="date"
                          {...register('date')}
                          className={`${baseInputClass} px-2 py-1`}
                        />
                        {errors.date && (
                          <p className="text-xs text-red-600 mt-1">{errors.date.message}</p>
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-900 font-medium pt-1">
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

                {/* Time */}
                <div className="flex items-start gap-3">
                  <Clock className="text-teal-500 mt-1" size={20} />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-500">Time</div>
                    {isEditing ? (
                      <div>
                        <div className="flex gap-2 mt-1">
                          <input
                            type="time"
                            {...register('start_time')}
                            className={`${baseInputClass} px-2 py-1 w-1/2`}
                          />
                          <span className="self-center text-gray-500">-</span>
                          <input
                            type="time"
                            {...register('end_time')}
                            className={`${baseInputClass} px-2 py-1 w-1/2`}
                          />
                        </div>
                        {(errors.start_time || errors.end_time) && (
                          <p className="text-xs text-red-600 mt-1">
                            {errors.start_time?.message || errors.end_time?.message}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="text-gray-900 font-medium pt-1">
                        {event.start_time?.slice(0, 5)} - {event.end_time?.slice(0, 5)}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Event Type & Department */}
              {isEditing && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Type
                    </label>
                    <select
                      {...register('event_type')}
                      className={baseInputClass}
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
                      className={baseInputClass}
                    >
                      <option value="">None</option>
                      {departmentsData?.map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                    </select>
                    {errors.department && (
                      <p className="text-xs text-red-600 mt-1">{errors.department.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Location */}
              <div className="flex items-start gap-3">
                <MapPin className="text-teal-500 mt-1" size={20} />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-500">Location</div>
                  {isEditing ? (
                    <div>
                      <input
                        type="text"
                        {...register('location')}
                        placeholder="e.g., Conference Room A or Virtual"
                        className={`${baseInputClass}`}
                      />
                      {errors.location && (
                        <p className="text-xs text-red-600 mt-1">{errors.location.message}</p>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="text-gray-900 font-medium pt-1">
                        {event.location || 'No location specified'}
                      </div>
                      {event.location?.toLowerCase() === 'virtual' && (
                        <span className="inline-block mt-2 px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full">
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
                  <LinkIcon className="text-teal-500 mt-1" size={20} />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-500">Meeting Link</div>
                    {isEditing ? (
                      <div>
                        <input
                          type="url"
                          {...register('meeting_link')}
                          placeholder="https://zoom.us/j/..."
                          className={baseInputClass}
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
                          className="inline-flex items-center gap-2 mt-2 px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-md"
                        >
                          <Video size={16} />
                          Join Virtual Meeting
                        </a>
                        <div className="mt-2 text-xs text-gray-500 break-all p-2 bg-gray-50 rounded-lg border border-gray-200">
                          {event.meeting_link}
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
              )}

              {/* Participants */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Users className="text-teal-500" size={20} />
                    <span className="text-sm font-semibold text-gray-900">
                      Participants ({localParticipants.length})
                    </span>
                  </div>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => setShowExternalForm(true)}
                      className="flex items-center text-sm font-medium text-teal-600 hover:text-teal-800 transition-colors"
                    >
                      <UserPlus size={16} className="mr-1" />
                      Add Guest
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <>
                    {/* Add External Participant Form */}
                    {showExternalForm && (
                      <div className="mb-3 p-3 border border-gray-200 rounded-lg bg-slate-50">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-sm font-medium text-gray-700">Add External Participant</h4>
                          <button
                            onClick={() => setShowExternalForm(false)}
                            type="button"
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <IoCloseOutline size={20} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          <input
                            type="text"
                            placeholder="Guest Name"
                            value={newExternalParticipant.name}
                            onChange={(e) =>
                              setNewExternalParticipant((p) => ({ ...p, name: e.target.value }))
                            }
                            className="w-full py-2 px-4 rounded-md border bg-white focus:outline-none focus:border-primary placeholder:text-[12px]"
                          />

                          <input
                            type="email"
                            placeholder="Guest Email"
                            value={newExternalParticipant.email}
                            onChange={(e) =>
                              setNewExternalParticipant((p) => ({ ...p, email: e.target.value }))
                            }
                            className="w-full py-2 px-4 rounded-md border bg-white focus:outline-none focus:border-primary placeholder:text-[12px]"
                          />
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleAddExternalParticipant}
                            className="px-3 py-1.5 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-600"
                          >
                            Add Guest to Event
                          </button>

                          <button
                            type="button"
                            onClick={() => setShowExternalForm(false)}
                            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}



                    {/* Search and Select Internal Employees */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Add/Remove Team Members
                      </label>
                      <div className="relative mb-3">
                        <Search 
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                          size={18} 
                        />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search employees by name..."
                          className={`${baseInputClass} pl-10 focus:border-transparent`}
                        />
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto bg-white shadow-inner">
                        {filteredEmployees.length === 0 ? (
                          <div className="p-4 text-center text-gray-500 text-sm">
                            {searchQuery ? 'No employees found matching the search.' : 'Start typing to search employees.'}
                          </div>
                        ) : (
                          filteredEmployees.map(employee => {
                            const isSelected = selectedInternalIds.includes(employee.id);
                            return (
                              <label
                                key={employee.id}
                                className="flex items-center p-3 hover:bg-teal-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleParticipant(employee.id)}
                                  className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 transition-colors"
                                />
                                <div className="ml-3 flex items-center flex-1">
                                  {employee.user.profile_picture ? (
                                    <img
                                      src={employee.user.profile_picture}
                                      alt=""
                                      className="w-8 h-8 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-semibold text-xs">
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

                    {/* Current Participants List (Local state for editing) */}
                    {localParticipants.length > 0 && (
                      <div className="mt-4">
                        <div className="text-sm font-medium text-gray-700 mb-2">
                          All Participants ({localParticipants.length})
                        </div>
                        <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
                          {localParticipants.map(participant => {
                            const isExternal = participant.is_external || !participant.employee;
                            const participantKey = participant.id.toString().startsWith('temp-') 
                                ? participant.id 
                                : participant.id;

                            return (
                              <div 
                                key={participantKey} 
                                className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-100 shadow-sm transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  {isExternal ? (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-semibold text-xs">
                                      {participant.external_name?.[0]?.toUpperCase() || 'G'}
                                    </div>
                                  ) : (
                                    participant.employee?.user?.profile_picture ? (
                                      <img
                                        src={participant.employee.user.profile_picture}
                                        alt=""
                                        className="w-8 h-8 rounded-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-semibold text-xs">
                                        {participant.employee?.user?.first_name?.[0] || ''}
                                        {participant.employee?.user?.last_name?.[0] || ''}
                                      </div>
                                    )
                                  )}
                                  <div className="flex-1">
                                    <div className="text-sm font-medium text-gray-900">
                                      {isExternal ? (
                                        <>
                                          {participant.external_name || 'Guest'}
                                          <span className="ml-1 text-xs text-purple-600 bg-purple-100 px-1.5 py-0.5 rounded-full">
                                            External
                                          </span>
                                        </>
                                      ) : (
                                        `${participant.employee?.user?.first_name || ''} ${participant.employee?.user?.last_name || ''}`
                                      )}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {isExternal 
                                        ? participant.external_email 
                                        : participant.employee?.department?.name || 'No Department'}
                                    </div>
                                  </div>
                                </div>
                                {/* Removal button is always visible in edit mode */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (isExternal) {
                                      handleRemoveExternalParticipant(participantKey);
                                    } else {
                                      toggleParticipant(participant.employee.id);
                                    }
                                  }}
                                  className="text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50"
                                  title="Remove participant"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  // Read-only Participants List
                  <div className="space-y-3">
                    {localParticipants?.length === 0 ? (
                      <p className="text-sm text-gray-500 p-3 border border-gray-200 rounded-lg bg-gray-50">
                        No participants added
                      </p>
                    ) : (
                      localParticipants?.map(participant => {
                        const isExternal = participant.is_external || !participant.employee;
                        
                        return (
                          <div 
                            key={participant.id} 
                            className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border border-gray-100"
                          >
                            <div className="flex items-center gap-3">
                              {isExternal ? (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-semibold">
                                  {participant.external_name?.[0]?.toUpperCase() || 'G'}
                                </div>
                              ) : (
                                participant.employee?.user?.profile_picture ? (
                                  <img
                                    src={participant.employee.user.profile_picture}
                                    alt=""
                                    className="w-10 h-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                                    {participant.employee?.user?.first_name?.[0] || ''}
                                    {participant.employee?.user?.last_name?.[0] || ''}
                                  </div>
                                )
                              )}
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {isExternal ? (
                                    <>
                                      {participant.external_name || 'Guest'}
                                      <span className="ml-2 text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                                        External
                                      </span>
                                    </>
                                  ) : (
                                    `${participant.employee?.user?.first_name || ''} ${participant.employee?.user?.last_name || ''}`
                                  )}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {isExternal 
                                    ? participant.external_email 
                                    : participant.employee?.department?.name || 'No Department'}
                                </div>
                              </div>
                            </div>
                            {getStatusBadge(participant.status)}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>

              {/* Creator Info */}
              <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                <Users className="text-gray-400" size={20} />
                <span className="text-sm font-medium text-gray-900">
                  Organizer: {event.organizer?.user?.first_name || 'Organizer'}{' '}
                  {event.organizer?.user?.last_name || ''}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(true)}
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-300 rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors"
                  >
                    Delete Event
                  </button>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={isLoading}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading || isSubmitting}
                      className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 disabled:opacity-50 transition-colors shadow-md"
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
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
                      className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-md"
                    >
                      Edit Event
                    </button>
                  </div>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;