import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Share2, BookmarkPlus, Loader2, ServerCrash } from 'lucide-react';
import axios from 'axios';

// Placeholder image component (reusable)
const ImagePlaceholder = ({ src, alt, className = "", ...props }) => (
  <div className={`w-full h-full bg-gray-300 flex items-center justify-center ${className}`} {...props}>
    {/* Use img tag if src exists, otherwise show placeholder text */}
    {src ? (
        <img src={src} alt={alt} className="object-cover w-full h-full" loading="lazy"/>
    ) : (
        <span className="text-xs text-gray-500 text-center p-2">{alt} (No Image)</span>
    )}
  </div>
);

export default function NewsListPage() {
  // Add state for data, loading, error
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from backend
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      try {
        console.log(`Fetching news from: ${backendUrl}/api/news`);
        const response = await axios.get(`${backendUrl}/api/news`);
        console.log("News response data:", response.data);
        setNewsList(response.data.data || []); // Assuming data is in response.data.data
      } catch (err) {
        console.error("Error fetching news:", err);
        const errorMsg = err.response?.data?.error || err.response?.data?.message || "Failed to load news.";
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []); // Fetch once on mount

  // Keep mock handlers for now, but update ID source
  const handleBookmark = (e, newsId) => {
    e.preventDefault();
    e.stopPropagation();
    alert(`Bookmark clicked for news ID: ${newsId} (Mock)`);
  };

  const handleShare = (e, newsId) => {
    e.preventDefault();
    e.stopPropagation();
    alert(`Share clicked for news ID: ${newsId} (Mock)`);
  };

  // Add Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="ml-2 text-gray-600">Loading News...</p>
      </div>
    );
  }

  // Add Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <ServerCrash className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-red-700 mb-2">Loading Failed</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">News & Updates</h1>
        <p className="text-gray-600">Stay informed about disaster situations and community responses.</p>
      </div>

      {/* News List - Iterate over newsList state */}
      <div className="space-y-6">
        {newsList.map(news => (
          <div
            key={news._id} // Use _id
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            <Link to={`/dashboard/news/${news._id}`} className="block md:flex"> {/* Use _id in link */} 
              <div className="md:w-1/3 h-48 md:h-auto relative flex-shrink-0">
                <ImagePlaceholder
                  src={news.image || null} // Use image from backend or null
                  alt={news.title || 'News item'}
                  className="object-cover"
                />
              </div>
              <div className="p-6 md:w-2/3 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-1">{news.title || 'Untitled News'}</h2>
                  </div>
                  <div className="flex space-x-2 flex-shrink-0 ml-2">
                    <button
                      onClick={(e) => handleBookmark(e, news._id)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-150"
                      aria-label="Bookmark"
                    >
                      <BookmarkPlus className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => handleShare(e, news._id)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-150"
                      aria-label="Share"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="mb-4 flex-grow">
                  <p className="text-gray-600 text-sm line-clamp-3 md:line-clamp-2">
                    {news.content || 'No content available.'}
                  </p>
                </div>

                <div className="flex justify-between items-center text-xs text-gray-500 mt-auto">
                  <div className="flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    <span>{news.createdAt ? new Date(news.createdAt).toLocaleString() : 'Date unknown'}</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {newsList.length === 0 && !loading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center mt-6">
          <p className="text-gray-600">No news articles found.</p>
        </div>
      )}
    </div>
  );
}
