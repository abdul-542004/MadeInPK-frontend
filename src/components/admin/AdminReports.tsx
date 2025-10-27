import { useState } from "react";
import { Flag, Search, CheckCircle, XCircle, AlertTriangle, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";

interface Report {
  id: string;
  type: "product" | "seller" | "user" | "other";
  reportedItem: string;
  reportedBy: string;
  reason: string;
  description: string;
  status: "pending" | "resolved" | "dismissed";
  date: string;
  priority: "low" | "medium" | "high";
}

export function AdminReports() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [actionDialog, setActionDialog] = useState<"resolve" | "dismiss" | "view" | null>(null);
  const [resolutionNote, setResolutionNote] = useState("");

  // Mock reports data
  const [reports, setReports] = useState<Report[]>([
    {
      id: "RPT-001",
      type: "product",
      reportedItem: "Hand-Embroidered Shawl (P001)",
      reportedBy: "Ahmed Khan",
      reason: "Misleading Description",
      description: "Product quality doesn't match the description. Colors are different.",
      status: "pending",
      date: "2025-10-22",
      priority: "high",
    },
    {
      id: "RPT-002",
      type: "seller",
      reportedItem: "Suspicious Seller (S006)",
      reportedBy: "Fatima Ali",
      reason: "Fraudulent Activity",
      description: "Seller requested payment outside platform. Suspicious behavior.",
      status: "pending",
      date: "2025-10-21",
      priority: "high",
    },
    {
      id: "RPT-003",
      type: "product",
      reportedItem: "Ceramic Pottery Bowl (P005)",
      reportedBy: "Hassan Raza",
      reason: "Copyright Violation",
      description: "This design is copied from another artisan's work.",
      status: "resolved",
      date: "2025-10-18",
      priority: "medium",
    },
    {
      id: "RPT-004",
      type: "user",
      reportedItem: "Suspicious User (U006)",
      reportedBy: "Ayesha Malik",
      reason: "Fake Reviews",
      description: "User posting fake positive reviews for sellers.",
      status: "resolved",
      date: "2025-10-15",
      priority: "medium",
    },
    {
      id: "RPT-005",
      type: "other",
      reportedItem: "Platform Issue",
      reportedBy: "Zainab Ali",
      reason: "Payment Gateway Error",
      description: "Payment failed but amount was deducted from account.",
      status: "pending",
      date: "2025-10-23",
      priority: "high",
    },
    {
      id: "RPT-006",
      type: "product",
      reportedItem: "Traditional Brass Vase (P002)",
      reportedBy: "Ali Akbar",
      reason: "Poor Quality",
      description: "Product arrived damaged and seller not responding.",
      status: "dismissed",
      date: "2025-10-10",
      priority: "low",
    },
  ]);

  const pendingReports = reports.filter((r) => r.status === "pending");
  const resolvedReports = reports.filter((r) => r.status === "resolved");
  const dismissedReports = reports.filter((r) => r.status === "dismissed");
  const highPriorityReports = reports.filter((r) => r.priority === "high" && r.status === "pending");

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reportedItem.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reportedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reason.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "product":
        return <Badge className="bg-blue-100 text-blue-700">Product</Badge>;
      case "seller":
        return <Badge className="bg-purple-100 text-purple-700">Seller</Badge>;
      case "user":
        return <Badge className="bg-orange-100 text-orange-700">User</Badge>;
      case "other":
        return <Badge className="bg-gray-100 text-gray-700">Other</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
      case "resolved":
        return <Badge className="bg-green-100 text-green-700">Resolved</Badge>;
      case "dismissed":
        return <Badge className="bg-gray-100 text-gray-700">Dismissed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-100 text-red-700">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-700">Medium</Badge>;
      case "low":
        return <Badge className="bg-green-100 text-green-700">Low</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  const handleAction = (action: "resolve" | "dismiss" | "view", report: Report) => {
    setSelectedReport(report);
    setActionDialog(action);
  };

  const confirmAction = () => {
    if (!selectedReport || !actionDialog) return;

    if (actionDialog === "view") {
      setActionDialog(null);
      return;
    }

    if (actionDialog === "resolve" && !resolutionNote.trim()) {
      toast.error("Please provide resolution details");
      return;
    }

    const message =
      actionDialog === "resolve"
        ? `Report ${selectedReport.id} resolved successfully`
        : `Report ${selectedReport.id} dismissed`;

    toast.success(message);
    setActionDialog(null);
    setSelectedReport(null);
    setResolutionNote("");
  };

  const renderReportTable = (reportList: Report[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Report ID</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Reported Item</TableHead>
          <TableHead>Reported By</TableHead>
          <TableHead>Reason</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reportList.map((report) => (
          <TableRow key={report.id}>
            <TableCell className="text-emerald-700">{report.id}</TableCell>
            <TableCell>{getTypeBadge(report.type)}</TableCell>
            <TableCell>{report.reportedItem}</TableCell>
            <TableCell className="text-gray-600">{report.reportedBy}</TableCell>
            <TableCell className="text-gray-600">{report.reason}</TableCell>
            <TableCell>{getPriorityBadge(report.priority)}</TableCell>
            <TableCell>{getStatusBadge(report.status)}</TableCell>
            <TableCell className="text-gray-600">{report.date}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAction("view", report)}
                  className="border-gray-300"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                {report.status === "pending" && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleAction("resolve", report)}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Resolve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction("dismiss", report)}
                      className="border-red-600 text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Dismiss
                    </Button>
                  </>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-emerald-700 flex items-center gap-3">
          <Flag className="h-8 w-8" />
          Reports & Feedback
        </h2>
        <p className="text-gray-600 mt-1">
          Review user reports and feedback to maintain platform quality
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Reports</p>
                <h3 className="text-yellow-600 mt-1">{pendingReports.length}</h3>
              </div>
              <div className="p-3 rounded-lg bg-yellow-50">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">High Priority</p>
                <h3 className="text-red-600 mt-1">{highPriorityReports.length}</h3>
              </div>
              <div className="p-3 rounded-lg bg-red-50">
                <Flag className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Resolved</p>
                <h3 className="text-emerald-700 mt-1">{resolvedReports.length}</h3>
              </div>
              <div className="p-3 rounded-lg bg-emerald-50">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Reports</p>
                <h3 className="text-gray-900 mt-1">{reports.length}</h3>
              </div>
              <div className="p-3 rounded-lg bg-gray-100">
                <Flag className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by report ID, item, reporter, or reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Reports Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-emerald-700">User Reports</CardTitle>
          <CardDescription>Review and resolve reported issues</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending">
                Pending ({pendingReports.length})
              </TabsTrigger>
              <TabsTrigger value="resolved">
                Resolved ({resolvedReports.length})
              </TabsTrigger>
              <TabsTrigger value="dismissed">
                Dismissed ({dismissedReports.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              {renderReportTable(
                searchQuery
                  ? filteredReports.filter((r) => r.status === "pending")
                  : pendingReports
              )}
            </TabsContent>

            <TabsContent value="resolved">
              {renderReportTable(
                searchQuery
                  ? filteredReports.filter((r) => r.status === "resolved")
                  : resolvedReports
              )}
            </TabsContent>

            <TabsContent value="dismissed">
              {renderReportTable(
                searchQuery
                  ? filteredReports.filter((r) => r.status === "dismissed")
                  : dismissedReports
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog open={!!actionDialog} onOpenChange={() => setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog === "view" && "Report Details"}
              {actionDialog === "resolve" && "Resolve Report"}
              {actionDialog === "dismiss" && "Dismiss Report"}
            </DialogTitle>
            <DialogDescription>
              Report ID: {selectedReport?.id}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Reported Item:</p>
              <p className="text-gray-900">{selectedReport?.reportedItem}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Reported By:</p>
              <p className="text-gray-900">{selectedReport?.reportedBy}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Reason:</p>
              <p className="text-gray-900">{selectedReport?.reason}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Description:</p>
              <p className="text-gray-900">{selectedReport?.description}</p>
            </div>

            {actionDialog === "resolve" && (
              <div className="space-y-2">
                <label className="text-sm text-gray-700">Resolution Details</label>
                <Textarea
                  placeholder="Enter resolution details (will be sent to reporter)..."
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  rows={4}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>
              {actionDialog === "view" ? "Close" : "Cancel"}
            </Button>
            {actionDialog !== "view" && (
              <Button
                onClick={confirmAction}
                className={
                  actionDialog === "resolve"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-red-600 hover:bg-red-700"
                }
              >
                Confirm
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}