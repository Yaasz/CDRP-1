import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, XCircle, Info, X } from 'lucide-react';

// Toast context for managing toasts globally
let showToastFunction = null;

export const showToast = (message, type = 'info', duration = 5000) => {
  if (showToastFunction) {
    showToastFunction(message, type, duration);
  }
};

// Individual Toast Component
const Toast = ({ toast, onRemove }) => {
  const { id, message, type, duration } = toast;

  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onRemove]);

  const getToastIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getToastClasses = () => {
    const baseClasses = "flex items-center p-4 rounded-lg shadow-lg border max-w-sm w-full transform transition-all duration-300 ease-in-out";
    
    switch (type) {
      case 'success':
        return `${baseClasses} bg-green-50 border-green-200`;
      case 'error':
        return `${baseClasses} bg-red-50 border-red-200`;
      case 'warning':
        return `${baseClasses} bg-yellow-50 border-yellow-200`;
      default:
        return `${baseClasses} bg-blue-50 border-blue-200`;
    }
  };

  return (
    <div className={getToastClasses()}>
      <div className="flex-shrink-0">
        {getToastIcon()}
      </div>
      <div className="ml-3 flex-1">
        <p className="text-sm font-medium text-gray-900">{message}</p>
      </div>
      <div className="ml-4 flex-shrink-0">
        <button
          onClick={() => onRemove(id)}
          className="text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

// Toast Container Component
export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type, duration) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, duration };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Set the global toast function
  useEffect(() => {
    showToastFunction = addToast;
    return () => {
      showToastFunction = null;
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};

export default ToastContainer; 