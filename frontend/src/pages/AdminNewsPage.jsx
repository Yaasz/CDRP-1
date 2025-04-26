import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  FileImage, 
  X, 
  Plus,
  Loader2,
  AlertTriangle,
  Trash2,
  Edit,
  Eye,
} from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function AdminNewsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentNewsId, setCurrentNewsId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  useEffect(() => {
    if (user && user.role !== 'admin' && user.accountType !== 'admin') {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  useEffect(() => {
    fetchNewsList();
  }, []);
  
  const fetchNewsList = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/news');
      
      if (response.data && response.data.data) {
        setNewsList(response.data.data);
      } else {
        setError('Failed to load news articles.');
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('An error occurred while loading news articles.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!formData.content.trim()) {
      errors.content = 'Content is required';
    }
    
    if (!file && isCreating) {
      errors.image = 'Image is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitting(true);
      
      const newsFormData = new FormData();
      newsFormData.append('title', formData.title);
      newsFormData.append('content', formData.content);
      
      if (file) {
        newsFormData.append('image', file);
      }
      
      if (isEditing && currentNewsId) {
        await api.put(`/news/${currentNewsId}`, newsFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await api.post('/news', newsFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      
      resetForm();
      
      fetchNewsList();
      
    } catch (err) {
      console.error('Error saving news:', err);
      setError(`An error occurred while ${isEditing ? 'updating' : 'creating'} the news article.`);
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleEdit = async (newsId) => {
    try {
      setLoading(true);
      const response = await api.get(`/news/${newsId}`);
      
      if (response.data && response.data.data) {
        const newsItem = response.data.data;
        
        setFormData({
          title: newsItem.title || '',
          content: newsItem.content || '',
        });
        
        if (newsItem.image) {
          setPreviewImage(newsItem.image);
        }
        
        setCurrentNewsId(newsId);
        setIsEditing(true);
        setIsCreating(false);
      }
    } catch (err) {
      console.error('Error fetching news details:', err);
      setError('An error occurred while loading the news article for editing.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (newsId) => {
    if (!window.confirm('Are you sure you want to delete this news article?')) {
      return;
    }
    
    try {
      setLoading(true);
      await api.delete(`/news/${newsId}`);
      
      fetchNewsList();
    } catch (err) {
      console.error('Error deleting news:', err);
      setError('An error occurred while deleting the news article.');
    } finally {
      setLoading(false);
    }
  };
  
  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
    });
    setFile(null);
    setPreviewImage(null);
    setIsCreating(false);
    setIsEditing(false);
    setCurrentNewsId(null);
    setFormErrors({});
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  if (loading && !isCreating && !isEditing) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <Link
        to="/dashboard"
        className="inline-flex items-center mb-6 text-blue-600 hover:text-blue-800 transition-colors"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Dashboard
      </Link>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900">Manage News Articles</h1>
          <p className="text-gray-600 mt-2">Create, edit, and delete news articles</p>
        </div>
        
        {error && (
          <div className="p-4 bg-red-50 text-red-700 flex items-start border-b border-red-100">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}
        
        {(isCreating || isEditing) ? (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {isEditing ? 'Edit Article' : 'Create New Article'}
              </h2>
              <button 
                onClick={resetForm}
                className="inline-flex items-center text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title*
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${formErrors.title ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Article title"
                />
                {formErrors.title && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Content*
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={6}
                  className={`w-full px-3 py-2 border ${formErrors.content ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Write the article content here..."
                ></textarea>
                {formErrors.content && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.content}</p>
                )}
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Article Image{!isEditing && '*'} {isEditing && '(Leave empty to keep current image)'}
                </label>
                
                <div className="flex items-center space-x-4">
                  <div 
                    className={`border-2 border-dashed ${formErrors.image ? 'border-red-400' : 'border-gray-300'} rounded-lg p-4 w-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors`}
                    onClick={() => document.getElementById('image-upload').click()}
                  >
                    <FileImage className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Click to select an image</p>
                    <input
                      type="file"
                      id="image-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                  
                  {previewImage && (
                    <div className="relative w-24 h-24 rounded-md overflow-hidden">
                      <img 
                        src={previewImage} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null);
                          setPreviewImage(null);
                        }}
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md"
                      >
                        <X className="h-4 w-4 text-gray-700" />
                      </button>
                    </div>
                  )}
                </div>
                
                {formErrors.image && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.image}</p>
                )}
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-md shadow-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-sm bg-blue-600 rounded-md shadow-sm text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 flex items-center"
                >
                  {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {isEditing ? 'Update Article' : 'Save Article'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex justify-end mb-6">
              <button
                onClick={() => {
                  setIsCreating(true);
                  setIsEditing(false);
                  setCurrentNewsId(null);
                }}
                className="inline-flex items-center px-4 py-2 text-sm bg-blue-600 rounded-md shadow-sm text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Article
              </button>
            </div>
            
            {newsList.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No news articles found</p>
                <button
                  onClick={() => {
                    setIsCreating(true);
                    setIsEditing(false);
                  }}
                  className="inline-flex items-center px-4 py-2 text-sm bg-blue-600 rounded-md shadow-sm text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Article
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {newsList.map((newsItem) => (
                      <tr key={newsItem._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {newsItem.image && (
                              <div className="flex-shrink-0 h-10 w-10 mr-3">
                                <img className="h-10 w-10 rounded-md object-cover" src={newsItem.image} alt={newsItem.title} />
                              </div>
                            )}
                            <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                              {newsItem.title}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(newsItem.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleEdit(newsItem._id)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            
                            <Link
                              to={`/dashboard/news/${newsItem._id}`}
                              className="text-gray-600 hover:text-gray-900"
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                            
                            <button
                              onClick={() => handleDelete(newsItem._id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 