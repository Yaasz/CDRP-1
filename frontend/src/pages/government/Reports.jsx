import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Link } from 'react-router-dom';
import { Search, Filter, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export default function GovernmentReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedReports, setSelectedReports] = useState([]);
  const [showConvertModal, setShowConvertModal] = useState(false);

  const reportTypes = ['All Types', 'Flood', 'Fire', 'Storm', 'Earthquake', 'Other'];

  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      case 'converted':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = {
          page: currentPage,
          limit: 10,
          search: searchTerm,
        };
        if (selectedType !== 'All Types') {
          params.type = selectedType;
        }
        const response = await api.get('/reports', { params });
        const sampleReports = [
          { id: 'REP-001', type: 'Flood', title: 'Flood in Central', location: 'Central District', status: 'pending', reportedBy: 'User A', date: new Date(Date.now() - 2 * 60 * 60 * 1000) },
          { id: 'REP-002', type: 'Fire', title: 'Fire in South', location: 'South Area', status: 'reviewed', reportedBy: 'User B', date: new Date(Date.now() - 1 * 60 * 60 * 1000) },
          { id: 'REP-003', type: 'Storm', title: 'Storm in East', location: 'East Coast', status: 'converted', reportedBy: 'User C', date: new Date(Date.now() - 3 * 60 * 60 * 1000) },
        ];
        const data = response?.data?.data?.length ? response.data.data : sampleReports;
        setReports(data);
        setTotalPages(response?.data?.totalCount ? Math.ceil(response.data.totalCount / 10) : 1);
      } catch (err) {
        setError('Failed to load reports. Please try again later.');
        setReports([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [currentPage, searchTerm, selectedType]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleTypeChange = (type) => {
    setSelectedType(type);
    setCurrentPage(1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleSelectReport = (id) => {
    setSelectedReports((prev) =>
      prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
    );
  };

  const handleConvertToIncident = () => {
    setShowConvertModal(true);
  };

  const confirmConvert = async () => {
    // In real implementation, call backend to convert selected reports
    alert(`Converted reports: ${selectedReports.join(', ')}`);
    setShowConvertModal(false);
    setSelectedReports([]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#7371FC]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Reports Management</h1>
          <p className="text-gray-500">Total Reports: {reports.length}</p>
        </div>
        <Button
          className="bg-[#7371FC] text-white"
          disabled={selectedReports.length === 0}
          onClick={handleConvertToIncident}
        >
          Convert to Incident
        </Button>
      </div>
      {/* Search and Filter */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search reports..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7371FC]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </form>
        <div className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white p-1 text-sm">
          {reportTypes.map((type) => (
            <button
              key={type}
              type="button"
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                selectedType === type
                  ? 'bg-[#7371FC] text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
              onClick={() => handleTypeChange(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          {error}
          <Button
            onClick={() => window.location.reload()}
            className="mt-2 bg-red-600 hover:bg-red-700 text-white"
          >
            Retry
          </Button>
        </div>
      )}
      {/* Reports Table */}
      <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input type="checkbox" checked={selectedReports.length === reports.length && reports.length > 0} onChange={() => setSelectedReports(selectedReports.length === reports.length ? [] : reports.map(r => r.id))} />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reported By</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <input type="checkbox" checked={selectedReports.includes(report.id)} onChange={() => handleSelectReport(report.id)} />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{report.id}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{report.type}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{report.title}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{report.location}</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <Badge className={getStatusBadgeColor(report.status)}>
                    {report.status}
                  </Badge>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{report.reportedBy}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(report.date)}</td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button variant="outline" size="sm" className="text-[#7371FC] border-[#7371FC]">
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
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
      {/* Convert Modal */}
      {showConvertModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Convert Reports to Incident</h2>
            <p className="mb-4">Are you sure you want to convert the selected reports to an incident?</p>
            <div className="flex justify-end space-x-3">
              <Button onClick={() => setShowConvertModal(false)} className="bg-gray-100 text-gray-700 hover:bg-gray-200">Cancel</Button>
              <Button onClick={confirmConvert} className="bg-[#7371FC] hover:bg-[#6260EA] text-white flex items-center">
                <CheckCircle size={16} className="mr-1" />
                Convert
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 