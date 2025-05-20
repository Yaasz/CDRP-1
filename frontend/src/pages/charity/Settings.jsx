import React from "react";
import { Link } from "react-router-dom";
import { Bell, Shield, User } from "lucide-react";

import CharitySidebar from "../../components/charity/CharitySidebar";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/Tabs";
import { Badge } from "../../components/ui/Badge";
import { Switch } from "../../components/ui/Switch";
import { RadioGroup, RadioGroupItem } from "../../components/ui/RadioGroup";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/Select";

const Settings = () => {
  return (
    <div className="flex min-h-screen bg-[#F5EFFF]/30">
      <CharitySidebar />
      <div className="flex-1">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-white px-6">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold">Settings</h1>
          </div>
        </header>
        <main className="p-6">
          <Tabs defaultValue="account">
            <TabsList className="mb-6 grid w-full grid-cols-3 md:w-[400px]">
              <TabsTrigger value="account" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Account</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Security</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="account">
              <div className="space-y-6">
                <Card className="border border-[#E5D9F2] shadow-none">
                  <CardHeader className="bg-white pb-3">
                    <CardTitle className="text-lg text-gray-800">Profile Information</CardTitle>
                    <p className="text-sm text-gray-500">Update your account profile information.</p>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input 
                          id="name" 
                          defaultValue="Selam Tesfaye" 
                          className="border-[#CDC1FF] focus:border-[#A594F9] focus:ring-[#A594F9]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          defaultValue="selam.tesfaye@example.com" 
                          className="border-[#CDC1FF] focus:border-[#A594F9] focus:ring-[#A594F9]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select defaultValue="admin">
                          <SelectTrigger 
                            id="role" 
                            className="border-[#CDC1FF] focus:border-[#A594F9] focus:ring-[#A594F9]"
                          >
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Administrator</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="coordinator">Coordinator</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select defaultValue="en">
                          <SelectTrigger 
                            id="language"
                            className="border-[#CDC1FF] focus:border-[#A594F9] focus:ring-[#A594F9]"
                          >
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="am">Amharic</SelectItem>
                            <SelectItem value="ti">Tigrinya</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button className="bg-[#7371FC] hover:bg-[#6260e0]">Save Changes</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-[#E5D9F2] shadow-none">
                  <CardHeader className="bg-white pb-3">
                    <CardTitle className="text-lg text-gray-800">Preferences</CardTitle>
                    <p className="text-sm text-gray-500">Manage your account preferences.</p>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Dashboard Notifications</p>
                        <p className="text-sm text-gray-500">Receive notifications on dashboard updates</p>
                      </div>
                      <Switch defaultChecked id="dashboard-notifications" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Digest</p>
                        <p className="text-sm text-gray-500">Receive weekly email summaries</p>
                      </div>
                      <Switch defaultChecked id="email-digest" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Dark Mode</p>
                        <p className="text-sm text-gray-500">Use dark theme for the interface</p>
                      </div>
                      <Switch id="dark-mode" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="notifications">
              <Card className="border border-[#E5D9F2] shadow-none">
                <CardHeader className="bg-white pb-3">
                  <CardTitle className="text-lg text-gray-800">Notification Settings</CardTitle>
                  <p className="text-sm text-gray-500">Manage how you receive notifications.</p>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-800">Email Notifications</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="email-incidents">Incident Updates</Label>
                        <Switch id="email-incidents" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="email-volunteers">Volunteer Applications</Label>
                        <Switch id="email-volunteers" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="email-reports">Weekly Reports</Label>
                        <Switch id="email-reports" defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-800">System Notifications</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="system-incidents">Incident Alerts</Label>
                        <Switch id="system-incidents" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="system-volunteers">New Volunteers</Label>
                        <Switch id="system-volunteers" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="system-messages">Direct Messages</Label>
                        <Switch id="system-messages" defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-800">Notification Frequency</h3>
                    <RadioGroup defaultValue="realtime">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="realtime" id="realtime" className="text-[#7371FC]" />
                        <Label htmlFor="realtime">Real-time</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="daily" id="daily" className="text-[#7371FC]" />
                        <Label htmlFor="daily">Daily Digest</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="weekly" id="weekly" className="text-[#7371FC]" />
                        <Label htmlFor="weekly">Weekly Digest</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex justify-end">
                    <Button className="bg-[#7371FC] hover:bg-[#6260e0]">Save Preferences</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <div className="space-y-6">
                <Card className="border border-[#E5D9F2] shadow-none">
                  <CardHeader className="bg-white pb-3">
                    <CardTitle className="text-lg text-gray-800">Change Password</CardTitle>
                    <p className="text-sm text-gray-500">Update your account password.</p>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input 
                        id="current-password" 
                        type="password" 
                        className="border-[#CDC1FF] focus:border-[#A594F9] focus:ring-[#A594F9]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input 
                        id="new-password" 
                        type="password" 
                        className="border-[#CDC1FF] focus:border-[#A594F9] focus:ring-[#A594F9]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input 
                        id="confirm-password" 
                        type="password" 
                        className="border-[#CDC1FF] focus:border-[#A594F9] focus:ring-[#A594F9]"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button className="bg-[#7371FC] hover:bg-[#6260e0]">Update Password</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-[#E5D9F2] shadow-none">
                  <CardHeader className="bg-white pb-3">
                    <CardTitle className="text-lg text-gray-800">Two-Factor Authentication</CardTitle>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account.</p>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-500">Secure your account with 2FA</p>
                      </div>
                      <Switch id="2fa" />
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full border-[#CDC1FF] hover:border-[#A594F9] hover:text-[#7371FC]"
                    >
                      Set Up Two-Factor Authentication
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border border-[#E5D9F2] shadow-none">
                  <CardHeader className="bg-white pb-3">
                    <CardTitle className="text-lg text-gray-800">Session Management</CardTitle>
                    <p className="text-sm text-gray-500">Manage your active sessions.</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div className="rounded-lg border border-[#E5D9F2] p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Current Session</p>
                            <p className="text-sm text-gray-500">Addis Ababa, Ethiopia • Chrome on Windows</p>
                          </div>
                          <Badge className="bg-[#7371FC]">Active</Badge>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full text-red-500 hover:bg-red-50 hover:text-red-600 border-[#CDC1FF]"
                      >
                        Sign Out of All Sessions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Settings; 