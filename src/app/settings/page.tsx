'use client';

import { useState } from 'react';
import Header from '@/components/Header';

interface NotificationSettings {
  emailNotifications: boolean;
  newReviews: boolean;
  lowRatings: boolean;
  weeklyReports: boolean;
  monthlyReports: boolean;
}

interface DisplaySettings {
  itemsPerPage: number;
  defaultSort: string;
  showRatingBreakdown: boolean;
  compactView: boolean;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    newReviews: true,
    lowRatings: true,
    weeklyReports: false,
    monthlyReports: true
  });

  const [display, setDisplay] = useState<DisplaySettings>({
    itemsPerPage: 6,
    defaultSort: 'newest',
    showRatingBreakdown: true,
    compactView: false
  });

  const [integrations, setIntegrations] = useState({
    hostawayConnected: true,
    googleReviewsConnected: false,
    airbnbConnected: false,
    bookingConnected: false
  });

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleDisplayChange = (key: keyof DisplaySettings, value: any) => {
    setDisplay(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'display', name: 'Display', icon: '🎨' },
    { id: 'integrations', name: 'Integrations', icon: '🔗' },
    { id: 'account', name: 'Account', icon: '👤' }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-white">
        <div className="relative h-64 bg-gradient-to-r from-gray-100 to-gray-50 overflow-hidden">
          <div className="absolute inset-0 bg-white bg-opacity-60"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl font-light text-gray-800 mb-4 tracking-wide">
                Settings
                <span className="block text-2xl md:text-3xl font-extralight text-gray-600 mt-2">Configuration & Preferences</span>
              </h1>
              <p className="text-lg text-gray-600 font-light">
                Customize your dashboard experience and manage integrations
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Settings Navigation */}
          <div className="lg:w-64">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-gray-100 text-gray-900 font-medium'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
              
              {/* General Settings */}
              {activeTab === 'general' && (
                <div>
                  <h2 className="text-2xl font-light text-gray-900 mb-6">General Settings</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Flex Living"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default Currency
                      </label>
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent">
                        <option value="GBP">GBP (£)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timezone
                      </label>
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent">
                        <option value="UTC">UTC</option>
                        <option value="Europe/London">London (GMT)</option>
                        <option value="Europe/Paris">Paris (CET)</option>
                        <option value="America/New_York">New York (EST)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language
                      </label>
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent">
                        <option value="en">English</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="es">Spanish</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-light text-gray-900 mb-6">Notification Preferences</h2>
                  <div className="space-y-6">
                    
                    <div className="border-b border-gray-200 pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">Email Notifications</h3>
                          <p className="text-sm text-gray-500">Receive notifications via email</p>
                        </div>
                        <button
                          onClick={() => handleNotificationChange('emailNotifications')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notifications.emailNotifications ? 'bg-gray-800' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              notifications.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="border-b border-gray-200 pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">New Reviews</h3>
                          <p className="text-sm text-gray-500">Get notified when new reviews are submitted</p>
                        </div>
                        <button
                          onClick={() => handleNotificationChange('newReviews')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notifications.newReviews ? 'bg-gray-800' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              notifications.newReviews ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="border-b border-gray-200 pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">Low Ratings Alert</h3>
                          <p className="text-sm text-gray-500">Get notified when reviews have ratings below 3 stars</p>
                        </div>
                        <button
                          onClick={() => handleNotificationChange('lowRatings')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notifications.lowRatings ? 'bg-gray-800' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              notifications.lowRatings ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="border-b border-gray-200 pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">Weekly Reports</h3>
                          <p className="text-sm text-gray-500">Receive weekly performance summaries</p>
                        </div>
                        <button
                          onClick={() => handleNotificationChange('weeklyReports')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notifications.weeklyReports ? 'bg-gray-800' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              notifications.weeklyReports ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">Monthly Reports</h3>
                          <p className="text-sm text-gray-500">Receive monthly analytics reports</p>
                        </div>
                        <button
                          onClick={() => handleNotificationChange('monthlyReports')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            notifications.monthlyReports ? 'bg-gray-800' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              notifications.monthlyReports ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Display Settings */}
              {activeTab === 'display' && (
                <div>
                  <h2 className="text-2xl font-light text-gray-900 mb-6">Display Preferences</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Items per Page
                      </label>
                      <select
                        value={display.itemsPerPage}
                        onChange={(e) => handleDisplayChange('itemsPerPage', parseInt(e.target.value))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                      >
                        <option value={6}>6 items</option>
                        <option value={12}>12 items</option>
                        <option value={24}>24 items</option>
                        <option value={50}>50 items</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default Sort Order
                      </label>
                      <select
                        value={display.defaultSort}
                        onChange={(e) => handleDisplayChange('defaultSort', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="highest-rating">Highest Rating</option>
                        <option value="lowest-rating">Lowest Rating</option>
                      </select>
                    </div>
                    
                    <div className="border-b border-gray-200 pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">Show Rating Breakdown</h3>
                          <p className="text-sm text-gray-500">Display detailed rating categories in reviews</p>
                        </div>
                        <button
                          onClick={() => handleDisplayChange('showRatingBreakdown', !display.showRatingBreakdown)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            display.showRatingBreakdown ? 'bg-gray-800' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              display.showRatingBreakdown ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">Compact View</h3>
                          <p className="text-sm text-gray-500">Use a more condensed layout for reviews</p>
                        </div>
                        <button
                          onClick={() => handleDisplayChange('compactView', !display.compactView)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            display.compactView ? 'bg-gray-800' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              display.compactView ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Integrations */}
              {activeTab === 'integrations' && (
                <div>
                  <h2 className="text-2xl font-light text-gray-900 mb-6">Third-party Integrations</h2>
                  <div className="space-y-6">
                    
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 font-bold text-lg">H</span>
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">Hostaway</h3>
                            <p className="text-sm text-gray-500">Property management and review sync</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            integrations.hostawayConnected 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {integrations.hostawayConnected ? 'Connected' : 'Disconnected'}
                          </span>
                          <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                            Configure
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <span className="text-red-600 font-bold text-lg">G</span>
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">Google Reviews</h3>
                            <p className="text-sm text-gray-500">Sync reviews from Google My Business</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            Available
                          </span>
                          <button className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900">
                            Connect
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6 opacity-60">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                            <span className="text-pink-600 font-bold text-lg">A</span>
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">Airbnb</h3>
                            <p className="text-sm text-gray-500">Sync reviews from Airbnb listings</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            Coming Soon
                          </span>
                          <button disabled className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-400 cursor-not-allowed">
                            Connect
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6 opacity-60">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 font-bold text-lg">B</span>
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">Booking.com</h3>
                            <p className="text-sm text-gray-500">Sync reviews from Booking.com</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            Coming Soon
                          </span>
                          <button disabled className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-400 cursor-not-allowed">
                            Connect
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Account Settings */}
              {activeTab === 'account' && (
                <div>
                  <h2 className="text-2xl font-light text-gray-900 mb-6">Account Settings</h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          defaultValue="Admin"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          defaultValue="Manager"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        defaultValue="admin@flexliving.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role
                      </label>
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-transparent">
                        <option value="admin">Administrator</option>
                        <option value="manager">Property Manager</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Security</h3>
                      <div className="space-y-4">
                        <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">Change Password</h4>
                              <p className="text-sm text-gray-500">Update your account password</p>
                            </div>
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </button>
                        
                        <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                              <p className="text-sm text-gray-500">Add an extra layer of security</p>
                            </div>
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">Disabled</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-end space-x-3">
                  <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
