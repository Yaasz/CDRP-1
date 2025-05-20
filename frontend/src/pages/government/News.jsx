import { useState, useEffect } from 'react';
import { Search, FileImage, Trash2, Edit, Eye, Plus, ChevronRight, ChevronLeft, 
  Radio, Upload, X, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import api from '../../utils/api';

export default function GovernmentNews() {
  const [newsPosts, setNewsPosts] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentNewsId, setCurrentNewsId] = useState(null);
  const [activeNewsPost, setActiveNewsPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    incident: '',
    category: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [totalPosts, setTotalPosts] = useState(0);

  // Categories for news
  const categories = [
    { value: '', label: 'Select category...' },
    { value: 'Emergency', label: 'Emergency' },
    { value: 'Update', label: 'Update' },
    { value: 'Advisory', label: 'Advisory' },
    { value: 'Notice', label: 'Notice' },
  ];

  useEffect(() => {
    fetchNews();
    fetchIncidents();
  }, [currentPage]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await api.get('/news', {
        params: { page: currentPage, limit: itemsPerPage, search: searchTerm }
      });
      
      if (response.data && response.data.data) {
        setNewsPosts(response.data.data);
        setTotalPages(Math.ceil(response.data.totalCount / itemsPerPage));
        setTotalPosts(response.data.totalCount);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchIncidents = async () => {
    try {
      const response = await api.get('/incidents');
      if (response.data && response.data.data) {
        setIncidents(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching incidents:', error);
    }
  };

  const fetchNewsById = async (id) => {
    try {
      const response = await api.get(`/news/${id}`);
      if (response.data && response.data.data) {
        return response.data.data;
      }
    } catch (error) {
      console.error('Error fetching news details:', error);
    }
    return null;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchNews();
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear form errors when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl('');
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.incident) errors.incident = 'Incident is required';
    if (!selectedFile && !isEditing && !previewUrl) errors.file = 'Featured image is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setSubmitting(true);
      
      // First upload the image to get URL and cloudinaryId
      let imageData = { url: '', cloudinaryId: '' };
      
      if (selectedFile) {
        const formData = new FormData();
        formData.append('image', selectedFile);
        
        const uploadResponse = await api.post('/upload', formData);
        if (uploadResponse.data && uploadResponse.data.url) {
          imageData = {
            url: uploadResponse.data.url,
            cloudinaryId: uploadResponse.data.cloudinaryId
          };
        }
      }
      
      // Prepare news data
      const newsData = {
        title: formData.title,
        description: formData.description,
        incident: formData.incident
      };
      
      // For edit mode, only update the image if a new one was selected
      if (isEditing) {
        if (selectedFile) {
          newsData.images = JSON.stringify([imageData]);
        } else if (activeNewsPost?.images?.length > 0) {
          // Keep existing images
          newsData.images = JSON.stringify(activeNewsPost.images);
        }
        
        await api.put(`/news/${currentNewsId}`, newsData);
      } else {
        // For new post, always include image
        newsData.images = JSON.stringify([imageData]);
        await api.post('/news', newsData);
      }
      
      // Reset form and refresh news list
      resetForm();
      fetchNews();
      
    } catch (error) {
      console.error('Error saving news:', error);
      setFormErrors({
        submit: error.response?.data?.message || 'Failed to save news post'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      incident: '',
      category: ''
    });
    setSelectedFile(null);
    setPreviewUrl('');
    setShowCreateForm(false);
    setIsEditing(false);
    setCurrentNewsId(null);
    setActiveNewsPost(null);
  };

  const handleViewNews = async (id) => {
    const post = await fetchNewsById(id);
    if (post) {
      setActiveNewsPost(post);
    }
  };

  const handleEditNews = async (id) => {
    const post = await fetchNewsById(id);
    if (post) {
      setFormData({
        title: post.title || '',
        description: post.description || '',
        incident: post.incident || '',
        category: ''
      });
      
      setCurrentNewsId(id);
      setIsEditing(true);
      setActiveNewsPost(post);
      
      // Set preview image if exists
      if (post.images && post.images.length > 0 && post.images[0].url) {
        setPreviewUrl(post.images[0].url);
      }
      
      setShowCreateForm(true);
    }
  };

  const handleDeleteNews = async (id) => {
    if (!window.confirm('Are you sure you want to delete this news post?')) return;
    
    try {
      await api.delete(`/news/${id}`);
      fetchNews();
    } catch (error) {
      console.error('Error deleting news:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // View for news details
  if (activeNewsPost && !showCreateForm) {
    const incidentTitle = incidents.find(i => i._id === activeNewsPost.incident)?.title || 'Unknown Incident';
    
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Button 
          onClick={() => setActiveNewsPost(null)} 
          className="mb-4 flex items-center gap-2 bg-gray-100 text-gray-800 hover:bg-gray-200"
        >
          <ArrowLeft size={16} /> Back to News List
        </Button>
        
        <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3">
                <img 
                  src={activeNewsPost.images && activeNewsPost.images[0] ? activeNewsPost.images[0].url : 'https://placehold.co/400x300'} 
                  alt={activeNewsPost.title}
                  className="w-full h-auto object-cover rounded-lg mb-4"
                />
                
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-blue-100 text-blue-800">
                      {incidentTitle}
                    </Badge>
                    {activeNewsPost.category && (
                      <Badge className="bg-purple-100 text-purple-800">
                        {activeNewsPost.category}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    <p>Published: {formatDate(activeNewsPost.createdAt)}</p>
                    {activeNewsPost.updatedAt && activeNewsPost.updatedAt !== activeNewsPost.createdAt && (
                      <p>Last updated: {formatDate(activeNewsPost.updatedAt)}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2 pt-4 border-t border-gray-100">
                    <Button 
                      className="w-full bg-blue-600 text-white"
                      onClick={() => handleEditNews(activeNewsPost._id)}
                    >
                      <Edit size={16} className="mr-2" /> Edit Post
                    </Button>
                    <Button 
                      className="w-full bg-red-600 text-white"
                      onClick={() => {
                        if (handleDeleteNews(activeNewsPost._id)) {
                          setActiveNewsPost(null);
                        }
                      }}
                    >
                      <Trash2 size={16} className="mr-2" /> Delete Post
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-2/3">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">{activeNewsPost.title}</h1>
                
                <div className="prose max-w-none">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Description</h3>
                  <p className="text-gray-600 whitespace-pre-line">{activeNewsPost.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {showCreateForm ? (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <button 
                onClick={resetForm}
                className="mr-4 text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft size={20} />
              </button>
              <h2 className="text-xl font-bold">{isEditing ? 'Edit News Post' : 'Create New Post'}</h2>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Post Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border ${formErrors.title ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter post title..."
              />
              {formErrors.title && <p className="mt-1 text-sm text-red-500">{formErrors.title}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Related Incident</label>
                <select
                  name="incident"
                  value={formData.incident}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${formErrors.incident ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">Select an incident...</option>
                  {incidents.map(incident => (
                    <option key={incident._id} value={incident._id}>
                      {incident.title || `Incident #${incident._id.substring(0, 8)}`}
                    </option>
                  ))}
                </select>
                {formErrors.incident && <p className="mt-1 text-sm text-red-500">{formErrors.incident}</p>}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Brief Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-3 py-2 border ${formErrors.description ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter a brief description..."
              ></textarea>
              {formErrors.description && <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>}
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
              <div className="flex items-center justify-between">
                <div className={`w-1/2 border-2 border-dashed ${formErrors.file ? 'border-red-500' : 'border-gray-300'} rounded-lg p-4`}>
                  {previewUrl ? (
                    <div className="relative">
                      <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto rounded" />
                      <button
                        type="button"
                        onClick={removeFile}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div 
                      className="text-center cursor-pointer py-8"
                      onClick={() => document.getElementById('image-upload').click()}
                    >
                      <FileImage className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">Drag and drop your image here</p>
                      <p className="text-xs text-gray-400">or click to browse</p>
                    </div>
                  )}
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                <div className="w-1/2 pl-4">
                  <p className="text-sm text-gray-600 mb-2">Image Guidelines:</p>
                  <ul className="text-xs text-gray-500 list-disc pl-4 space-y-1">
                    <li>Use high-quality, relevant images</li>
                    <li>Optimal size: 1200x628 pixels</li>
                    <li>Maximum file size: 5MB</li>
                    <li>Supported formats: JPG, PNG</li>
                  </ul>
                </div>
              </div>
              {formErrors.file && <p className="mt-1 text-sm text-red-500">{formErrors.file}</p>}
            </div>
            
            {formErrors.submit && (
              <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md">
                {formErrors.submit}
              </div>
            )}
            
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 text-white hover:bg-blue-700"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <RefreshCw className="animate-spin mr-2 h-4 w-4" />
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  isEditing ? 'Update Post' : 'Create Post'
                )}
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">News Management</h1>
            <p className="text-gray-500">
              Create and manage news posts about incidents and disaster response
            </p>
          </div>
          
          {/* Search & Filters */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search news posts..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
            </form>
            
            <Button 
              className="bg-blue-600 text-white hover:bg-blue-700 whitespace-nowrap flex items-center"
              onClick={() => setShowCreateForm(true)}
            >
              <Plus size={16} className="mr-2" />
              Create New Post
            </Button>
          </div>
          
          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm text-gray-500 mb-1">Total Posts</h3>
              <p className="text-2xl font-bold">{totalPosts}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm text-gray-500 mb-1">Recent Posts</h3>
              <p className="text-2xl font-bold">
                {newsPosts.filter(post => {
                  const postDate = new Date(post.createdAt);
                  const oneWeekAgo = new Date();
                  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                  return postDate >= oneWeekAgo;
                }).length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-sm text-gray-500 mb-1">Active Incidents</h3>
              <p className="text-2xl font-bold">{incidents.length}</p>
            </div>
          </div>
          
          {/* News Table */}
          <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Incident</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <RefreshCw className="h-6 w-6 text-blue-600 animate-spin" />
                      </div>
                    </td>
                  </tr>
                ) : newsPosts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                      <Radio className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">No news posts found</p>
                      <p className="text-sm text-gray-500">
                        {searchTerm ? "Try adjusting your search" : "Create your first news post"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  newsPosts.map((post) => {
                    const incidentTitle = incidents.find(i => i._id === post.incident)?.title || 'Unknown Incident';
                    
                    return (
                      <tr key={post._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 mr-3">
                              <img 
                                className="h-10 w-10 rounded-md object-cover" 
                                src={post.images && post.images[0] ? post.images[0].url : 'https://placehold.co/100'} 
                                alt={post.title}
                              />
                            </div>
                            <div className="text-sm font-medium text-gray-900">{post.title}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(post.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className="bg-blue-100 text-blue-800">
                            {incidentTitle}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewNews(post._id)}
                          >
                            <Eye size={16} className="mr-1" />
                            View
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-blue-600 text-white"
                            onClick={() => handleEditNews(post._id)}
                          >
                            <Edit size={16} className="mr-1" />
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-red-600 text-white"
                            onClick={() => handleDeleteNews(post._id)}
                          >
                            <Trash2 size={16} className="mr-1" />
                            Delete
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {newsPosts.length > 0 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-500">
                Showing page {currentPage} of {totalPages}
              </p>
              <div className="flex items-center space-x-2">
                <Button 
                  onClick={goToPreviousPage} 
                  disabled={currentPage === 1} 
                  className="p-2 border border-gray-300 rounded-md disabled:opacity-50"
                  variant="outline"
                >
                  <ChevronLeft size={16} />
                </Button>
                <span className="text-sm">{currentPage}</span>
                <Button 
                  onClick={goToNextPage} 
                  disabled={currentPage >= totalPages} 
                  className="p-2 border border-gray-300 rounded-md disabled:opacity-50"
                  variant="outline"
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 