import { useLocation } from 'react-router-dom';

const SettingsLayout = ({ children, customTitle, customDescription, customActions }) => {
  const location = useLocation();

  const defaultContent = {
    title: 'Organization Settings',
    description: 'Configure policies, departments, positions, leave and roles.',
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1.5">
          <div className="text-lg text-neutral-900 font-semibold">
            {customTitle || defaultContent.title}
          </div>
          <div className="text-sm text-gray-600 font-normal">
            {customDescription || defaultContent.description}
          </div>
        </div>

        {customActions && <div>{customActions}</div>}
      </div>

      {/* Content */}
      {children}
    </div>
  );
};

export default SettingsLayout;
