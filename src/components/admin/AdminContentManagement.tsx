import { useState } from "react";
import { FileText, Image as ImageIcon, Plus, Edit, Trash2, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface Banner {
  id: string;
  title: string;
  description: string;
  image: string;
  active: boolean;
  startDate: string;
  endDate: string;
}

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning";
  active: boolean;
  createdDate: string;
}

export function AdminContentManagement() {
  const [bannerDialog, setBannerDialog] = useState(false);
  const [announcementDialog, setAnnouncementDialog] = useState(false);

  // Mock banners data
  const [banners, setBanners] = useState<Banner[]>([
    {
      id: "BAN-001",
      title: "Eid Sale 2025",
      description: "Special discounts on all handcrafted items",
      image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800",
      active: true,
      startDate: "2025-10-01",
      endDate: "2025-10-31",
    },
    {
      id: "BAN-002",
      title: "Truck Art Week",
      description: "Celebrating Pakistani truck art heritage",
      image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800",
      active: true,
      startDate: "2025-10-15",
      endDate: "2025-10-22",
    },
    {
      id: "BAN-003",
      title: "Winter Collection",
      description: "New handwoven shawls and carpets",
      image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800",
      active: false,
      startDate: "2025-11-01",
      endDate: "2025-12-31",
    },
  ]);

  // Mock announcements data
  const [announcements] = useState<Announcement[]>([
    {
      id: "ANN-001",
      title: "New Payment Method",
      message: "We now accept JazzCash and Easypaisa for seamless payments!",
      type: "success",
      active: true,
      createdDate: "2025-10-20",
    },
    {
      id: "ANN-002",
      title: "Platform Maintenance",
      message: "Scheduled maintenance on Oct 25, 2025 from 2 AM to 4 AM PKT",
      type: "warning",
      active: true,
      createdDate: "2025-10-18",
    },
    {
      id: "ANN-003",
      title: "Featured Artisan of the Month",
      message: "Congratulations to Fatima Textile Co. for being our featured artisan!",
      type: "info",
      active: false,
      createdDate: "2025-10-01",
    },
  ]);

  // Mock featured categories
  const [featuredCategories] = useState([
    { id: 1, name: "Textiles & Fabrics", products: 45, active: true },
    { id: 2, name: "Handcrafted Jewelry", products: 32, active: true },
    { id: 3, name: "Traditional Pottery", products: 28, active: true },
    { id: 4, name: "Carpets & Rugs", products: 19, active: false },
    { id: 5, name: "Metalwork & Brass", products: 15, active: false },
  ]);

  const getAnnouncementTypeBadge = (type: string) => {
    switch (type) {
      case "success":
        return <Badge className="bg-green-100 text-green-700">Success</Badge>;
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-700">Warning</Badge>;
      case "info":
        return <Badge className="bg-blue-100 text-blue-700">Info</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-emerald-700 flex items-center gap-3">
          <FileText className="h-8 w-8" />
          Content Management
        </h2>
        <p className="text-gray-600 mt-1">
          Manage promotional banners, announcements, and featured content
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Banners</p>
                <h3 className="text-emerald-700 mt-1">
                  {banners.filter((b) => b.active).length}
                </h3>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50">
                <ImageIcon className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Announcements</p>
                <h3 className="text-blue-700 mt-1">
                  {announcements.filter((a) => a.active).length}
                </h3>
              </div>
              <div className="p-3 rounded-lg bg-blue-50">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Featured Categories</p>
                <h3 className="text-purple-700 mt-1">
                  {featuredCategories.filter((c) => c.active).length}
                </h3>
              </div>
              <div className="p-3 rounded-lg bg-purple-50">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Content</p>
                <h3 className="text-gray-900 mt-1">
                  {banners.length + announcements.length}
                </h3>
              </div>
              <div className="p-3 rounded-lg bg-gray-100">
                <FileText className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="banners" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="banners">Promotional Banners</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="categories">Featured Categories</TabsTrigger>
        </TabsList>

        {/* Promotional Banners Tab */}
        <TabsContent value="banners" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-emerald-700">Promotional Banners</CardTitle>
                  <CardDescription>Manage homepage and campaign banners</CardDescription>
                </div>
                <Button
                  onClick={() => setBannerDialog(true)}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Banner
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {banners.map((banner) => (
                  <div
                    key={banner.id}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-emerald-300 transition"
                  >
                    <ImageWithFallback
                      src={banner.image}
                      alt={banner.title}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-gray-900">{banner.title}</h3>
                        {banner.active ? (
                          <Badge className="bg-green-100 text-green-700">Active</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-700">Inactive</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{banner.description}</p>
                      <p className="text-xs text-gray-500">
                        {banner.startDate} to {banner.endDate}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="border-emerald-600 text-emerald-600">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-600 text-red-600">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Announcements Tab */}
        <TabsContent value="announcements" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-emerald-700">Platform Announcements</CardTitle>
                  <CardDescription>Create and manage site-wide announcements</CardDescription>
                </div>
                <Button
                  onClick={() => setAnnouncementDialog(true)}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Announcement
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-emerald-300 transition"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-gray-900">{announcement.title}</h3>
                        {getAnnouncementTypeBadge(announcement.type)}
                        {announcement.active ? (
                          <Badge className="bg-green-100 text-green-700">Active</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-700">Inactive</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="border-emerald-600 text-emerald-600">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-600 text-red-600">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{announcement.message}</p>
                    <p className="text-xs text-gray-500">Created: {announcement.createdDate}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Featured Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-emerald-700">Featured Categories</CardTitle>
              <CardDescription>Manage homepage featured product categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {featuredCategories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-emerald-300 transition"
                  >
                    <div>
                      <h3 className="text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-600">{category.products} products</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {category.active ? (
                        <Badge className="bg-green-100 text-green-700">Featured</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-700">Not Featured</Badge>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-emerald-600 text-emerald-600"
                        onClick={() => toast.success(`${category.name} featured status toggled`)}
                      >
                        Toggle
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Banner Dialog */}
      <Dialog open={bannerDialog} onOpenChange={setBannerDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Banner</DialogTitle>
            <DialogDescription>Create a new promotional banner for the homepage</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Banner Title</Label>
              <Input placeholder="e.g., Eid Sale 2025" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Banner description..." rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input type="date" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Banner Image URL</Label>
              <Input placeholder="https://..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBannerDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => {
                toast.success("Banner created successfully");
                setBannerDialog(false);
              }}
            >
              <Save className="h-4 w-4 mr-2" />
              Create Banner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Announcement Dialog */}
      <Dialog open={announcementDialog} onOpenChange={setAnnouncementDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Announcement</DialogTitle>
            <DialogDescription>Create a site-wide announcement</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Announcement Title</Label>
              <Input placeholder="e.g., New Payment Method" />
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea placeholder="Announcement message..." rows={4} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAnnouncementDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => {
                toast.success("Announcement created successfully");
                setAnnouncementDialog(false);
              }}
            >
              <Save className="h-4 w-4 mr-2" />
              Create Announcement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}