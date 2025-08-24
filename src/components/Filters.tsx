interface FiltersProps {
  selectedProperty: string;
  setSelectedProperty: (property: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  ratingFilter: number;
  setRatingFilter: (rating: number) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  dateRange: { start: string; end: string };
  setDateRange: (range: { start: string; end: string }) => void;
  properties: string[];
  channelFilter?: string;
  setChannelFilter?: (channel: string) => void;
  channels?: string[];
}

export default function Filters({
  selectedProperty,
  setSelectedProperty,
  statusFilter,
  setStatusFilter,
  ratingFilter,
  setRatingFilter,
  sortBy,
  setSortBy,
  searchTerm,
  setSearchTerm,
  dateRange,
  setDateRange,
  properties,
  channelFilter = '',
  setChannelFilter,
  channels = [],
}: FiltersProps) {
  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search reviews..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 transition-all"
        />
      </div>

      {/* Filter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        
        {/* Property Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Property</label>
          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-300 focus:border-gray-300 bg-white text-gray-900 text-sm transition-all"
          >
            <option value="">All Properties</option>
            {properties.map((property) => (
              <option key={property} value={property}>{property}</option>
            ))}
          </select>
        </div>

        {/* Channel Filter */}
        {setChannelFilter && channels.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Channel</label>
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-300 focus:border-gray-300 bg-white text-gray-900 text-sm transition-all"
            >
              <option value="">All Channels</option>
              {channels.map((channel) => (
                <option key={channel} value={channel}>{channel}</option>
              ))}
            </select>
          </div>
        )}

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-300 focus:border-gray-300 bg-white text-gray-900 text-sm transition-all"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="denied">Denied</option>
          </select>
        </div>

        {/* Rating Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Min Rating</label>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-300 focus:border-gray-300 bg-white text-gray-900 text-sm transition-all"
          >
            <option value={0}>All Ratings</option>
            <option value={1}>1+ Stars</option>
            <option value={2}>2+ Stars</option>
            <option value={3}>3+ Stars</option>
            <option value={4}>4+ Stars</option>
            <option value={5}>5 Stars</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-300 focus:border-gray-300 bg-white text-gray-900 text-sm transition-all"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest-rating">Highest Rating</option>
            <option value="lowest-rating">Lowest Rating</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        <div className="flex items-end">
          <button
            onClick={() => {
              setSelectedProperty('');
              setStatusFilter('all');
              setRatingFilter(0);
              setSortBy('newest');
              setSearchTerm('');
              setDateRange({ start: '', end: '' });
            }}
            className="w-full px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 font-medium transition-all flex items-center justify-center text-sm"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Clear All
          </button>
        </div>
      </div>

      {/* Date Range Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-300 focus:border-gray-300 bg-white text-gray-900 text-sm transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-300 focus:border-gray-300 bg-white text-gray-900 text-sm transition-all"
          />
        </div>
      </div>
    </div>
  );
}
