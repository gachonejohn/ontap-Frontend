import { useState } from 'react';
import { useCurrentUser } from '../hooks/useCurrentUser';
import ConversationsSidebar from './ConversationsSidebar';
import ChatArea from './ChatArea';
import StartConversationModal from './StartConversationModal';

const ChatPage = () => {
  const { user, userId: currentUserId, isAuthenticated } = useCurrentUser();
  
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConversationSelect = (conversation) => {
    setSelectedConversation({
      conversationId: conversation.conversationId,
      participants: conversation.user,
      name: conversation.name,
      is_group: conversation.is_group,
      participants_count: conversation.participants_count,
      participants_list: conversation.participants_list || conversation.participants || [],
    });
  };

  const handleStartNewChat = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (!isAuthenticated || !user || !currentUserId) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold">Please log in to access chat</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full h-screen flex overflow-hidden">
        <ConversationsSidebar
          user={user}
          currentUserId={currentUserId}
          selectedConversation={selectedConversation}
          onConversationSelect={handleConversationSelect}
          onStartNewChat={handleStartNewChat}
        />

        <div className="flex-1 min-w-0 flex flex-col h-full bg-gray-50">
          <ChatArea
            selectedConversation={selectedConversation}
            currentUser={user}
            currentUserId={currentUserId}
          />
        </div>
      </div>

      <StartConversationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        currentUserId={currentUserId}
      />
    </>
  );
};

export default ChatPage;