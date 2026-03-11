import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { categoryLabels, categoryIcons, type IssueCategory } from '@/lib/mock-data';
import { Camera, MapPin, Upload, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function ReportIssue() {
  const [category, setCategory] = useState<IssueCategory | ''>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsSubmitting(false);
    setSubmitted(true);
    toast.success('Issue reported successfully!');
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground">Issue Reported!</h2>
            <p className="mx-auto mt-2 max-w-sm text-muted-foreground">
              Your complaint has been submitted and our AI is analyzing it. You'll receive updates via notifications.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button onClick={() => setSubmitted(false)}>Report Another</Button>
              <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>View My Complaints</Button>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground">Report a Civic Issue</h1>
            <p className="mt-1 text-muted-foreground">Help us identify and fix problems in your area</p>
          </div>

          <form onSubmit={handleSubmit}>
            <Card className="border border-border p-6 shadow-card">
              <div className="space-y-5">
                {/* Image Upload */}
                <div>
                  <Label>Upload Photo</Label>
                  <div className="mt-2">
                    {imagePreview ? (
                      <div className="relative overflow-hidden rounded-lg">
                        <img src={imagePreview} alt="Preview" className="h-48 w-full object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={() => setImagePreview(null)}
                          className="absolute right-2 top-2 rounded-full bg-card/80 p-1.5 text-card-foreground backdrop-blur-sm hover:bg-card"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <label className="flex h-36 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 transition-colors hover:border-primary/40 hover:bg-muted/50">
                        <Camera className="mb-2 h-8 w-8 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">Click to upload or drag & drop</span>
                        <span className="text-xs text-muted-foreground">PNG, JPG up to 10MB</span>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                    )}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <Label>Issue Category</Label>
                  <Select value={category} onValueChange={(v) => setCategory(v as IssueCategory)}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.entries(categoryLabels) as [IssueCategory, string][]).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          <span className="flex items-center gap-2">
                            {categoryIcons[key]} {label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Title */}
                <div>
                  <Label htmlFor="title">Issue Title</Label>
                  <Input id="title" placeholder="Brief description of the issue" className="mt-1.5" required />
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Detailed Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the issue in detail. Include any relevant information about size, severity, and impact."
                    rows={4}
                    className="mt-1.5"
                    required
                  />
                </div>

                {/* Location */}
                <div>
                  <Label htmlFor="location">Location</Label>
                  <div className="relative mt-1.5">
                    <Input id="location" placeholder="Enter address or use GPS" className="pr-10" />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-primary hover:bg-primary/10"
                      onClick={() => toast.info('GPS location detected!')}
                    >
                      <MapPin className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Analyzing & Submitting...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" /> Submit Report
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
