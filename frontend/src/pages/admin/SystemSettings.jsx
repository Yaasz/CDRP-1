import { useState } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Switch } from '../../components/ui/Switch';

export default function SystemSettings() {
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    autoApproveUsers: false,
    autoApproveCharities: false,
    maintenanceMode: false,
    debugMode: false,
    maxUploadSize: 5,
    sessionTimeout: 60,
    backupFrequency: 'daily'
  });

  const handleToggle = (setting) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting]
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: value
    });
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real application, you would save the settings to your backend:
    // await api.post('/admin/settings', settings);
    
    setSaving(false);
    
    // Show success message
    alert('Settings saved successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">System Settings</h1>
        <Button
          onClick={handleSaveSettings}
          disabled={saving}
          className="flex items-center gap-2"
        >
          {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium">Notification Settings</h2>
          <p className="text-sm text-gray-500 mt-1">Configure how the system sends notifications</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium">Email Notifications</h3>
              <p className="text-xs text-gray-500">Send email notifications to users</p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onChange={() => handleToggle('emailNotifications')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium">SMS Notifications</h3>
              <p className="text-xs text-gray-500">Send SMS notifications to users</p>
            </div>
            <Switch
              checked={settings.smsNotifications}
              onChange={() => handleToggle('smsNotifications')}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium">User Management Settings</h2>
          <p className="text-sm text-gray-500 mt-1">Configure user registration and approval settings</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium">Auto-Approve Regular Users</h3>
              <p className="text-xs text-gray-500">Automatically approve new user registrations</p>
            </div>
            <Switch
              checked={settings.autoApproveUsers}
              onChange={() => handleToggle('autoApproveUsers')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium">Auto-Approve Charity Organizations</h3>
              <p className="text-xs text-gray-500">Automatically approve new charity registrations</p>
            </div>
            <Switch
              checked={settings.autoApproveCharities}
              onChange={() => handleToggle('autoApproveCharities')}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium">System Settings</h2>
          <p className="text-sm text-gray-500 mt-1">Configure general system behavior</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium">Maintenance Mode</h3>
              <p className="text-xs text-gray-500">Put the site in maintenance mode (only admins can access)</p>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onChange={() => handleToggle('maintenanceMode')}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium">Debug Mode</h3>
              <p className="text-xs text-gray-500">Enable detailed error messages and logging</p>
            </div>
            <Switch
              checked={settings.debugMode}
              onChange={() => handleToggle('debugMode')}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1">Max Upload Size (MB)</label>
              <input
                type="number"
                name="maxUploadSize"
                value={settings.maxUploadSize}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                min="1"
                max="50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Session Timeout (minutes)</label>
              <input
                type="number"
                name="sessionTimeout"
                value={settings.sessionTimeout}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                min="15"
                max="240"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Database Backup Frequency</label>
              <select
                name="backupFrequency"
                value={settings.backupFrequency}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 