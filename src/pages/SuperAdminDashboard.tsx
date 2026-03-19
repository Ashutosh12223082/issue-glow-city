import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, Plus, Pencil, Trash2, LogOut, Loader2, Users, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface AdminEntry {
  user_id: string;
  email: string;
  role: string;
  location_name: string | null;
  display_name: string | null;
}

export default function SuperAdminDashboard() {
  const { adminUser, adminSignOut } = useAdminAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminEntry | null>(null);
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formDisplayName, setFormDisplayName] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formRole, setFormRole] = useState<'super_admin' | 'location_admin'>('location_admin');
  const [submitting, setSubmitting] = useState(false);

  // Fetch locations
  const { data: locations = [] } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data } = await supabase.from('locations').select('id, name').order('name');
      return data ?? [];
    },
  });

  // Fetch all admins via edge function
  const { data: admins = [], isLoading } = useQuery({
    queryKey: ['all-admins'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('manage-admins', {
        body: { action: 'list' },
      });
      if (error) throw error;
      return (data?.admins ?? []) as AdminEntry[];
    },
  });

  const resetForm = () => {
    setFormEmail('');
    setFormPassword('');
    setFormDisplayName('');
    setFormLocation('');
    setFormRole('location_admin');
    setEditingAdmin(null);
  };

  const openCreate = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (admin: AdminEntry) => {
    setEditingAdmin(admin);
    setFormEmail(admin.email);
    setFormPassword('');
    setFormDisplayName(admin.display_name ?? '');
    setFormLocation(admin.location_name ?? '');
    setFormRole(admin.role as 'super_admin' | 'location_admin');
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formEmail.trim()) {
      toast.error('Email is required');
      return;
    }
    if (!editingAdmin && !formPassword.trim()) {
      toast.error('Password is required');
      return;
    }
    if (formRole === 'location_admin' && !formLocation) {
      toast.error('Please select a location for location admin');
      return;
    }

    setSubmitting(true);
    try {
      if (editingAdmin) {
        const { error } = await supabase.functions.invoke('manage-admins', {
          body: {
            action: 'update',
            userId: editingAdmin.user_id,
            role: formRole,
            locationName: formRole === 'location_admin' ? formLocation : null,
            displayName: formDisplayName,
            ...(formPassword.trim() ? { password: formPassword } : {}),
          },
        });
        if (error) throw error;
        toast.success('Admin updated successfully');
      } else {
        const { error } = await supabase.functions.invoke('manage-admins', {
          body: {
            action: 'create',
            email: formEmail,
            password: formPassword,
            role: formRole,
            locationName: formRole === 'location_admin' ? formLocation : null,
            displayName: formDisplayName,
          },
        });
        if (error) throw error;
        toast.success('Admin created successfully');
      }
      queryClient.invalidateQueries({ queryKey: ['all-admins'] });
      setDialogOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this admin?')) return;
    try {
      const { error } = await supabase.functions.invoke('manage-admins', {
        body: { action: 'delete', userId },
      });
      if (error) throw error;
      toast.success('Admin removed');
      queryClient.invalidateQueries({ queryKey: ['all-admins'] });
    } catch (err: any) {
      toast.error(err.message || 'Delete failed');
    }
  };

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
              <h1 className="text-lg font-bold text-card-foreground">Super Admin Panel</h1>
              <p className="text-xs text-muted-foreground">Welcome, {adminUser?.displayName}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="flex items-center gap-4 border border-border p-5 shadow-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{admins.length}</p>
              <p className="text-xs text-muted-foreground">Total Admins</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4 border border-border p-5 shadow-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <MapPin className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{locations.length}</p>
              <p className="text-xs text-muted-foreground">Locations</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4 border border-border p-5 shadow-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">
                {admins.filter((a) => a.role === 'location_admin').length}
              </p>
              <p className="text-xs text-muted-foreground">Location Admins</p>
            </div>
          </Card>
        </div>

        {/* Admin Table */}
        <Card className="border border-border shadow-card">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="font-bold text-card-foreground">Manage Admins</h2>
            <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
              <DialogTrigger asChild>
                <Button size="sm" onClick={openCreate}>
                  <Plus className="mr-2 h-4 w-4" /> Add Admin
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingAdmin ? 'Edit Admin' : 'Add New Admin'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div>
                    <Label>Email</Label>
                    <Input
                      className="mt-1.5"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      disabled={!!editingAdmin}
                      placeholder="admin@example.com"
                    />
                  </div>
                  <div>
                    <Label>{editingAdmin ? 'New Password (leave blank to keep)' : 'Password'}</Label>
                    <Input
                      className="mt-1.5"
                      type="password"
                      value={formPassword}
                      onChange={(e) => setFormPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <Label>Display Name</Label>
                    <Input
                      className="mt-1.5"
                      value={formDisplayName}
                      onChange={(e) => setFormDisplayName(e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label>Role</Label>
                    <Select value={formRole} onValueChange={(v) => setFormRole(v as any)}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                        <SelectItem value="location_admin">Location Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {formRole === 'location_admin' && (
                    <div>
                      <Label>Assigned Location</Label>
                      <Select value={formLocation} onValueChange={setFormLocation}>
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="Select location" />
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
                  )}
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleSubmit} disabled={submitting}>
                    {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {editingAdmin ? 'Update' : 'Create'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : admins.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">No admins found. Add one to get started.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin.user_id}>
                    <TableCell className="font-medium text-card-foreground">{admin.email}</TableCell>
                    <TableCell className="text-muted-foreground">{admin.display_name || '—'}</TableCell>
                    <TableCell>
                      <Badge variant={admin.role === 'super_admin' ? 'default' : 'secondary'} className="text-xs capitalize">
                        {admin.role === 'super_admin' ? 'Super Admin' : 'Location Admin'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{admin.location_name || '—'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(admin)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDelete(admin.user_id)}
                          disabled={admin.user_id === adminUser?.user.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </div>
  );
}
