const MessageReactions = ({ reactions, onReactionClick, currentUserId }) => {
  if (!reactions || reactions.length === 0) return null;

  const reactionEmojis = {
    like: '👍',
    love: '❤️',
    laugh: '😂',
    wow: '😮',
    sad: '😢',
    angry: '😠',
  };

  // Group reactions by type
  const groupedReactions = reactions.reduce((acc, reaction) => {
    const type = reaction.reaction_type || reaction.reaction;
    if (!acc[type]) {
      acc[type] = {
        count: 0,
        users: [],
        hasCurrentUser: false,
      };
    }
    acc[type].count++;
    acc[type].users.push(reaction.user);
    if (reaction.user.id === currentUserId) {
      acc[type].hasCurrentUser = true;
    }
    return acc;
  }, {});

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {Object.entries(groupedReactions).map(([type, data]) => {
        const userNames = data.users
          .slice(0, 3)
          .map(u => `${u.first_name} ${u.last_name}`)
          .join(', ');
        const moreCount = data.count > 3 ? ` and ${data.count - 3} more` : '';
        const tooltip = `${userNames}${moreCount}`;

        return (
          <button
            key={type}
            onClick={() => onReactionClick(type)}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-all hover:scale-110 ${
              data.hasCurrentUser
                ? 'bg-blue-100 border border-blue-300'
                : 'bg-gray-100 border border-gray-200 hover:bg-gray-200'
            }`}
            title={tooltip}
          >
            <span className="text-sm">{reactionEmojis[type]}</span>
            <span className={`font-medium ${
              data.hasCurrentUser ? 'text-blue-700' : 'text-gray-600'
            }`}>
              {data.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default MessageReactions;