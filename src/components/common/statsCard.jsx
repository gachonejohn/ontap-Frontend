import React from 'react';

const StatCard = ({
  title,
  value,
  diff, 
  subtext,
  icon: Icon,
  iconColor = 'text-gray-500',
  iconBgColor = 'bg-gray-100',
  subtextColor = 'text-emerald-600'
}) => {
  const displayText = subtext || (diff ? `${diff} vs last month` : null);
  const hasSubtext = Boolean(displayText);
  
  // const textColor = subtextColor || 'text-emerald-600';

  return (
    <div
      className="flex items-start justify-between rounded-xl border border-gray-200 bg-white 
      px-3.5 py-3 shadow-sm hover:shadow-md transition-all duration-200 min-h-[110px]"
    >
      <div className="flex flex-col">
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        <p
          className={`${
            hasSubtext ? 'mt-1' : 'mt-5'
          } text-xl font-semibold text-gray-900`}
        >
          {value}
        </p>

       {hasSubtext && (
          <p className={`mt-1 text-xs font-normal ${subtextColor}`}>
            {subtext || `${diff} vs last month`}
          </p>
        )}
      </div>

      <div
        className={`flex items-center justify-center rounded-lg ${iconBgColor} p-2 min-w-[36px] min-h-[36px]`}
      >
        {Icon && <Icon size={20} className={`${iconColor}`} />}
      </div>
    </div>
  );
};

export default StatCard;