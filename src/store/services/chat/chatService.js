import { apiSlice } from '../../api/apiSlice';

export const chatApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: ({ userId, page = 1 }) => ({
        url: '/chat/conversations/',
        method: 'GET',
        params: { page },
      }),
      transformResponse: (response, meta, { userId }) => {
        return {
          conversations: response.results.map(conv => {
            const isGroup = conv.participants.length > 2;
            
            const otherUser = !isGroup 
              ? conv.participants.find(p => p.id !== userId)
              : null;
            
            return {
              conversationId: conv.conversation_id,
              name: conv.name || null,
              is_group: isGroup,
              participants_count: conv.participants.length,
              participants_list: conv.participants,
              user: otherUser ? {
                id: otherUser.id,
                first_name: otherUser.first_name,
                last_name: otherUser.last_name,
                email: otherUser.email,
                profile_picture: otherUser.profile_picture,
                status: otherUser.status,
              } : null,
              last_message: conv.last_message?.content || "",
              unread_count: conv.unread_count,
              last_message_timestamp: conv.last_message?.timestamp
            };
          }),
          nextPage: response.next ? response.next.split('page=')[1]?.split('&')[0] : null,
          previousPage: response.previous ? response.previous.split('page=')[1]?.split('&')[0] : null,
          count: response.count,
        };
      },
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return `${endpointName}-${queryArgs.userId}`;
      },
      merge: (currentCache, newResponse, { arg }) => {
        if (arg.page === 1) {
          return newResponse;
        }
        return {
          ...newResponse,
          conversations: [
            ...currentCache.conversations,
            ...newResponse.conversations,
          ],
        };
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.page !== previousArg?.page;
      },
      providesTags: ['Conversations'],
    }),

   getMessages: builder.query({
      query: ({ conversationId, page = 1 }) => ({
        url: `/chat/conversations/${conversationId}/messages/`,
        method: 'GET',
        params: { page },
      }),
      transformResponse: (response) => {
        return {
          messages: response.results.reverse().map(msg => ({
            id: msg.message_id,
            message: msg.content,
            timestamp: msg.timestamp,
            message_type: msg.message_type,
            file_url: msg.attachment,
            file_name: msg.attachment ? msg.attachment.split('/').pop() : null,
            file_size: null,
            replied_to: msg.reply_to ? {
              id: msg.reply_to.message_id,
              message: msg.reply_to.content,
              message_type: msg.reply_to.message_type,
              user: msg.reply_to.sender ? {
                id: msg.reply_to.sender.id,
                first_name: msg.reply_to.sender.first_name,
                last_name: msg.reply_to.sender.last_name,
                email: msg.reply_to.sender.email,
                profile_picture: msg.reply_to.sender.profile_picture
              } : null
            } : null,
            reactions: msg.reactions || [],
            user: {
              id: msg.sender.id,
              first_name: msg.sender.first_name,
              last_name: msg.sender.last_name,
              email: msg.sender.email,
              profile_picture: msg.sender.profile_picture
            },
            is_edited: msg.is_edited,
            edited_at: msg.edited_at
          })),
          nextPage: response.next ? parseInt(response.next.split('page=')[1]?.split('&')[0]) : null,
          previousPage: response.previous ? parseInt(response.previous.split('page=')[1]?.split('&')[0]) : null,
          count: response.count,
          totalPages: Math.ceil(response.count / 60), 
        };
      },
    }),

   sendMessage: builder.mutation({
    query: ({ conversationId, message_content, message_type = 'text', file = null, reply_to = null }) => {
      if (file) {
        const formData = new FormData();
        formData.append('message_type', message_type);
        if (message_content) {
          formData.append('message_content', message_content);
        }
        formData.append('attachment', file);
        if (reply_to) {
          formData.append('reply_to', reply_to);
        }
        return {
          url: `/chat/conversations/${conversationId}/send-message/`,
          method: 'POST',
          body: formData,
        };
      }
      
      return {
        url: `/chat/conversations/${conversationId}/send-message/`,
        method: 'POST',
        body: {
          message_content,
          message_type: 'text',
          reply_to,
        },
      };
    },
    transformResponse: (response) => ({
      id: response.message_id,
      message: response.content,
      timestamp: response.timestamp,
      message_type: response.message_type,
      file_url: response.attachment,
      file_name: response.attachment ? response.attachment.split('/').pop() : null,
      file_size: null,
      replied_to: response.reply_to ? {
        id: response.reply_to.message_id,
        message: response.reply_to.content,
        message_type: response.reply_to.message_type,
        user: response.reply_to.sender ? {
          id: response.reply_to.sender.id,
          first_name: response.reply_to.sender.first_name,
          last_name: response.reply_to.sender.last_name,
          email: response.reply_to.sender.email,
          profile_picture: response.reply_to.sender.profile_picture
        } : null
      } : null,
      reactions: response.reactions || [],
      user: {
        id: response.sender.id,
        first_name: response.sender.first_name,
        last_name: response.sender.last_name,
        email: response.sender.email,
        profile_picture: response.sender.profile_picture
      }
    }),
    async onQueryStarted({ conversationId, message_content }, { dispatch, queryFulfilled }) {
      try {
        const { data: newMessage } = await queryFulfilled;
        
        dispatch(
          chatApi.util.updateQueryData('getMessages', { conversationId, page: 1 }, (draft) => {
            if (draft && draft.messages) {
              draft.messages.push(newMessage);
            }
          })
        );
      } catch {}
    },
    invalidatesTags: (result, error, { conversationId }) => [
      'Conversations'
    ],
  }),

    getAllUsers: builder.query({
      query: () => ({
        url: 'chat/users/',
        method: 'GET',
      }),
      providesTags: ['Users'],
    }),

    startConversation: builder.mutation({
      query: (body) => ({
        url: 'chat/conversations/',
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['Conversations'],
    }),

    getUnreadCount: builder.query({
      query: () => ({
        url: '/chat/unread-count/',
        method: 'GET',
      }),
      providesTags: ['UnreadCount'],
    }),


    reactToMessage: builder.mutation({
      query: ({ conversationId, messageId, reaction }) => ({
        url: `/chat/messages/${messageId}/react/`,
        method: 'POST',
        body: { reaction },
      }),
      async onQueryStarted({ conversationId, messageId, reaction }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            chatApi.util.invalidateTags([{ type: 'Messages', id: conversationId }])
          );
        } catch {}
      },
    }),

    editMessage: builder.mutation({
      query: ({ conversationId, messageId, message_content }) => ({
        url: `/chat/messages/${messageId}/`,
        method: 'PATCH',
        body: { message_content },
      }),
      async onQueryStarted({ conversationId, messageId, message_content }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(
            chatApi.util.updateQueryData('getMessages', { conversationId, page: 1 }, (draft) => {
              if (draft && draft.messages) {
                const message = draft.messages.find(m => m.id === messageId);
                if (message) {
                  message.message = message_content;
                  message.is_edited = true;
                }
              }
            })
          );
        } catch {}
      },
    }),


  }),
});

export const {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useGetAllUsersQuery,
  useStartConversationMutation,
  useGetUnreadCountQuery,
  useReactToMessageMutation,
  useEditMessageMutation,

} = chatApi;