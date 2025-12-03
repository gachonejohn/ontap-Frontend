import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import Img1 from '../assets/img6.jpg';
import IMG2 from '../assets/img6.jpg';
import Input from '../input';
import { 
  useGetMessagesQuery, 
  useSendMessageMutation, 
  useReactToMessageMutation, 
  useEditMessageMutation  } from '../../../store/services/chat/chatService';
import AttachmentModal from '../modals/AttachmentModal';
import AttachmentPreview from '../modals/AttachementPreview';
import MessageAttachment from '../messages/MessageAttachment';
import MessageActions from '../messages/MessageActions';
import ReactionPicker from '../messages/ReactionPicker';
import MessageReactions from '../messages/MessageReactions';
import ReplyPreview from '../messages/ReplyPreview';
import RepliedMessageDisplay from '../messages/RepliedMessageDisplay';


const ChatArea = ({ selectedConversation, currentUser, currentUserId }) => {
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(1);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const loadMoreRef = useRef(null);
  const prevScrollHeight = useRef(0);
  const isInitialLoad = useRef(true);
  const prevMessagesLength = useRef(0);

  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileCaption, setFileCaption] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const [replyTo, setReplyTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editText, setEditText] = useState('');
  const [activeMessageMenu, setActiveMessageMenu] = useState(null);
  const [activeReactionPicker, setActiveReactionPicker] = useState(null);

  const [reactToMessage] = useReactToMessageMutation();
  const [editMessage] = useEditMessageMutation();

  const { data, isLoading, isFetching } = useGetMessagesQuery(
    { conversationId: selectedConversation?.conversationId, page },
    { skip: !selectedConversation?.conversationId }
  );

  const messages = data?.messages || [];
  const hasMoreOlder = !!data?.previousPage; 

  const [sendMessageMutation, { isLoading: isSending }] = useSendMessageMutation();

  useEffect(() => {
    setPage(1);
    isInitialLoad.current = true;
    prevScrollHeight.current = 0;
    prevMessagesLength.current = 0;
  }, [selectedConversation?.conversationId]);

  useEffect(() => {
    if (messages.length > 0 && isInitialLoad.current && !isLoading && page === 1) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
        isInitialLoad.current = false;
      }, 100);
    }
  }, [messages.length, isLoading, page]);

  useEffect(() => {
    if (page === 1 || isInitialLoad.current) return;
    if (!messagesContainerRef.current || !prevScrollHeight.current) return;
    if (messages.length === prevMessagesLength.current) return; 

    const container = messagesContainerRef.current;

    requestAnimationFrame(() => {
      const newHeight = container.scrollHeight;
      const scrollDiff = newHeight - prevScrollHeight.current;
      container.scrollTop = scrollDiff;
      prevScrollHeight.current = 0;
      prevMessagesLength.current = messages.length;
    });
  }, [messages.length, page]);

  useEffect(() => {
    if (!loadMoreRef.current || !hasMoreOlder || isFetching || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreOlder && !isFetching && !isLoading) {
          if (messagesContainerRef.current) {
            prevScrollHeight.current = messagesContainerRef.current.scrollHeight;
            prevMessagesLength.current = messages.length;
          }
          setPage((prev) => prev + 1);
        }
      },
      { 
        threshold: 0.5,
        root: messagesContainerRef.current,
        rootMargin: '20px'
      }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasMoreOlder, isFetching, isLoading, messages.length]);

 

const handleReply = (msg) => {
  setReplyTo(msg);
  setActiveMessageMenu(null);
};

const handleEdit = (msg) => {
  setEditingMessage(msg);
  setEditText(msg.message);
  setMessage(msg.message);
  setActiveMessageMenu(null);
};

const handleReact = (messageId) => {
  setActiveReactionPicker(messageId);
  setActiveMessageMenu(null);
};

const handleSelectReaction = async (messageId, reaction) => {
  try {
    await reactToMessage({
      conversationId: selectedConversation.conversationId,
      messageId,
      reaction,
    }).unwrap();
  } catch (error) {
    console.error('Failed to add reaction:', error);
  }
};

const handleSaveEdit = async () => {
  if (!editText.trim() || !editingMessage) return;

  try {
    await editMessage({
      conversationId: selectedConversation.conversationId,
      messageId: editingMessage.id,
      message_content: editText.trim(),
    }).unwrap();

    setEditingMessage(null);
    setEditText('');
    setMessage('');
  } catch (error) {
    console.error('Failed to edit message:', error);
  }
};

const handleCancelEdit = () => {
  setEditingMessage(null);
  setEditText('');
  setMessage('');
};  

const handleSendMessage = async () => {
  // Handle file upload
  if (selectedFile) {
    if (!selectedConversation?.conversationId || isSending) return;

    try {
      setUploadProgress(10);
      
      // Map attachment type to message_type for backend
      const messageTypeMap = {
        photo: 'image',
        video: 'video',
        audio: 'audio',
        document: 'file',
      };

      await sendMessageMutation({
        conversationId: selectedConversation.conversationId,
        message_content: fileCaption.trim() || undefined,
        message_type: messageTypeMap[selectedFile.type], // This sends: 'image', 'video', 'audio', or 'document'
        file: selectedFile.file,
      }).unwrap();
      
      setUploadProgress(100);
      setSelectedFile(null);
      setFileCaption('');
      
      setTimeout(() => {
        setUploadProgress(0);
        messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    } catch (error) {
      console.error('Failed to send attachment:', error);
      setUploadProgress(0);
      toast.error('Failed to send attachment, try again')
    }
    return;
  }

  // Handle text message
  if (!message.trim() || !selectedConversation?.conversationId || isSending) return;

  try {
    await sendMessageMutation({
      conversationId: selectedConversation.conversationId,
      message_content: message,
      message_type: 'text', 
      reply_to: replyTo?.id || null,
    }).unwrap();

    setMessage('');
    setReplyTo(null);
    setTimeout(() => {
      messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  } catch (error) {
    console.error('Failed to send message:', error);
  }
};

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAttachmentTypeSelect = (type) => {
  // Create a hidden file input
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = type.accept;
  
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (e.g., max 50MB)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        toast.error('File size exceeds the 50MB limit.');
        return;
      }
      
      setSelectedFile({
        file,
        type: type.id
      });
      setFileCaption('');
    }
  };
  
  input.click();
};

const handleRemoveFile = () => {
  setSelectedFile(null);
  setFileCaption('');
  setUploadProgress(0);
};

const handleCaptionChange = (caption) => {
  setFileCaption(caption);
};

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

    if (dateOnly.getTime() === todayOnly.getTime()) {
      return 'Today';
    } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach((msg) => {
      const date = new Date(msg.timestamp);
      const dateKey = date.toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(msg);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate(messages);

  const isUserOnline = (status) => {
    return status?.status === 'online';
  };

  const getParticipantsText = () => {
    if (!selectedConversation.participants_list || selectedConversation.participants_list.length === 0) {
      return `${selectedConversation.participants_count || 0} participants`;
    }

    const otherParticipants = selectedConversation.participants_list.filter(
      p => p.id !== currentUserId
    );

    if (otherParticipants.length === 0) return 'You';

    return otherParticipants.map((p, index) => {
      const name = `${p.first_name} ${p.last_name}`;
      if (index === otherParticipants.length - 1) {
        return name;
      } else if (index === otherParticipants.length - 2) {
        return `${name} and `;
      } else {
        return `${name}, `;
      }
    }).join('');
  };

  const getConversationTitle = () => {
    if (selectedConversation.name) {
      return selectedConversation.name;
    }
    if (selectedConversation.is_group && selectedConversation.participants_list) {
      const names = selectedConversation.participants_list
        .filter(p => p.id !== currentUserId)
        .map(p => p.first_name)
        .slice(0, 3);
      return names.join(', ') + (selectedConversation.participants_list.length > 4 ? '...' : '');
    }
    return `${selectedConversation.participants?.first_name || ''} ${selectedConversation.participants?.last_name || ''}`;
  };

  const handleLoadMore = () => {
    if (messagesContainerRef.current) {
      prevScrollHeight.current = messagesContainerRef.current.scrollHeight;
      prevMessagesLength.current = messages.length;
    }
    setPage((prev) => prev + 1);
  };

  if (!selectedConversation?.conversationId) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-400">
          <svg
            className="mx-auto h-24 w-24 text-gray-300 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-500 mb-2">Welcome to Messages</h3>
          <p className="text-gray-400">Select a conversation to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center px-8 py-4 bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
        <div className="relative flex-shrink-0">
          {selectedConversation.is_group ? (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center border-2 border-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
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
                src={selectedConversation.participants?.profile_picture || Img1}
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                alt="User"
              />
              {isUserOnline(selectedConversation.participants?.status) && (
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </>
          )}
        </div>
        <div className="ml-4 flex-1 min-w-0">
          <h3 className="text-lg font-semibold capitalize truncate">
            {getConversationTitle()}
          </h3>
          <p className="text-sm text-gray-500 truncate capitalize">
            {selectedConversation.is_group ? (
              getParticipantsText()
            ) : (
              isUserOnline(selectedConversation.participants?.status) 
                ? 'Online' 
                : `Last seen ${selectedConversation.participants?.status?.last_seen 
                    ? new Date(selectedConversation.participants.status.last_seen).toLocaleString() 
                    : 'recently'}`
            )}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
        </div>
      </div>

      <div 
        ref={messagesContainerRef}
        className="flex-1 min-h-0 overflow-y-auto px-8 py-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      >
        {isLoading && page === 1 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-gray-500">Loading messages...</p>
            </div>
          </div>
        ) : messages.length > 0 ? (
          <div className="space-y-6 min-w-0">
            {hasMoreOlder && (
              <div ref={loadMoreRef} className="flex items-center justify-center py-6">
                {isFetching ? (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-xs text-gray-500">Loading older messages...</p>
                  </div>
                ) : (
                  <button 
                    className="text-sm text-primary hover:text-primary-dark font-medium px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
                    onClick={handleLoadMore}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    Load older messages
                  </button>
                )}
              </div>
            )}

            {Object.entries(messageGroups).map(([dateKey, dateMessages]) => (
              <div key={dateKey}>
                <div className="flex items-center justify-center my-6">
                  <div className="bg-gray-200 text-gray-600 text-xs font-medium px-4 py-1.5 rounded-full">
                    {formatDate(dateMessages[0].timestamp)}
                  </div>
                </div>

                <div className="space-y-4">
                  {dateMessages.map((msg) => {
                    const isOwnMessage = msg.user?.id === currentUserId;
                    
                    return (
                      <div key={msg.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                        <div className="flex items-end max-w-[65%] group relative">
                          {!isOwnMessage && (
                            <div className="relative flex-shrink-0 mr-2">
                              <img
                                src={msg.user?.profile_picture || Img1}
                                className="w-8 h-8 rounded-full object-cover border border-gray-200"
                                alt={msg.user?.first_name}
                              />
                            </div>
                          )}
                          
                          <div className="flex flex-col flex-1">
                            <div
                              className={`rounded-2xl px-4 py-2.5 ${
                                isOwnMessage
                                  ? 'bg-slate-400 text-white rounded-br-sm'
                                  : 'bg-white text-gray-800 rounded-bl-sm shadow-sm'
                              }`}
                            >
                              {!isOwnMessage && selectedConversation.is_group && (
                                <p className="text-xs font-semibold mb-1 capitalize text-gray-700">
                                  {msg.user?.first_name} {msg.user?.last_name}
                                </p>
                              )}
                              
                              {/* Replied Message Display */}
                              {msg.replied_to && (
                                <RepliedMessageDisplay
                                  repliedTo={msg.replied_to}
                                  isOwnMessage={isOwnMessage}
                                />
                              )}
                              
                              {/* Message Content */}
                              {msg.message_type === 'text' ? (
                                <p className="break-words text-sm leading-relaxed">{msg.message}</p>
                              ) : (
                                <MessageAttachment message={msg} isOwnMessage={isOwnMessage} />
                              )}
                              
                              <div className={`flex items-center mt-1 space-x-1 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                                <span className={`text-xs ${isOwnMessage ? 'text-gray-200' : 'text-gray-500'}`}>
                                  {formatTime(msg.timestamp)}
                                </span>
                                {msg.is_edited && (
                                  <span className={`text-xs ${isOwnMessage ? 'text-gray-200' : 'text-gray-400'}`}>• Edited</span>
                                )}
                              </div>
                            </div>
                            
                            {/* Reactions Display */}
                            <MessageReactions
                              reactions={msg.reactions}
                              onReactionClick={(type) => handleSelectReaction(msg.id, type)}
                              currentUserId={currentUserId}
                            />
                          </div>

                          {isOwnMessage && (
                            <div className="relative flex-shrink-0 ml-2">
                              <img
                                src={currentUser?.profile_picture || IMG2}
                                className="w-8 h-8 rounded-full object-cover border border-gray-200"
                                alt="You"
                              />
                            </div>
                          )}
                          
                          {/* Message Actions Button */}
                          <button
                            onClick={() => setActiveMessageMenu(activeMessageMenu === msg.id ? null : msg.id)}
                            className="absolute -top-3 right-0 p-1.5 bg-white border border-gray-200 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          
                          {/* Message Actions Menu */}
                          <MessageActions
                            isOpen={activeMessageMenu === msg.id}
                            onClose={() => setActiveMessageMenu(null)}
                            onReply={() => handleReply(msg)}
                            onEdit={() => handleEdit(msg)}
                            onReact={() => handleReact(msg.id)}
                            isOwnMessage={isOwnMessage}
                            position={isOwnMessage ? 'left' : 'right'}
                          />
                          
                          {/* Reaction Picker */}
                          <div className="relative">
                            <ReactionPicker
                              isOpen={activeReactionPicker === msg.id}
                              onClose={() => setActiveReactionPicker(null)}
                              onSelectReaction={(reaction) => handleSelectReaction(msg.id, reaction)}
                              position="top"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <svg
                className="mx-auto h-16 w-16 text-gray-300 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              <p className="text-lg font-semibold mb-1">No messages yet</p>
              <p className="text-sm">
                Start the conversation{selectedConversation.is_group ? '!' : ` with ${selectedConversation.participants?.first_name}!`}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="px-8 py-4 bg-white border-t border-gray-200 flex-shrink-0">
        {replyTo && !editingMessage && (
        <ReplyPreview
          replyTo={replyTo}
          onCancel={() => setReplyTo(null)}
        />
      )}
      
      {/* Edit Mode Indicator */}
      {editingMessage && (
        <div className="px-8 py-3 bg-amber-50 border-l-4 border-amber-400">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span className="text-sm font-semibold text-amber-700">Edit Message</span>
            </div>
            <button
              onClick={handleCancelEdit}
              className="text-sm text-amber-600 hover:text-amber-800 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
        <div className="flex items-center space-x-3">
          <div className="px-8 py-4 bg-white border-t border-gray-200 flex-shrink-0">
          {/* File Preview */}
          {selectedFile && (
            <AttachmentPreview
              file={selectedFile.file}
              onRemove={handleRemoveFile}
              onCaptionChange={handleCaptionChange}
              caption={fileCaption}
            />
          )}

          {/* Upload Progress */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Uploading...</span>
                <span className="text-sm font-medium text-primary">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-3">
            {/* Rest of your input area code... */}
          </div>
        </div>
          <button 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
              onClick={() => setIsAttachmentModalOpen(true)}
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          <div className="flex-1">
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full"
              inputClassName="w-full px-4 py-3 border border-gray-300 rounded-full bg-gray-50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              disabled={isSending}
            />
          </div>

          <button
            className={`p-3 rounded-full transition-all flex-shrink-0 ${
              (message.trim() || selectedFile) && !isSending
                ? 'bg-primary hover:bg-primary-dark text-white shadow-md hover:shadow-lg'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            // onClick={handleSendMessage}
            // disabled={(!message.trim() && !selectedFile) || isSending}
            onClick={editingMessage ? handleSaveEdit : handleSendMessage}
            disabled={(!message.trim() && !selectedFile) || isSending}
          >
            {editingMessage ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            )}

          </button>
        </div>
      </div>
      <AttachmentModal
      isOpen={isAttachmentModalOpen}
      onClose={() => setIsAttachmentModalOpen(false)}
      onSelectType={handleAttachmentTypeSelect}
    />
    </>
  );
};

export default ChatArea;