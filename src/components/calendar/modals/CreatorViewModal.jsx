import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import EventDetailsModal from './EventDetailsModal';
import ActionModal from '@components/common/Modals/ActionModal';

import { 
  useUpdateEventMutation, 
  useDeleteEventMutation,
  useAddParticipantsMutation,
  useRemoveParticipantMutation
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

  const [addParticipants, { isLoading: isAddingParticipants }] = useAddParticipantsMutation();
  const [removeParticipant, { isLoading: isRemovingParticipant }] = useRemoveParticipantMutation();
  
  const [localParticipants, setLocalParticipants] = useState([]);
  const [internalParticipantsToAdd, setInternalParticipantsToAdd] = useState([]);
  const [participantsToRemove, setParticipantsToRemove] = useState([]); 
  
  const [newExternalParticipant, setNewExternalParticipant] = useState({ name: '', email: '' });
  const [externalParticipantsToAdd, setExternalParticipantsToAdd] = useState([]);
  const [showExternalForm, setShowExternalForm] = useState(false);


  const [isEditing, setIsEditing] = useState(false);
  const [selectedInternalIds, setSelectedInternalIds] = useState([]);
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

  const employees = useMemo(() => {
    if (Array.isArray(employeesData)) {
      return employeesData;
    }
    return employeesData?.results || [];
  }, [employeesData]);

  const filteredEmployees = useMemo(() => {
    if (!searchQuery) return employees;
    const query = searchQuery.toLowerCase();
    return employees.filter(emp => {
      const fullName = `${emp.user.first_name} ${emp.user.last_name}`.toLowerCase();
      return fullName.includes(query);
    });
  }, [searchQuery, employees]);

  useEffect(() => {
    if (event && isOpen) {
      const departmentId = event.department?.id || event.department || '';

      reset({
        title: event.title || '',
        description: event.description || '',
        event_type: event.event_type || '',
        department: departmentId.toString(), 
        date: event.date || '',
        start_time: event.start_time?.slice(0, 5) || '13:00',
        end_time: event.end_time?.slice(0, 5) || '14:00',
        location: event.location || '',
        meeting_link: event.meeting_link || '',
      });
      
      setLocalParticipants(event.participants || []);
      
      setSelectedInternalIds(
        event.participants
          ?.filter(p => p.employee && !p.is_external)
          .map(p => p.employee.id) || []
      );
      
      setInternalParticipantsToAdd([]);
      setParticipantsToRemove([]);
      setExternalParticipantsToAdd([]);
      setNewExternalParticipant({ name: '', email: '' });
      setShowExternalForm(false);
    }
  }, [event, isOpen, reset]);

  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false);
      setSearchQuery('');
      setIsDeleteModalOpen(false); 
    }
  }, [isOpen]);

  const toggleParticipant = useCallback((employeeId) => {
    setSelectedInternalIds(prev => {
      const isCurrentlySelected = prev.includes(employeeId);
      const employee = employees.find(emp => emp.id === employeeId);
      
      if (isCurrentlySelected) {
        const existingParticipant = event.participants?.find(p => p.employee?.id === employeeId && !p.is_external);
        
        if (existingParticipant && !existingParticipant.id.toString().startsWith('temp-')) {
          setParticipantsToRemove(prevRemove => [...prevRemove, existingParticipant.id]);
        }
        
        setLocalParticipants(prevLocal => prevLocal.filter(p => p.employee?.id !== employeeId));
        setInternalParticipantsToAdd(prevAdd => prevAdd.filter(id => id !== employeeId));
        
        return prev.filter(id => id !== employeeId);
      } else {
        const participantId = event.participants?.find(p => p.employee?.id === employeeId)?.id;

        if (participantId && !participantId.toString().startsWith('temp-')) {
          setParticipantsToRemove(prevRemove => prevRemove.filter(id => id !== participantId));
          const originalParticipant = event.participants.find(p => p.id === participantId);
          if(originalParticipant) {
             setLocalParticipants(prevLocal => [...prevLocal, originalParticipant]);
          }
        } else {
          setInternalParticipantsToAdd(prevAdd => [...prevAdd, employeeId]);
          
          if (employee) {
            setLocalParticipants(prevLocal => [...prevLocal, {
              id: `temp-${employeeId}`, 
              employee: employee,
              status: 'PENDING',
              is_external: false
            }]);
          }
        }
        
        return [...prev, employeeId];
      }
    });
  }, [event.participants, employees]);

  const handleAddExternalParticipant = () => {
    if (newExternalParticipant.name.trim() && newExternalParticipant.email.trim()) {
      const newParticipant = {
        name: newExternalParticipant.name.trim(),  
        email: newExternalParticipant.email.trim(), 
      };
      
      setExternalParticipantsToAdd(prev => [...prev, newParticipant]);

      setLocalParticipants(prev => [...prev, {
        id: `ext-temp-${Date.now()}`,
        external_name: newParticipant.name, 
        external_email: newParticipant.email, 
        is_external: true,
        status: 'PENDING'
      }]);

      setNewExternalParticipant({ name: '', email: '' });
      setShowExternalForm(false);
    } else {
      toast.error("Please enter both name and email for the external participant.");
    }
  };

  const handleRemoveExternalParticipant = (participantId) => {
    const participant = localParticipants.find(lp => lp.id === participantId);

    if (!participant) return;

    if (participantId.toString().startsWith('ext-temp-')) {
      setExternalParticipantsToAdd(prevAdd => 
        prevAdd.filter(p => p.email !== participant.external_email)
      );
    } else {
      setParticipantsToRemove(prevRemove => [...prevRemove, participantId]);
    }

    setLocalParticipants(prev => prev.filter(p => p.id !== participantId));
  };

  const onSubmit = async (formData) => {
    try {
      const updateData = { ...formData };
      
      updateData.department = formData.department ? parseInt(formData.department, 10) : null;

      await updateEvent({ id: event.id, ...updateData }).unwrap();
      
      const hasParticipantChanges = internalParticipantsToAdd.length > 0 || externalParticipantsToAdd.length > 0 || participantsToRemove.length > 0;
      
      if (hasParticipantChanges) {
        if (internalParticipantsToAdd.length > 0 || externalParticipantsToAdd.length > 0) {
          const payload = {};
          if (internalParticipantsToAdd.length > 0) {
            payload.internal_participants = internalParticipantsToAdd;
          }
          if (externalParticipantsToAdd.length > 0) {
            payload.external_participants = externalParticipantsToAdd;
          }
          
          if (Object.keys(payload).length > 0) {
            await addParticipants({
              eventId: event.id,
              ...payload
            }).unwrap();
          }
        }
        
        if (participantsToRemove.length > 0) {
          await removeParticipant({ 
            eventId: event.id, 
            participantIds: participantsToRemove  
          }).unwrap();
        }
      }
      
      toast.success('Event updated successfully');
      
      setIsEditing(false);
      setInternalParticipantsToAdd([]);
      setParticipantsToRemove([]);
      setExternalParticipantsToAdd([]);
      setNewExternalParticipant({ name: '', email: '' });
      setShowExternalForm(false);
      
    } catch (error) {
      const message = getApiErrorMessage(error, 'Failed to update event');
      console.error('Event Update Error:', error);
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
    const departmentId = event.department?.id || event.department || '';

    reset({
      title: event.title || '',
      description: event.description || '',
      event_type: event.event_type || '',
      department: departmentId.toString(),
      date: event.date || '',
      start_time: event.start_time?.slice(0, 5) || '13:00',
      end_time: event.end_time?.slice(0, 5) || '14:00',
      location: event.location || '',
      meeting_link: event.meeting_link || '',
    });
    
    setLocalParticipants(event.participants || []);
    setSelectedInternalIds(
      event.participants
        ?.filter(p => p.employee && !p.is_external)
        .map(p => p.employee.id) || []
    );
    
    setInternalParticipantsToAdd([]);
    setParticipantsToRemove([]);
    setExternalParticipantsToAdd([]);
    setNewExternalParticipant({ name: '', email: '' });
    setShowExternalForm(false);
    
    setIsEditing(false);
  };

  const isLoading = isUpdating || isDeleting || isAddingParticipants || isRemovingParticipant;

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
      <EventDetailsModal
        isOpen={isOpen}
        onClose={onClose}
        event={event}
        isEditing={isEditing}
        isUpdating={isUpdating}
        isAddingParticipants={isAddingParticipants}
        isRemovingParticipant={isRemovingParticipant}
        isSubmitting={isSubmitting}
        isLoading={isLoading}
        errors={errors}
        register={register}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        handleCancelEdit={handleCancelEdit}
        setIsEditing={setIsEditing}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        EVENT_TYPE_OPTIONS={EVENT_TYPE_OPTIONS}
        departmentsData={departmentsData}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredEmployees={filteredEmployees}
        selectedInternalIds={selectedInternalIds}
        toggleParticipant={toggleParticipant}
        localParticipants={localParticipants}
        handleRemoveExternalParticipant={handleRemoveExternalParticipant}
        getStatusBadge={getStatusBadge}
        
        newExternalParticipant={newExternalParticipant}
        setNewExternalParticipant={setNewExternalParticipant}
        showExternalForm={showExternalForm}
        setShowExternalForm={setShowExternalForm}
        handleAddExternalParticipant={handleAddExternalParticipant}
      />

      <ActionModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDelete}
        isDeleting={isDeleting}
        title="Delete Event"
        confirmationMessage={`Are you sure you want to permanently delete the event "${event?.title}"?`}
        deleteMessage="This action cannot be undone."
        actionText="Delete"
        actionType="delete"
      />
    </>
  );
};

export default CreatorViewModal;