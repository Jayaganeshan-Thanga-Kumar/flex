import Link from 'next/link';

export default function Header() {
  return (
  <header className="bg-[#284E4C] border-b border-gray-100 sticky top-0 z-50 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="flex items-center">
                <svg className="w-8 h-8 text-gray-800 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 21l4-4 4 4" />
                </svg>
                <h1 className="text-2xl font-light text-white tracking-wide">
                  the flex<span className="text-gray-400">.</span>
                </h1>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-white hover:text-gray-200 px-3 py-2 text-sm font-normal transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              href="/properties" 
              className="text-white hover:text-gray-200 px-3 py-2 text-sm font-normal transition-colors"
            >
              Properties
            </Link>
            <Link 
              href="/analytics" 
              className="text-white hover:text-gray-200 px-3 py-2 text-sm font-normal transition-colors"
            >
              Analytics
            </Link>
            <Link 
              href="/settings" 
              className="text-white hover:text-gray-200 px-3 py-2 text-sm font-normal transition-colors"
            >
              Settings
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Profile */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">AM</span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-white">Admin</p>
              </div>
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
