import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Share2, ThumbsUp, MessageSquare, Bookmark, Clock } from 'lucide-react';

// Mock data (Same as Next.js version, ensure 'id' matches)
const mockNewsArticles = [
  { id: 1, title: "Emergency Response Teams Deployed...", content: `<p>Local emergency response teams...</p><h3>How to Help</h3>...<ul><li>Water...</li></ul>`, author: "Ethiopian News Agency (ENA)", date: "July 15, 2024", readTime: "4 min read", category: "Updates", image: "https://images.unsplash.com/photo-1606989054596-ee351262a6be?...", likes: 152, comments: 18, relatedTags: ["Flooding", "Gambella", "Emergency Response", "NDRMC"] },
  { id: 2, title: "Donation Center Opens in Addis...", content: `<p>A new donation collection center...</p><h3>Donation Center Information</h3>...`, author: "Addis Ababa City Administration", date: "July 14, 2024", readTime: "3 min read", category: "Community", image: "https://images.unsplash.com/photo-1606989054596-ee351262a6be?...", likes: 210, comments: 25, relatedTags: ["Drought", "Donations", "Addis Ababa", "NDRMC"] },
  // Add other articles corresponding to IDs 3, 4, 5 from the list page if needed
]; // Simplified content, use full HTML content from original mock data

// Placeholder image component (reusable)
const ImagePlaceholder = ({ src, alt, className = "", priority = false, ...props }) => ( // Added priority prop (ignored for now)
    <div className={`w-full h-full bg-gray-300 flex items-center justify-center ${className}`} {...props}>
        <img src={src} alt={alt} className="object-cover w-full h-full" loading={priority ? "eager" : "lazy"}/>
    </div>
);

export default function NewsDetailPage() {
  const { newsId } = useParams(); // Get ID from URL params
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false); // Basic error state
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    // Simulate API fetch
    const timer = setTimeout(() => {
      const idToFind = parseInt(newsId); // Ensure ID is a number
      const foundArticle = mockNewsArticles.find(a => a.id === idToFind);
      if (foundArticle) {
        setArticle(foundArticle);
      } else {
        setError(true); // Set error if article not found
      }
      setLoading(false);
    }, 300); // Simulate network delay

    return () => clearTimeout(timer); // Cleanup timer on unmount

  }, [newsId]); // Re-run effect if newsId changes

   // Basic loading state - could be replaced with a dedicated component
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        {/* Simple spinner - matches the loading.js style somewhat */}
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  // Basic error state - could be replaced with a dedicated component
  if (error || !article) {
    return (
      <div className="text-center py-12 max-w-lg mx-auto bg-white p-8 rounded-lg shadow border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Article Not Found</h1>
        <p className="text-gray-600 mb-6">The news article you're looking for doesn't exist or has been removed.</p>
        <Link
          to="/dashboard/news"
          className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to News
        </Link>
      </div>
    );
  }

  // Mock action handlers
  const handleLike = () => setLiked(!liked);
  const handleBookmark = () => setBookmarked(!bookmarked);
  const handleShare = () => alert(`Share clicked for article ID: ${article.id} (Mock)`);
  const handleCommentClick = () => alert(`Comment button clicked for article ID: ${article.id} (Mock - implement comment section)`);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Link */}
      <button onClick={() => navigate(-1)} className="inline-flex items-center text-blue-600 mb-6 hover:underline focus:outline-none">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back
      </button>

      <article className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        {/* Article Header Image */}
        <div className="relative">
           {/* Optional overlay */}
           {/* <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/50 to-transparent z-10"></div> */}
           <div className="h-56 md:h-72 w-full relative overflow-hidden">
            <ImagePlaceholder
              src={article.image}
              alt={article.title}
              className="object-cover"
              priority={true} // Hint for eager loading
            />
          </div>
          <div className="absolute top-4 left-4 z-20">
            <span className="bg-blue-600 text-xs text-white font-semibold px-3 py-1 rounded-full shadow">
              {article.category}
            </span>
          </div>
        </div>

        {/* Article Content Container */}
        <div className="px-6 py-6 md:px-10 md:py-8">
          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">{article.title}</h1>

          {/* Meta information */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6 text-sm text-gray-600">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1.5 text-gray-500" />
              {article.author}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1.5 text-gray-500" />
              {article.date}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1.5 text-gray-500" />
              {article.readTime}
            </div>
          </div>

          {/* Article Content (Using dangerouslySetInnerHTML for mock HTML) */}
          {/* Add specific Tailwind typography plugin if needed for better styling of raw HTML */}
          <div
            className="prose prose-blue max-w-none text-gray-700 leading-relaxed" // Using Tailwind prose for basic HTML styling
            dangerouslySetInnerHTML={{ __html: article.content }} // WARNING: Only use with trusted HTML sources
          />

          {/* Tags */}
          {article.relatedTags && article.relatedTags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Related Tags</h3>
              <div className="flex flex-wrap gap-2">
                {article.relatedTags.map((tag, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-gray-200 cursor-pointer transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="px-6 py-4 md:px-10 bg-gray-50 border-t border-gray-200 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm transition-colors duration-150 ${
                liked
                  ? 'text-blue-600 border-blue-200 bg-blue-50 font-medium'
                  : 'text-gray-600 border-gray-300 hover:bg-gray-100'
              }`}
              aria-pressed={liked}
            >
              <ThumbsUp className={`h-4 w-4 transition-colors duration-150 ${liked ? 'fill-current' : ''}`} />
              <span>{article.likes + (liked ? 1 : 0)}</span>
            </button>

            <button
              onClick={handleCommentClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm text-gray-600 border-gray-300 hover:bg-gray-100 transition-colors duration-150"
            >
              <MessageSquare className="h-4 w-4" />
              <span>{article.comments}</span>
            </button>

            <button
              onClick={handleBookmark}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm transition-colors duration-150 ${
                bookmarked
                  ? 'text-blue-600 border-blue-200 bg-blue-50 font-medium'
                  : 'text-gray-600 border-gray-300 hover:bg-gray-100'
              }`}
               aria-pressed={bookmarked}
            >
              <Bookmark className={`h-4 w-4 transition-colors duration-150 ${bookmarked ? 'fill-current' : ''}`} />
              <span>{bookmarked ? 'Saved' : 'Save'}</span>
            </button>
          </div>

          <button
             onClick={handleShare}
             className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm text-gray-600 border-gray-300 hover:bg-gray-100 transition-colors duration-150"
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>
        </div>
      </article>
    </div>
  );
}
