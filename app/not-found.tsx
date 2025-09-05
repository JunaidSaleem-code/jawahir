export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-6">
      <div>
        <h1 className="text-5xl font-playfair font-bold text-charcoal">404</h1>
        <p className="text-gray-600 mt-2">We couldn't find that page.</p>
        <a href="/" className="mt-6 inline-block text-gold hover:underline">Go back home</a>
      </div>
    </div>
  );
}


