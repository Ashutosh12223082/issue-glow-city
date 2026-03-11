import { Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-foreground">CivicPulse</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <Link to="/report" className="hover:text-foreground transition-colors">Report</Link>
            <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
            <Link to="/admin" className="hover:text-foreground transition-colors">Admin</Link>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 CivicPulse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
