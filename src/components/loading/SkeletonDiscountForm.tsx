export default function SkeletonDiscountForm() {
  return (
    <div className="w-full flex flex-col border border-gray-200 rounded-2xl p-6 animate-pulse">
      <div className="w-3/4 h-6 bg-gray-300 rounded-md mb-4"></div>
      <div className="flex flex-col w-full gap-4 mb-1 md:flex-row">
        <div className="w-full flex flex-col gap-1">
          <div className="w-full h-10 bg-gray-300 rounded-md mb-2"></div>
        </div>
        <div className="w-full h-10 bg-gray-300 rounded-md"></div>
      </div>
    </div>
  );
}
