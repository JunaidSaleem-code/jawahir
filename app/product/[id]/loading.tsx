export default function ProductLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid lg:grid-cols-2 gap-12 animate-pulse">
        <div className="h-[32rem] bg-gray-200 rounded-2xl" />
        <div>
          <div className="h-8 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded mt-4 w-1/2" />
          <div className="h-6 bg-gray-200 rounded mt-8 w-1/3" />
          <div className="h-10 bg-gray-200 rounded mt-8 w-1/2" />
        </div>
      </div>
    </div>
  );
}


