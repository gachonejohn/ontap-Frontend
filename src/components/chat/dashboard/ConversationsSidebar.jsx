import { useEffect, useRef, useState } from 'react';
import Img1 from '../assets/img6.jpg';
import IMG2 from '../assets/img6.jpg';
import { useGetConversationsQuery } from '../../../store/services/chat/chatService';

const ConversationsSidebar = ({ 
  user, 
  currentUserId, 
  selectedConversation, 
  onConversationSelect, 
  onStartNewChat 
}) => {
  const [page, setPage] = useState(1);
  const scrollRef = useRef(null);
  const loadMoreRef = useRef(null);

  const { data, isLoading, isFetching } = useGetConversationsQuery(
    { userId: currentUserId, page },
    { skip: !currentUserId }
  );

  const conversations = data?.conversations || [];
  const hasMore = !!data?.nextPage;

  useEffect(() => {
    if (!loadMoreRef.current || !hasMore || isFetching) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasMore, isFetching]);

  const isUserOnline = (status) => {
    return status?.status === 'online';
  };

  const getConversationTitle = (conversation) => {
    if (conversation.name) {
      return conversation.name;
    }
    if (conversation.is_group && conversation.participants_list) {
      const names = conversation.participants_list
        .filter(p => p.id !== currentUserId)
        .map(p => p.first_name)
        .slice(0, 3);
      return names.join(', ') + (conversation.participants_list.length > 4 ? '...' : '');
    }
    return `${conversation.user?.first_name || ''} ${conversation.user?.last_name || ''}`;
  };

  return (
    <div className="w-80 flex-shrink-0 h-full flex flex-col border-r border-gray-200 bg-white">
      <div className="flex items-center px-6 py-6 border-b border-gray-200 bg-white flex-shrink-0">
        <div className="relative">
          <img
            src={user?.profile_picture || IMG2}
            className="w-16 h-16 rounded-full object-cover border-2 border-primary"
            alt="Profile"
          />
        </div>
        <div className="ml-4 flex-1 min-w-0">
          <h5 className="text-lg font-semibold capitalize truncate">
            {user?.first_name} {user?.last_name}
          </h5>
          <p className="text-sm text-gray-500 truncate">
            {user?.department_name || user?.email}
          </p>
        </div>
      </div>

      <div className="px-6 py-4 bg-white border-b border-gray-200 flex-shrink-0 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Messages</h3>
        <button
          onClick={onStartNewChat}
          className="p-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
          title="Start new conversation"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      >
        {isLoading && page === 1 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-gray-500">Loading...</p>
            </div>
          </div>
        ) : conversations.length > 0 ? (
          <div className="pb-4">
            {conversations.map((conversation) => (
              <div
                key={conversation.conversationId}
                className={`flex items-center px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                  selectedConversation?.conversationId === conversation.conversationId 
                    ? 'bg-blue-50 border-l-4 border-l-primary' 
                    : ''
                }`}
                onClick={() => onConversationSelect(conversation)}
              >
                <div className="relative flex-shrink-0">
                  {conversation.is_group ? (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center border-2 border-gray-200">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-7 w-7 text-white"
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
                    </div>
                  ) : (
                    <>
                      <img
                        src={conversation.user?.profile_picture || Img1}
                        className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
                        alt={`${conversation.user?.first_name} ${conversation.user?.last_name}`}
                      />
                      {isUserOnline(conversation.user?.status) && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </>
                  )}
                </div>

                <div className="ml-4 flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base font-semibold capitalize truncate">
                      {getConversationTitle(conversation)}
                    </h3>
                    {conversation.unread_count > 0 && (
                      <span className="ml-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full flex-shrink-0">
                        {conversation.unread_count}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {conversation.last_message || 'No messages yet'}
                  </p>
                </div>
              </div>
            ))}

            {hasMore && (
              <div ref={loadMoreRef} className="flex items-center justify-center py-4">
                {isFetching ? (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : (
                  <div className="h-4"></div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
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
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p className="font-semibold">No Conversations</p>
              <p className="text-sm mt-1">Start a new chat to begin messaging</p>
              <button
                onClick={onStartNewChat}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Start Conversation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationsSidebar;