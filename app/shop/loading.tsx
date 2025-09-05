export default function ShopLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-80 bg-gray-200 rounded-2xl" />
            <div className="h-4 bg-gray-200 rounded mt-4 w-2/3" />
            <div className="h-4 bg-gray-200 rounded mt-2 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}


