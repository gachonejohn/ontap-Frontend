import { useState } from 'react';
import Img1 from '../assets/img6.jpg';
import { useGetAllUsersQuery, useStartConversationMutation } from '../../../store/services/chat/chatService';

const StartConversationModal = ({ isOpen, onClose, currentUserId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState('');
  
  const { data: allUsers = [], isLoading: usersLoading } = useGetAllUsersQuery(undefined, {
    skip: !isOpen,
  });
  
  const [startConversation, { isLoading: isStarting }] = useStartConversationMutation();

  const filteredUsers = allUsers.filter(employee => {
    if (employee.user?.id === currentUserId) return false;
    if (!searchTerm) return true;
    
    const fullName = `${employee.user?.first_name} ${employee.user?.last_name}`.toLowerCase();
    const email = employee.user?.email?.toLowerCase() || '';
    const department = employee.department?.name?.toLowerCase() || '';
    
    return fullName.includes(searchTerm.toLowerCase()) ||
           email.includes(searchTerm.toLowerCase()) ||
           department.includes(searchTerm.toLowerCase());
  });

  const handleUserToggle = (user) => {
    setSelectedUsers(prev => {
      const isSelected = prev.some(u => u.id === user.id);
      if (isSelected) {
        return prev.filter(u => u.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
  };

  const isUserSelected = (userId) => {
    return selectedUsers.some(u => u.id === userId);
  };

  const handleStartConversation = async () => {
    if (selectedUsers.length === 0 || isStarting) return;

    try {
      const participantIds = selectedUsers.map(user => user.id);
      
      const requestBody = {
        participant_ids: participantIds,
      };

      if (groupName.trim() && selectedUsers.length > 1) {
        requestBody.name = groupName.trim();
      }

      await startConversation(requestBody).unwrap();
      
      onClose();
      setSelectedUsers([]);
      setGroupName('');
      setSearchTerm('');
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedUsers([]);
    setGroupName('');
    setSearchTerm('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-800">Start New Conversation</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {selectedUsers.length > 0 && (
          <div className="px-6 py-3 bg-blue-50 border-b border-blue-100 flex-shrink-0">
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700">Selected ({selectedUsers.length}):</span>
              {selectedUsers.map(user => (
                <span
                  key={user.id}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary text-white"
                >
                  {user.first_name} {user.last_name}
                  <button
                    onClick={() => handleUserToggle(user)}
                    className="ml-2 hover:bg-white hover:bg-opacity-20 rounded-full"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {selectedUsers.length > 1 && (
          <div className="px-6 py-3 border-b border-gray-200 flex-shrink-0">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group Name (Optional)
            </label>
            <input
              type="text"
              placeholder="Enter group name..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>
        )}

        <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, email, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {usersLoading ? (
            <div className="flex items-center justify-center h-full py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-gray-500">Loading users...</p>
              </div>
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="pb-4">
              {filteredUsers.map((employee) => {
                const selected = isUserSelected(employee.user?.id);
                return (
                  <div
                    key={employee.id}
                    className={`flex items-center px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                      selected ? 'bg-blue-50 border-l-4 border-l-primary' : ''
                    }`}
                    onClick={() => handleUserToggle(employee.user)}
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={employee.user?.profile_picture || Img1}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                        alt={`${employee.user?.first_name} ${employee.user?.last_name}`}
                      />
                      {employee.user?.status?.status === 'online' && (
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>

                    <div className="ml-4 flex-1 min-w-0">
                      <h3 className="text-base font-semibold capitalize truncate">
                        {employee.user?.first_name} {employee.user?.last_name}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {employee.department?.name || employee.user?.email}
                      </p>
                    </div>

                    <div className="flex-shrink-0">
                      {selected ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      ) : (
                        <div className="h-6 w-6 border-2 border-gray-300 rounded-full"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full py-12">
              <div className="text-center text-gray-500 px-6">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <p className="font-semibold">No Users Found</p>
                <p className="text-sm mt-1">Try adjusting your search criteria</p>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between flex-shrink-0">
          <div className="text-sm text-gray-600">
            {selectedUsers.length === 0 ? (
              'Select at least one user'
            ) : selectedUsers.length === 1 ? (
              '1 user selected'
            ) : (
              `${selectedUsers.length} users selected (Group chat)`
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleStartConversation}
              disabled={selectedUsers.length === 0 || isStarting}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                selectedUsers.length > 0 && !isStarting
                  ? 'bg-primary text-white hover:bg-primary-dark'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isStarting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Starting...
                </span>
              ) : (
                'Start Conversation'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartConversationModal;