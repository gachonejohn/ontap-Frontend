import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogoutUserMutation, useSwitchRoleMutation } from '@store/services/auth/authService';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { userLoggedOut } from '@store/services/auth/authSlice';
import { usePermissions } from '@hooks/getPermissions';
import { toast } from 'react-toastify';
import ClickOutside from '@hooks/ClickOutside';
import { LuCrown } from 'react-icons/lu';
import { PiSignOut } from 'react-icons/pi';
import { IoKeyOutline } from 'react-icons/io5';
import ActionModal from '@components/common/Modals/ActionModal';
import OverlayLoader from '@components/common/spinners/OverlayLoader';

const AccountMenu = ({ isOpen, onClose, exceptionRef }) => {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);
  const { isLoadingPermissions } = usePermissions();

  const [switchRole, { isLoading: isSwitchingRole }] = useSwitchRoleMutation();
  const [logoutUser, { isLoading: isLoggingOut }] = useLogoutUserMutation();

  const [modalType, setModalType] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);

  const navigate = useNavigate();
  const isLoadingUser = loading || isLoadingPermissions;

  const openSwitchRoleModal = (item) => {
    setSelectedItem(item);
    setModalType('switchRole');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType('');
    setSelectedItem(null);
  };

  const handleMenuClose = () => {
    closeModal();
    onClose();
  };

  const handleLogout = async () => {
    try {
      const loadingToast = toast.loading('Logging out...');
      await logoutUser({}).unwrap();
      dispatch(userLoggedOut());
      toast.update(loadingToast, {
        render: 'Logged out successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 2000,
      });
      navigate('/');
    } catch (error) {
      toast.error('Failed to logout. Please try again.');
      console.error('Logout error:', error);
    }
  };

  const handleSwitchRole = async () => {
    const role = selectedItem;
    const payLoad = {
      role_id: role.role.id,
    };

    try {
      setShowOverlay(true);
      await switchRole(payLoad).unwrap();
      toast.success(`Switched to ${role.role.name}`);
      closeModal();
      onClose();
    } catch (error) {
      if (error && typeof error === 'object' && 'data' in error && error.data) {
        toast.error(error.data.error || 'Error switching role!');
      } else {
        toast.error('Unexpected error occurred. Please try again.');
      }
    } finally {
      setShowOverlay(false);
    }
  };

  if (!isOpen) return null;

  const roles = user?.role?.profile?.roles ?? [];
  console.log('User Roles:', roles);

  return (
    <>
      {showOverlay && <OverlayLoader />}
      <ClickOutside onClick={handleMenuClose} exceptionRef={exceptionRef}>
        <div className="absolute top-16 right-5 flex flex-col border rounded-lg shadow-md bg-white overflow-hidden z-50 min-w-64">
          <div className="flex flex-col gap-0.5 px-3 pt-3 pb-2 border-b">
            <div className="font-inter text-base text-neutral-900 font-medium whitespace-nowrap">
              {user?.first_name} {user?.last_name}
            </div>
            <div className="font-inter text-xs text-gray-600 whitespace-normal break-words">
              {user?.email}
            </div>
            {user?.position?.name && (
              <div className="font-inter text-xs mt-3 py-1.5 px-3 rounded-2xl shadow-sm bg-primary-50 text-primary w-fit font-normal whitespace-normal break-words">
                {user?.position?.name}
              </div>
            )}
          </div>

          {roles.length >= 1 && (
            <div className="flex flex-col w-full max-h-[30vh] overflow-y-auto border-b pb-2 px-1 mb-2">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                Switch Role
              </div>
              {roles.map((item) => (
                <div
                  key={item.id}
                  className={`flex justify-between items-center min-h-15 gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50 ${
                    item.is_active
                      ? 'bg-primary-50/70 border-l-4 border-primary p-4 md:rounded-lg'
                      : ''
                  }`}
                  onClick={() => openSwitchRoleModal(item)}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex items-center justify-center w-6 h-6 ${
                        item.is_active ? 'bg-primary-100' : 'bg-gray-100'
                      } rounded-lg  text-gray-700`}
                    >
                      <IoKeyOutline
                        size={16}
                        className={`${item.is_active ? 'text-primary' : 'text-gray-700'}`}
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-800">{item?.role?.name}</span>
                    </div>
                  </div>

                  {item.is_active && (
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-primary bg-primary-100 px-2 py-0.5 rounded-md">
                        Active
                      </span>
                      {item.is_primary && <LuCrown size={14} className="text-yellow-500" />}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex flex-col items-center min-h-15 cursor-pointer hover:bg-gray-50 w-full"
          >
            <div className="flex flex-row items-center gap-2 px-4 w-full min-h-15">
              {isLoggingOut ? (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
              ) : (
                <PiSignOut size={22} className="text-gray-700" />
              )}
              <span className="text-red-500 font-medium">
                {isLoggingOut ? 'Signing out...' : 'Sign Out'}
              </span>
            </div>
          </div>

          <ActionModal
            isOpen={isModalOpen}
            onClose={closeModal}
            actionType={modalType === 'switchRole' ? 'submit' : ''}
            onDelete={modalType === 'switchRole' ? handleSwitchRole : null}
            isDeleting={isSwitchingRole}
            title={modalType === 'switchRole' ? 'Confirm Switch Role' : 'Confirm Clock Out'}
            confirmationMessage={
              modalType === 'switchRole' ? 'Are you sure you want to switch roles now?' : '?'
            }
            deleteMessage="This action will change the dashboard view as per permissions of the role you are switching to."
            actionText={modalType === 'switchRole' ? 'Switch Role' : ''}
          />
        </div>
      </ClickOutside>
    </>
  );
};

export default AccountMenu;
