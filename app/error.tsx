'use client';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center text-center px-6">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-charcoal">Something went wrong</h1>
            <p className="text-gray-600 mt-2">{error.message}</p>
            <button onClick={reset} className="mt-6 text-gold hover:underline">Try again</button>
          </div>
        </div>
      </body>
    </html>
  );
}


