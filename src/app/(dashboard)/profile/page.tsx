"use client";

import * as React from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Mail,
  Phone,
  Camera,
  Shield,
  Key,
  LogOut,
  Smartphone,
  Monitor,
  Clock,
  MapPin,
  Save,
  Loader2,
  AlertTriangle,
  Check,
} from "lucide-react";
import { format, subDays, subHours } from "date-fns";

// Mock user data
const mockUser = {
  id: "user_1",
  firstName: "Alex",
  lastName: "Thompson",
  email: "alex@wagandwash.com",
  phone: "(555) 987-6543",
  role: "Owner",
  avatar: null,
  createdAt: subDays(new Date(), 180).toISOString(),
  lastLogin: subHours(new Date(), 2).toISOString(),
  twoFactorEnabled: false,
};

const mockSessions = [
  {
    id: "sess_1",
    device: "Chrome on MacOS",
    location: "San Francisco, CA",
    lastActive: new Date().toISOString(),
    current: true,
  },
  {
    id: "sess_2",
    device: "Safari on iPhone",
    location: "San Francisco, CA",
    lastActive: subHours(new Date(), 3).toISOString(),
    current: false,
  },
  {
    id: "sess_3",
    device: "Chrome on Windows",
    location: "New York, NY",
    lastActive: subDays(new Date(), 2).toISOString(),
    current: false,
  },
];

export default function ProfilePage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [user, setUser] = React.useState(mockUser);
  const [showPasswordDialog, setShowPasswordDialog] = React.useState(false);

  const handleSaveProfile = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast({
      title: "Profile updated",
      description: "Your changes have been saved successfully.",
    });
    setIsLoading(false);
  };

  const handleLogoutSession = (sessionId: string) => {
    toast({
      title: "Session ended",
      description: "The device has been logged out.",
    });
  };

  const handleLogoutAllSessions = () => {
    toast({
      title: "All sessions ended",
      description: "All other devices have been logged out.",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Manage your personal account settings"
      />

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="sessions">
            <Monitor className="h-4 w-4 mr-2" />
            Sessions
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          {/* Avatar Section */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Photo</CardTitle>
              <CardDescription>
                This is your avatar that appears across the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatar || undefined} />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {user.firstName[0]}{user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline">
                    <Camera className="h-4 w-4 mr-2" />
                    Upload Photo
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Info */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={user.firstName}
                    onChange={(e) =>
                      setUser((prev) => ({ ...prev, firstName: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={user.lastName}
                    onChange={(e) =>
                      setUser((prev) => ({ ...prev, lastName: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    onChange={(e) =>
                      setUser((prev) => ({ ...prev, email: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={user.phone}
                    onChange={(e) =>
                      setUser((prev) => ({ ...prev, phone: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="secondary">{user.role}</Badge>
                  <span>•</span>
                  <span>Member since {format(new Date(user.createdAt), "MMMM yyyy")}</span>
                </div>
                <Button onClick={handleSaveProfile} disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          {/* Password */}
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Current Password</p>
                  <p className="text-sm text-muted-foreground">
                    Last changed 30 days ago
                  </p>
                </div>
                <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Key className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>
                        Enter your current password and choose a new one
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input id="currentPassword" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => {
                        setShowPasswordDialog(false);
                        toast({ title: "Password updated", description: "Your password has been changed." });
                      }}>
                        Update Password
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication */}
          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${user.twoFactorEnabled ? "bg-green-100" : "bg-muted"}`}>
                    <Shield className={`h-5 w-5 ${user.twoFactorEnabled ? "text-green-600" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <p className="font-medium">
                      {user.twoFactorEnabled ? "Enabled" : "Not Enabled"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user.twoFactorEnabled
                        ? "Your account is protected with 2FA"
                        : "Secure your account with an authenticator app"}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={user.twoFactorEnabled}
                  onCheckedChange={(checked) =>
                    setUser((prev) => ({ ...prev, twoFactorEnabled: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions for your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Delete Account</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button variant="destructive">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Active Sessions</CardTitle>
                  <CardDescription>
                    Manage devices where you&apos;re logged in
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={handleLogoutAllSessions}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-muted rounded-lg">
                        {session.device.includes("iPhone") ? (
                          <Smartphone className="h-5 w-5" />
                        ) : (
                          <Monitor className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{session.device}</p>
                          {session.current && (
                            <Badge variant="default" className="text-xs">
                              Current
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {session.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {session.current
                              ? "Active now"
                              : format(new Date(session.lastActive), "MMM d, h:mm a")}
                          </span>
                        </div>
                      </div>
                    </div>
                    {!session.current && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLogoutSession(session.id)}
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Login History */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Login Activity</CardTitle>
              <CardDescription>
                Your recent login attempts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { success: true, device: "Chrome on MacOS", location: "San Francisco, CA", time: subHours(new Date(), 2) },
                  { success: true, device: "Safari on iPhone", location: "San Francisco, CA", time: subHours(new Date(), 5) },
                  { success: false, device: "Unknown Browser", location: "Moscow, Russia", time: subDays(new Date(), 1) },
                  { success: true, device: "Chrome on Windows", location: "New York, NY", time: subDays(new Date(), 2) },
                ].map((login, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center gap-3">
                      {login.success ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{login.device}</p>
                        <p className="text-xs text-muted-foreground">
                          {login.location}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {format(login.time, "MMM d, h:mm a")}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
