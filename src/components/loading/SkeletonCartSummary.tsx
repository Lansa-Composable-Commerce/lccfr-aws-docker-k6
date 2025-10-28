export default function SkeletonCartSummary() {
  return (
    <div className="w-full rounded-lg border border-gray-200 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
      <div className="flex gap-4 animate-pulse">
        <div className="w-20 h-20 bg-gray-300 rounded-md"></div>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center md:w-full gap-4">
          <div className="w-full space-y-4">
            <div className="w-full h-4 bg-gray-300 rounded-md"></div>
          </div>
          <div className="flex items-center justify-between gap-2 md:w-full md:px-6">
            <div className="w-16 h-8 bg-gray-300 rounded-md"></div>
            <div className="w-20 h-4 bg-gray-300 rounded-md"></div>
            <div className="w-20 h-4 bg-gray-300 rounded-md"></div>
            <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
