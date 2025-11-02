import React from 'react';

const StatCard = ({
  title,
  value,
  diff,
  subtext,
  icon: Icon,
  iconColor = 'text-gray-500',
  iconBgColor = 'bg-gray-100',
}) => {
  return (
    <div className="flex items-start justify-between rounded-xl border bg-white px-3.5 py-2.5 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex flex-col">
        <h3 className="text-sm font-normal ">{title}</h3>
        <p className="mt-1 text-xl font-semibold text-gray-900">{value}</p>
        <p className="mt-1 text-xs font-normal text-emerald-600">
          {subtext || `${diff} vs last month`}
        </p>
      </div>

      <div className={`flex p-2 items-center justify-center rounded-lg ${iconBgColor}`}>
        {Icon && <Icon className={`text-md ${iconColor}`} />}
      </div>
    </div>
  );
};

export default StatCard;
