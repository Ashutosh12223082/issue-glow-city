import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Eye, EyeOff, Loader2, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { supabase } from '@/integrations/supabase/client';

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [locations, setLocations] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const { adminSignIn, adminUser } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.from('locations').select('id, name').order('name').then(({ data }) => {
      if (data) setLocations(data);
    });
  }, []);

  useEffect(() => {
    if (adminUser) {
      navigate(adminUser.role === 'super_admin' ? '/super-admin' : '/location-admin');
    }
  }, [adminUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    if (!location) {
      toast.error('Please select a location');
      return;
    }
    setLoading(true);
    try {
      await adminSignIn(email, password, location);
      toast.success('Login successful!');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md border border-border p-8 shadow-elevated">
        <div className="mb-6 text-center">
          <Link to="/" className="mb-4 inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-card-foreground">Admin Portal</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in with your admin credentials</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Username (Email)</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5"
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative mt-1.5">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="mt-1.5">
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Select your location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc.id} value={loc.name}>
                    {loc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Not an admin?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            User login
          </Link>
        </p>
      </Card>
    </div>
  );
}
