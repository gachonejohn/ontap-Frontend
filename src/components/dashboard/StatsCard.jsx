export default function StatCard({ title, value, change, icon: Icon, iconBg, iconColor }) {
  return (
    <div className="flex flex-col justify-between p-4 rounded-xl h-[120px] shadow-lg bg-white transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <div className="text-sm text-gray-600 font-medium">{title}</div>
          <div className="mt-2 text-lg text-neutral-900 font-semibold">{value}</div>
          <div className="mt-1 text-xs text-gray-600 font-normal">{change}</div>
        </div>

        <div className={`flex items-center justify-center p-1 rounded-2xl h-8 w-8 ${iconBg} shadow-sm`}>
          {Icon && <Icon className={`h-6 w-6 ${iconColor}`} />} {/* bigger icon */}
        </div>
      </div>
    </div>
  );
}
