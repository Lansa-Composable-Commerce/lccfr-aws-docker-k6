export default function SkeletonOrderSummary() {
  return (
    <div className="flex flex-col gap-4 border border-gray-200 rounded-2xl p-6 animate-pulse">
      <div className="w-3/4 h-6 bg-gray-300 rounded-md"></div>
      <div className="flex justify-between items-center border-b pb-2">
        <div className="w-1/4 h-4 bg-gray-300 rounded-md"></div>
        <div className="w-1/4 h-4 bg-gray-300 rounded-md"></div>
      </div>
      <div className="flex justify-between items-center border-b pb-2">
        <div className="w-1/4 h-4 bg-gray-300 rounded-md"></div>
        <div className="w-1/4 h-4 bg-gray-300 rounded-md"></div>
      </div>
      <div className="flex justify-between items-center">
        <div className="w-1/4 h-6 bg-gray-300 rounded-md"></div>
        <div className="w-1/4 h-6 bg-gray-300 rounded-md"></div>
      </div>
      <div className="w-full h-12 bg-gray-300 rounded-md mt-4"></div>
      <div className="w-1/3 h-4 bg-gray-300 rounded-md mt-4"></div>
    </div>
  );
}
