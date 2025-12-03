

export default function StatutoryCard({
  title,
  amount,
  subtitle,
  bgColor,
  textColor,
}) {
  return (
    <div className={`${bgColor} rounded-lg p-6 shadow-sm`}>
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        <p className={`text-2xl font-bold ${textColor}`}>{amount}</p>
        <p className="text-xs text-gray-600">{subtitle}</p>
      </div>
    </div>
  );
}

