import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  Clock, 
  Calendar,
  Share2, 
  MessageSquare, 
  ThumbsUp, 
  Bookmark,
  User,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import api from '../utils/api';
import { format, parseISO } from 'date-fns';

// Placeholder image component (reusable)
const ImagePlaceholder = ({ src, alt, className = "", priority = false, ...props }) => ( // Added priority prop (ignored for now)
    <div className={`w-full h-full bg-gray-300 flex items-center justify-center ${className}`} {...props}>
        <img src={src} alt={alt} className="object-cover w-full h-full" loading={priority ? "eager" : "lazy"}/>
    </div>
);

export default function NewsDetailPage() {
  const { newsId } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    fetchNewsArticle();
  }, [newsId]);
  
  const fetchNewsArticle = async () => {
    try {
      setLoading(true);
      setError(false);
      
      const response = await api.get(`/news/${newsId}`);
      console.log('News article fetched:', response.data);
      
      if (response.data && response.data.data) {
        setArticle(response.data.data);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('Error fetching news article:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };
  
  // Format date for display
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
  
  // Calculate read time (approximately 200 words per minute)
  const calculateReadTime = (content) => {
    if (!content) return '1 min read';
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };
  
  // Action handlers
  const handleLike = () => {
    console.log('Like article:', newsId);
    // Implement like functionality
  };
  
  const handleComment = () => {
    console.log('Comment on article:', newsId);
    // Implement comment functionality
  };
  
  const handleBookmark = () => {
    console.log('Bookmark article:', newsId);
    // Implement bookmark functionality
  };
  
  const handleShare = () => {
    console.log('Share article:', newsId);
    // Implement share functionality - could use navigator.share() API
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }
  
  if (error || !article) {
    return (
      <div className="max-w-3xl mx-auto p-4 text-center py-12 bg-white rounded-lg shadow border border-gray-200">
        <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Article Not Found</h1>
        <p className="text-gray-600 mb-6">We couldn't find the article you're looking for. It may have been removed or you might have followed a broken link.</p>
        <Link
          to="/dashboard/news"
          className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to News
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Back button */}
      <Link
        to="/dashboard/news"
        className="inline-flex items-center mb-6 text-blue-600 hover:text-blue-800 transition-colors"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to News
      </Link>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        {/* Article header */}
        <div className="p-6 border-b border-gray-100">
          <div className="mb-4">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-blue-600 rounded-full shadow-sm">
              {article.category || 'News'}
            </span>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>
          
          <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span>{article.author || 'CDRP Team'}</span>
            </div>
            
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{formatDate(article.createdAt)}</span>
            </div>
            
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{calculateReadTime(article.content)}</span>
            </div>
          </div>
        </div>
        
        {/* Article image */}
        {article.image && (
          <div className="w-full h-80 md:h-96 bg-gray-100 border-b border-gray-100">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {/* Article content */}
        <div className="p-6 md:p-8 prose max-w-none prose-blue prose-img:rounded-md prose-headings:text-gray-900">
          <div className="whitespace-pre-line text-gray-700">
            {article.content}
          </div>
          
          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Related Topics</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
          <div className="flex space-x-2">
            <button
              onClick={handleLike}
              className="inline-flex items-center px-3 py-1.5 text-sm rounded-md bg-white shadow-sm border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-600 transition-colors"
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              <span>Like</span>
            </button>
            
            <button
              onClick={handleComment}
              className="inline-flex items-center px-3 py-1.5 text-sm rounded-md bg-white shadow-sm border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-600 transition-colors"
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              <span>Comment</span>
            </button>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleBookmark}
              className="inline-flex items-center px-3 py-1.5 text-sm rounded-md bg-white shadow-sm border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-600 transition-colors"
            >
              <Bookmark className="h-4 w-4 mr-1" />
              <span>Save</span>
            </button>
            
            <button
              onClick={handleShare}
              className="inline-flex items-center px-3 py-1.5 text-sm rounded-md bg-white shadow-sm border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-600 transition-colors"
            >
              <Share2 className="h-4 w-4 mr-1" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
