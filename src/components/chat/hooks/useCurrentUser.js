import { useSelector } from 'react-redux';

/**
 * Custom hook to get the current authenticated user from Redux store
 * @returns {Object} Current user object with id, email, first_name, last_name, profile_picture, etc.
 */
export const useCurrentUser = () => {
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = !!user;
  const userId = user?.user?.id;
  
  // console.log('userId:', userId);
  // console.log('useCurrentUser hook called, user:', user);

  return {
    user,
    userId,
    isAuthenticated,
    getFullName: () => user ? `${user.first_name} ${user.last_name}` : '',
    getInitials: () => {
      if (!user) return '';
      return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();
    },
  };
  
};

export default useCurrentUser;