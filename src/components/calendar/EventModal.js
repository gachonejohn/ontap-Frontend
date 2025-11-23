import React from 'react';
import { useCalendarContext } from './context/CalendarContext';
import { 
  CreateEventModal, 
  CreatorViewModal, 
  ParticipantViewModal 
} from './modals';
import { useSelector } from 'react-redux';

const EventModal = () => {
  const { isModalOpen, closeModal, selectedDate, selectedEvent } = useCalendarContext();
  
  const currentUser = useSelector((state) => state.auth.user);
  const currentUserId = currentUser?.id;

  const getModalType = () => {
    if (!selectedEvent) {
      return 'create';
    }

    // Editing existing event
    // Check if current user is the organizer
    const isOrganizer = selectedEvent.organizer?.employee?.id === currentUserId || 
                        selectedEvent.organizer?.id === currentUserId;
    
    return isOrganizer ? 'creator' : 'participant';
  };

  const modalType = getModalType();

  return (
    <>
      {modalType === 'create' && (
        <CreateEventModal
          isOpen={isModalOpen}
          onClose={closeModal}
          selectedDate={selectedDate}
        />
      )}

      {modalType === 'creator' && (
        <CreatorViewModal
          isOpen={isModalOpen}
          onClose={closeModal}
          event={selectedEvent}
          currentUserId={currentUserId}
        />
      )}

      {modalType === 'participant' && (
        <ParticipantViewModal
          isOpen={isModalOpen}
          onClose={closeModal}
          event={selectedEvent}
          currentUserId={currentUserId}
        />
      )}
    </>
  );
};

export default EventModal;