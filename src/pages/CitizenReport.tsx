import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { MapPin, Upload, AlertTriangle, Loader2 } from "lucide-react";
import { reportApi } from "@/lib/api";

export default function CitizenReport() {
  const [formData, setFormData] = useState({
    disasterType: "",
    name: "",
    phone: "",
    location: "",
    latitude: "",
    longitude: "",
    description: "",
    photo: null as File | null,
  });

  const [charCount, setCharCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const maxChars = 500;

  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6),
            location: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`,
          }));
          toast.success("Location captured successfully!");
        },
        (error) => {
          toast.error("Unable to get location. Please enter manually.");
          console.error(error);
        }
      );
    } else {
      toast.error("Geolocation not supported by your browser");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.disasterType || !formData.description) {
      toast.error("Please fill in required fields");
      return;
    }

    if (!formData.latitude || !formData.longitude) {
      toast.error("Please capture your location or enter coordinates");
      return;
    }

    try {
      setSubmitting(true);

      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('disaster_type', formData.disasterType);
      submitData.append('description', formData.description);
      submitData.append('latitude', formData.latitude);
      submitData.append('longitude', formData.longitude);
      
      if (formData.name) submitData.append('name', formData.name);
      if (formData.phone) submitData.append('phone', formData.phone);
      if (formData.photo) submitData.append('photo', formData.photo);

      // Submit to backend
      const response = await reportApi.submitReport(submitData);
      
      // Show success with AI trust score
      const trustScore = response?.trust_score || response?.data?.trust_score;
      if (trustScore !== undefined) {
        toast.success(
          `✅ Report submitted! AI Trust Score: ${trustScore}/100`,
          { duration: 5000 }
        );
      } else {
        toast.success("✅ Report submitted! Our team will verify it shortly.");
      }
      
      // Reset form
      setFormData({
        disasterType: "",
        name: "",
        phone: "",
        location: "",
        latitude: "",
        longitude: "",
        description: "",
        photo: null,
      });
      setCharCount(0);
      
      // Clear file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error: any) {
      console.error("Error submitting report:", error);
      toast.error(error?.message || "Failed to submit report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClear = () => {
    setFormData({
      disasterType: "",
      name: "",
      phone: "",
      location: "",
      latitude: "",
      longitude: "",
      description: "",
      photo: null,
    });
    setCharCount(0);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Column */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">Report a Disaster</CardTitle>
              </div>
              <CardDescription>
                Help us respond faster by reporting disasters in your area
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="disasterType">
                    Disaster Type <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.disasterType}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, disasterType: value }))
                    }
                  >
                    <SelectTrigger id="disasterType">
                      <SelectValue placeholder="Select disaster type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flood">Flood</SelectItem>
                      <SelectItem value="earthquake">Earthquake</SelectItem>
                      <SelectItem value="fire">Fire</SelectItem>
                      <SelectItem value="cyclone">Cyclone</SelectItem>
                      <SelectItem value="landslide">Landslide</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name (Optional)</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, name: e.target.value }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 234 567 8900"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, phone: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="flex gap-2">
                    <Input
                      id="location"
                      type="text"
                      placeholder="Search location or enter coordinates"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, location: e.target.value }))
                      }
                      className="flex-1"
                    />
                    <Button type="button" onClick={handleGetLocation} variant="outline">
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.latitude && formData.longitude && (
                    <p className="text-sm text-muted-foreground">
                      Coordinates: {formData.latitude}, {formData.longitude}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what you're experiencing..."
                    value={formData.description}
                    onChange={(e) => {
                      const text = e.target.value.slice(0, maxChars);
                      setFormData((prev) => ({ ...prev, description: text }));
                      setCharCount(text.length);
                    }}
                    className="min-h-[120px]"
                  />
                  <p className="text-sm text-muted-foreground text-right">
                    {charCount}/{maxChars} characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="photo">Upload Photo (Optional)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setFormData((prev) => ({ ...prev, photo: file }));
                      }}
                      className="flex-1"
                    />
                    <Upload className="h-5 w-5 text-muted-foreground" />
                  </div>
                  {formData.photo && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {formData.photo.name}
                    </p>
                  )}
                </div>

                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={handleClear} className="flex-1" disabled={submitting}>
                    Clear
                  </Button>
                  <Button type="submit" className="flex-1" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Report'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Map Column */}
          <Card className="lg:sticky lg:top-24 h-fit">
            <CardHeader>
              <CardTitle>Location Preview</CardTitle>
              <CardDescription>
                Your report location and nearby alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-2" />
                  <p>Map will appear here</p>
                  <p className="text-sm mt-1">
                    {formData.latitude && formData.longitude
                      ? `Location: ${formData.latitude}, ${formData.longitude}`
                      : "Click the pin icon to capture your location"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
