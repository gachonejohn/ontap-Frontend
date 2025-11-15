import React, { createContext, useContext, useState, useCallback } from 'react';
import { VIEW_TYPES, EVENT_TYPE_OPTIONS } from '../../../constants/constants';

const CalendarContext = createContext(null);

export const useCalendarContext = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendarContext must be used within CalendarProvider');
  }
  return context;
};

export const CalendarProvider = ({ children }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState(VIEW_TYPES.MONTH);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  // const [selectedEventTypes, setSelectedEventTypes] = useState(
  //   Object.keys(EVENT_TYPES).map(key => EVENT_TYPES[key].id)
  // );
  const [selectedEventTypes, setSelectedEventTypes] = useState(
    EVENT_TYPE_OPTIONS.map(option => option.value)
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const toggleEventType = useCallback((typeId) => {
    setSelectedEventTypes(prev => {
      if (prev.includes(typeId)) {
        return prev.filter(id => id !== typeId);
      }
      return [...prev, typeId];
    });
  }, []);

  const openCreateModal = useCallback((date = null) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((event) => {
    setSelectedEvent(event);
    setSelectedDate(null);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setSelectedDate(null);
  }, []);

  const value = {
    currentDate,
    setCurrentDate,
    viewType,
    setViewType,
    selectedDepartment,
    setSelectedDepartment,
    selectedEventTypes,
    setSelectedEventTypes,
    toggleEventType,
    isModalOpen,
    selectedEvent,
    selectedDate,
    openCreateModal,
    openEditModal,
    closeModal
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};