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
      
      <div className="flex-1">
        
        <main className="p-6">
          <Tabs defaultValue="account">
            <TabsList className="mb-6 grid w-full grid-cols-3 md:w-[400px]">
              <TabsTrigger value="account" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Account</span>
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
                        <Label htmlFor="name">Organization Name</Label>
                        <Input 
                          id="name" 
                          defaultValue="Hope Charity" 
                          className="border-[#CDC1FF] focus:border-[#A594F9] focus:ring-[#A594F9]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Organization Email</Label>
                        <Input 
                          id="email" 
                          defaultValue="Hope@gmail.com" 
                          className="border-[#CDC1FF] focus:border-[#A594F9] focus:ring-[#A594F9]"
                        />
                      </div>
                      
                    </div>
                    <div className="flex justify-end">
                      <Button className="bg-[#7371FC] hover:bg-[#6260e0]">Save Changes</Button>
                    </div>
                  </CardContent>
                </Card>

                
              </div>
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

                
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Settings;
