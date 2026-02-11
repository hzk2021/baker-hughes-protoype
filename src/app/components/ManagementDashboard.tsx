import { useState } from "react";
import { useOrderStore } from "../store";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Search, Calendar, Sparkles } from "lucide-react";
import { formatTime } from "../formatTime";

export function ManagementDashboard() {
  const { orders } = useOrderStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.id
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Extract date from plannerStartTime if it exists
    let orderDate = "";
    if (order.plannerStartTime) {
      orderDate = order.plannerStartTime.split(" ")[0]; // Get "2026-02-11" from "2026-02-11 08:15:00"
    }

    const matchesDate = dateFilter ? orderDate === dateFilter : true;
    return matchesSearch && matchesDate;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Shipped":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            {status}
          </Badge>
        );
      case "Pending Planning":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            {status}
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            {status}
          </Badge>
        );
    }
  };

  const shippedCount = orders.filter(o => o.status === "Shipped").length;
  const pendingPlanningCount = orders.filter(o => o.status === "Pending Planning").length;
  const inProgressCount = orders.length - shippedCount - pendingPlanningCount;

  return (
    <div>
      <h1 className="text-3xl mb-6">Management Dashboard</h1>

      {/* AI Summary Section */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-emerald-900 mb-2">AI Summary</h3>
            <p className="text-sm text-emerald-800">
              <em>Note: This is dummy information until real AI integration is implemented.</em>
              <br />
              <br />
              There are currently {orders.length} sales orders in the system.
              {" "}{shippedCount} orders have been shipped, {inProgressCount} are in progress across various stages, and {pendingPlanningCount} are pending planning.
              {" "}Overall workflow throughput is on track. No bottlenecks detected.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search by Sales Order number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <label className="w-64 relative block cursor-pointer">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <Input
              type="date"
              placeholder="Filter by date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="pl-10 cursor-pointer"
            />
          </label>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm("");
              setDateFilter("");
            }}
          >
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Dashboard Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto p-3">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[160px]">Sales Order</TableHead>
              <TableHead className="w-[180px]">Status</TableHead>
              <TableHead className="w-[100px]">SKUs Count</TableHead>
              <TableHead className="w-[160px]">Planner Start</TableHead>
              <TableHead className="w-[160px]">Planner End</TableHead>
              <TableHead className="w-[160px]">Picker Start</TableHead>
              <TableHead className="w-[160px]">Picker End</TableHead>
              <TableHead className="w-[160px]">Packer Start</TableHead>
              <TableHead className="w-[160px]">Packer End</TableHead>
              <TableHead className="w-[160px]">Shipper Start</TableHead>
              <TableHead className="w-[160px]">Shipper End</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>
                  {getStatusBadge(order.status)}
                </TableCell>
                <TableCell>
                  {order.products.length}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {formatTime(order.plannerStartTime)}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {formatTime(order.plannerEndTime)}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {formatTime(order.pickerStartTime)}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {formatTime(order.pickerEndTime)}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {formatTime(order.packerStartTime)}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {formatTime(order.packerEndTime)}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {formatTime(order.shipperStartTime)}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {formatTime(order.shipperEndTime)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No orders found matching your filters.
        </div>
      )}
    </div>
  );
}