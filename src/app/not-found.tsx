import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ps5-void flex flex-col items-center justify-center px-4 text-center">
      {/* Glowing 404 */}
      <div className="relative mb-8">
        <h1 className="font-display font-black text-[120px] sm:text-[180px] leading-none text-ps5-surface select-none">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="font-display font-black text-[120px] sm:text-[180px] leading-none text-transparent bg-clip-text bg-gradient-to-b from-ps5-blue to-transparent select-none">
            404
          </h1>
        </div>
      </div>

      <div className="mb-2">
        <span className="inline-block px-4 py-1.5 bg-ps5-blue/10 border border-ps5-blue/30 rounded-full text-ps5-blue text-sm font-semibold mb-4">
          Page Not Found
        </span>
      </div>

      <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mb-3">
        Looks like this level doesn't exist
      </h2>
      <p className="text-ps5-text-secondary text-sm max-w-sm mb-8">
        The page you're looking for has been moved, deleted, or never existed. Let's get you back to the game.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 px-6 py-3 bg-ps5-blue hover:bg-ps5-blue-light text-white font-bold rounded-xl transition-all shadow-ps5-blue"
        >
          <Home size={18} />
          Back to Home
        </Link>
        <Link
          href="/search"
          className="flex items-center gap-2 px-6 py-3 bg-ps5-surface border border-ps5-border hover:border-ps5-blue/50 text-ps5-text-secondary hover:text-white font-semibold rounded-xl transition-all"
        >
          <Search size={18} />
          Search Trailers
        </Link>
      </div>
    </div>
  );
}
