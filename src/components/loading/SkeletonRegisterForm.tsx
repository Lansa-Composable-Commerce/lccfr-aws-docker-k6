export default function SkeletonRegisterForm() {
  return (
    <div>
      <div className="grid md:grid-cols-2 gap-10">
        <div className="flex flex-col gap-y-6">
          <div className="h-8 w-1/4 bg-gray-300 animate-pulse rounded-md"></div>
          {Array(6)
            .fill(null)
            .map((_, idx) => (
              <div key={idx} className="w-full flex flex-col gap-2">
                <div className="h-4 w-2/6 bg-gray-300 animate-pulse rounded-md"></div>
                <div className="h-14 bg-gray-300 animate-pulse rounded-md"></div>
              </div>
            ))}
        </div>

        <div className="flex flex-col gap-y-6">
          <div className="h-8 w-1/4 bg-gray-300 animate-pulse rounded-md"></div>
          {Array(6)
            .fill(null)
            .map((_, idx) => (
              <div key={idx} className="w-full flex flex-col gap-2">
                <div className="h-4 w-2/6 bg-gray-300 animate-pulse rounded-md"></div>
                <div className="h-14 bg-gray-300 animate-pulse rounded-md"></div>
              </div>
            ))}
        </div>
      </div>
      <div className="mt-14 mx-auto w-full sm:w-1/2 xl:w-1/3">
        <div className="h-16 bg-gray-300 animate-pulse rounded-lg"></div>
      </div>
    </div>
  );
}
