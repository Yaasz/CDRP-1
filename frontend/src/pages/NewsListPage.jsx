import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ChevronRight, Radio, User, Search, Filter, XCircle } from 'lucide-react';
import api from '../utils/api';
import { format, parseISO } from 'date-fns';

// Placeholder image component (reusable)
const ImagePlaceholder = ({ src, alt, className = "", ...props }) => (
  <div className={`w-full h-full bg-gray-300 flex items-center justify-center ${className}`} {...props}>
    <img src={src} alt={alt} className="object-cover w-full h-full" />
  </div>
);

export default function NewsListPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [newsArticles, setNewsArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(false);
      
      const response = await api.get('/news');
      console.log('News data fetched:', response.data);
      
      if (response.data && response.data.data) {
        setNewsArticles(response.data.data);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Format date from ISO string
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return format(parseISO(dateString), 'MMMM d, yyyy');
    } catch (error) {
      try {
        return new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch (innerError) {
        return 'Unknown date';
      }
    }
  };

  // Filter news by search query and category
  const filteredNews = newsArticles.filter(news => {
    const matchesSearch = 
      searchQuery === '' || 
      news.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      news.content?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'All' || 
      news.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Unique categories from news data
  const categories = ['All', ...new Set(newsArticles.map(news => news.category).filter(Boolean))];

  // Calculate read time (approximately 200 words per minute)
  const calculateReadTime = (content) => {
    if (!content) return '1 min read';
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 max-w-lg mx-auto bg-white p-8 rounded-lg shadow border border-gray-200">
        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Unable to Load News</h1>
        <p className="text-gray-600 mb-6">We're having trouble loading the news feed. Please try again later.</p>
        <button
          onClick={fetchNews}
          className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">News & Announcements</h1>
        <p className="text-gray-600">Stay updated with the latest news related to disasters and response efforts</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 mb-6 rounded-lg shadow border border-gray-200 flex flex-wrap gap-4">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[250px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search news..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          <select
            className="block w-full pl-10 pr-8 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
            {category}
              </option>
        ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ChevronRight className="h-5 w-5 text-gray-400 transform rotate-90" />
          </div>
        </div>
      </div>

      {/* News Grid */}
      {filteredNews.length === 0 ? (
        <div className="text-center py-12 bg-white p-6 rounded-lg shadow border border-gray-200">
          <Radio className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No News Found</h2>
          <p className="text-gray-600">
            {searchQuery || selectedCategory !== 'All' 
              ? "No news articles match your search criteria. Try adjusting your filters." 
              : "There are no news articles available at this time. Check back later for updates."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((news) => (
            <Link 
              key={news._id} 
              to={`/dashboard/news/${news._id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow flex flex-col h-full"
            >
              {/* News Item Image */}
              <div className="relative h-48">
                <ImagePlaceholder
                  src={news.image}
                  alt={news.title}
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-xs text-white font-semibold px-3 py-1 rounded-full shadow">
                    {news.category || 'News'}
                  </span>
                </div>
              </div>

              {/* News Item Content */}
              <div className="p-5 flex-1 flex flex-col">
                <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{news.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {news.content}
                </p>
                
                {/* Meta Footer */}
                <div className="mt-auto pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center mb-2 sm:mb-0">
                    <User className="h-4 w-4 mr-1" />
                    <span>{news.author || 'CDRP Team'}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{formatDate(news.createdAt)}</span>
                  </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{calculateReadTime(news.content)}</span>
                </div>
                  </div>
                </div>
              </div>
            </Link>
        ))}
        </div>
      )}
    </div>
  );
}
