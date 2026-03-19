import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, LogOut, MapPin, User, Lock } from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

export default function LocationAdminDashboard() {
  const { adminUser, adminSignOut } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await adminSignOut();
    navigate('/admin-login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-card-foreground">Location Admin</h1>
              <p className="text-xs text-muted-foreground">Restricted access portal</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* Welcome Card */}
          <Card className="border border-border p-6 shadow-card">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <User className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-card-foreground">
                  Welcome, {adminUser?.displayName}
                </h2>
                <p className="text-sm text-muted-foreground">Location Administrator</p>
              </div>
            </div>
          </Card>

          {/* Location Info */}
          <Card className="border border-border p-6 shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-card-foreground">Assigned Location</h3>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="px-4 py-2 text-sm">{adminUser?.locationName ?? 'Not assigned'}</Badge>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              You are authorized to manage issues reported in {adminUser?.locationName ?? 'your assigned area'}.
            </p>
          </Card>

          {/* Restricted Access Notice */}
          <Card className="border border-border bg-muted/30 p-6 shadow-card">
            <div className="flex items-center gap-3 mb-3">
              <Lock className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-bold text-card-foreground">Restricted Access</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Your account has location-level administrative privileges. You can only view and manage
              complaints within your assigned location. Contact a Super Admin for additional access
              or role changes.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
