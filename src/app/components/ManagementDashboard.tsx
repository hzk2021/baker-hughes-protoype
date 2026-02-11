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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

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
      orderDate = order.plannerStartTime.split(" ")[0];
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
  const pendingPickerCount = orders.filter(o => o.status === "Pending Picker Duties").length;
  const pendingPackerCount = orders.filter(o => o.status === "Pending Packer Duties").length;
  const pendingShipperCount = orders.filter(o => o.status === "Pending Shipper Duties").length;
  const inProgressCount = orders.length - shippedCount - pendingPlanningCount;

  // Chart data
  const statusDistributionData = [
    { name: "Pending Planning", value: pendingPlanningCount },
    { name: "Pending Picker", value: pendingPickerCount },
    { name: "Pending Packer", value: pendingPackerCount },
    { name: "Pending Shipper", value: pendingShipperCount },
    { name: "Shipped", value: shippedCount },
  ].filter(d => d.value > 0);

  const PIE_COLORS = ["#9CA3AF", "#F59E0B", "#3B82F6", "#8B5CF6", "#10B981"];

  const skuCountData = orders.map(order => ({
    name: order.id.replace("SO-20260211-", "SO-"),
    skus: order.products.length,
    quantity: order.products.reduce((sum, p) => sum + p.quantity, 0),
  }));

  // Dummy weekly throughput data
  const weeklyThroughputData = [
    { day: "Mon", planned: 5, picked: 4, packed: 3, shipped: 2 },
    { day: "Tue", planned: 7, picked: 6, packed: 5, shipped: 4 },
    { day: "Wed", planned: 4, picked: 4, packed: 3, shipped: 3 },
    { day: "Thu", planned: 8, picked: 7, packed: 6, shipped: 5 },
    { day: "Fri", planned: 6, picked: 5, packed: 5, shipped: 4 },
    { day: "Sat", planned: 3, picked: 3, packed: 2, shipped: 2 },
    { day: "Sun", planned: 2, picked: 1, packed: 1, shipped: 1 },
  ];

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

      {/* Summary Cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Pending Planning</p>
          <p className="text-2xl font-bold text-gray-600">{pendingPlanningCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">In Progress</p>
          <p className="text-2xl font-bold text-yellow-600">{inProgressCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Shipped</p>
          <p className="text-2xl font-bold text-green-600">{shippedCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Total SKUs</p>
          <p className="text-2xl font-bold text-blue-600">{orders.reduce((sum, o) => sum + o.products.length, 0)}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Order Status Distribution - Pie Chart */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-gray-800 mb-4">Order Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusDistributionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {statusDistributionData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* SKU & Quantity per Order - Bar Chart */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-gray-800 mb-4">SKUs & Quantity per Order</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={skuCountData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="skus" fill="#3B82F6" name="SKU Count" />
              <Bar dataKey="quantity" fill="#10B981" name="Total Quantity" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly Throughput - Line Chart */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h3 className="font-semibold text-gray-800 mb-1">Weekly Throughput</h3>
        <p className="text-xs text-gray-400 mb-4">
          <em>Dummy data — will be replaced with real metrics</em>
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={weeklyThroughputData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="planned" stroke="#9CA3AF" name="Planned" strokeWidth={2} />
            <Line type="monotone" dataKey="picked" stroke="#F59E0B" name="Picked" strokeWidth={2} />
            <Line type="monotone" dataKey="packed" stroke="#3B82F6" name="Packed" strokeWidth={2} />
            <Line type="monotone" dataKey="shipped" stroke="#10B981" name="Shipped" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
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
