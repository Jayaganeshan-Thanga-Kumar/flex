# Flex Living Reviews Dashboard

A comprehensive reviews management system for Flex Living properties, enabling managers to assess property performance through guest reviews and manage public review displays.

## 🚀 Features

### Manager Dashboard
- **Review Management**: Approve, deny, or keep reviews pending
- **Advanced Filtering**: Filter by property, status, rating, date range, and search terms
- **Performance Analytics**: View total reviews, approval rates, and average ratings
- **Property-specific Views**: Filter reviews by individual properties
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Property Display Pages
- **Public Review Display**: Shows only approved reviews to potential guests
- **Rating Breakdown**: Visual representation of rating distribution
- **Flex Living Branding**: Consistent with Flex Living's design aesthetic
- **Property Details**: Mock property information and booking interface

### API Integration
- **Hostaway Integration**: Fetches and normalizes review data from Hostaway API
- **Data Normalization**: Converts various rating scales to standardized 5-star system
- **Review Filtering**: Processes only guest-to-host reviews for display

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **API**: Next.js API Routes
- **Data Handling**: TypeScript interfaces for type safety

## 📦 Installation & Setup

1. **Clone the repository**
```bash
git clone [repository-url]
cd flex-reviews
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open in browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 API Endpoints

### GET `/api/reviews/hostaway`
Fetches and normalizes review data from Hostaway API.

**Response Format:**
```json
[
  {
    "id": "string",
    "author": "string",
    "rating": number,
    "content": "string",
    "date": "YYYY-MM-DD",
    "status": "approved" | "pending" | "denied",
    "listingName": "string"
  }
]
```

**Features:**
- Filters for guest-to-host reviews only
- Normalizes ratings to 5-star scale
- Converts category ratings to overall rating when needed
- Sets initial status to 'pending' for manager review

## 🏗 Architecture Decisions

### Component Structure
- **Modular Design**: Separate components for filters, review cards, and headers
- **State Management**: React hooks for local state management
- **Type Safety**: TypeScript interfaces ensure data consistency

### Data Flow
1. **API Layer**: Hostaway integration handles data fetching and normalization
2. **State Management**: Dashboard maintains review state and filter preferences
3. **UI Updates**: Real-time updates when managers approve/deny reviews

### Styling Approach
- **Tailwind CSS**: Utility-first CSS for rapid development
- **Responsive Design**: Mobile-first approach with responsive breakpoints
- **Design System**: Consistent color palette and spacing

### Review Status Workflow
```
Hostaway API → Normalized Data → Pending Status → Manager Review → Approved/Denied → Public Display
```

## 📊 Dashboard Features

### Statistics Cards
- **Total Reviews**: Count of all reviews in system
- **Approved Reviews**: Count of publicly visible reviews
- **Pending Reviews**: Count of reviews awaiting manager decision
- **Average Rating**: Overall rating across all approved reviews

### Filtering System
- **Property Filter**: View reviews for specific properties
- **Status Filter**: Filter by approval status
- **Rating Filter**: Show reviews above minimum rating threshold
- **Date Range**: Filter reviews by submission date
- **Search**: Full-text search across review content and author names
- **Sort Options**: Sort by date (newest/oldest) or rating (highest/lowest)

### Review Management
- **Bulk Actions**: Efficient review processing workflow
- **Quick Actions**: One-click approve/deny buttons
- **Review Preview**: Full review content and metadata display
- **Property Linking**: Direct navigation to property pages

## 🔗 Property Pages

Property pages are accessible via `/properties/[propertyName]` and include:
- **Hero Section**: Property branding and key metrics
- **Review Statistics**: Average rating and rating breakdown
- **Individual Reviews**: Detailed approved review display
- **Booking Interface**: Mock booking form and property amenities

## 🔍 Google Reviews Integration

See [GOOGLE_REVIEWS_RESEARCH.md](./GOOGLE_REVIEWS_RESEARCH.md) for detailed research on Google Reviews API integration feasibility and implementation approach.

**Status**: Research completed ✅  
**Feasibility**: Confirmed viable ✅  
**Implementation**: Ready for development phase

## 🚧 Future Enhancements

- **Trends Analysis**: Identify recurring themes in reviews
- **Sentiment Analysis**: Automated review sentiment scoring
- **Response Management**: Manager response to guest reviews
- **Multi-channel Integration**: Additional review sources beyond Hostaway
- **Advanced Analytics**: Performance trends and insights dashboard

## 📝 Development Notes

- **Mock Data**: Currently uses mock data for demonstration
- **API Integration**: Hostaway API structure implemented but mocked for development
- **Responsive Design**: Fully responsive across all device sizes
- **Performance**: Optimized with pagination and efficient filtering

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
