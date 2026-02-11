import { useState } from "react";
import { useNavigate } from "react-router";
import { useOrderStore, SalesOrder } from "../store";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Sparkles, ChevronDown, ChevronUp, Package } from "lucide-react";
import { formatTime } from "../formatTime";

export function PickerList() {
  const { orders } = useOrderStore();
  const navigate = useNavigate();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Filter orders that are Pending Picker Duties or later
  const pickerOrders = orders.filter(
    (order) =>
      order.status === "Pending Picker Duties" ||
      order.status === "Pending Packer Duties" ||
      order.status === "Pending Shipper Duties" ||
      order.status === "Shipped"
  );

  const getStatusBadge = (status: string) => {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          status === "Pending Picker Duties"
            ? "bg-yellow-100 text-yellow-800"
            : status === "Shipped"
            ? "bg-green-100 text-green-800"
            : "bg-blue-100 text-blue-800"
        }`}
      >
        {status}
      </span>
    );
  };

  const toggleOrder = (orderId: string) => {
    setSelectedOrderId(selectedOrderId === orderId ? null : orderId);
  };

  const renderDetailPanel = (order: SalesOrder) => (
    <TableRow>
      <TableCell colSpan={4} className="bg-gray-50 p-0">
        <div className="p-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Order ID</h4>
              <p className="text-sm text-gray-600">{order.id}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Status</h4>
              <p className="text-sm">{getStatusBadge(order.status)}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Total SKUs</h4>
              <p className="text-sm text-gray-600">{order.products.length}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Total Quantity</h4>
              <p className="text-sm text-gray-600">{order.products.reduce((sum, p) => sum + p.quantity, 0)}</p>
            </div>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {order.plannerStartTime && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-1">Planner Timeline</h4>
                <p className="text-sm text-gray-600">
                  Start: {formatTime(order.plannerStartTime)} | End: {formatTime(order.plannerEndTime)}
                </p>
              </div>
            )}
            {order.pickerStartTime && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-1">Picker Timeline</h4>
                <p className="text-sm text-gray-600">
                  Start: {formatTime(order.pickerStartTime)} | End: {formatTime(order.pickerEndTime)}
                </p>
              </div>
            )}
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
              <Package className="w-4 h-4" /> Products
            </h4>
            <div className="bg-white rounded border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left p-2 font-medium text-gray-600">SKU</th>
                    <th className="text-left p-2 font-medium text-gray-600">Quantity</th>
                    <th className="text-left p-2 font-medium text-gray-600">Availability</th>
                    <th className="text-left p-2 font-medium text-gray-600">Pick Status</th>
                  </tr>
                </thead>
                <tbody>
                  {order.products.map((product) => (
                    <tr key={product.sku} className="border-b border-gray-100 last:border-0">
                      <td className="p-2 font-medium">{product.sku}</td>
                      <td className="p-2">{product.quantity}</td>
                      <td className="p-2">
                        {product.availability ? (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${product.availability === "Yes" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                            {product.availability}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="p-2">
                        {product.pickStatusReady ? (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${product.pickStatusReady === "Yes" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                            {product.pickStatusReady}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <div>
      <h1 className="text-3xl mb-9.5">Picker — Sales Orders</h1>

      <div className="bg-white rounded-lg shadow p-3">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Sales Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead><span className="inline-flex items-center gap-1"><Sparkles className="w-4 h-4 text-emerald-600" />AI's Remarks</span></TableHead>
              <TableHead className="w-[120px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pickerOrders.map((order) => (
              <>
                <TableRow
                  key={order.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleOrder(order.id)}
                >
                  <TableCell className="font-medium">
                    <span className="inline-flex items-center gap-1">
                      {selectedOrderId === order.id ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                      {order.id}
                    </span>
                  </TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-gray-600">{order.remarks || "—"}</TableCell>
                  <TableCell>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/picker/${order.id}`);
                      }}
                      variant="outline"
                      size="sm"
                      disabled={order.status !== "Pending Picker Duties"}
                    >
                      Update
                    </Button>
                  </TableCell>
                </TableRow>
                {selectedOrderId === order.id && renderDetailPanel(order)}
              </>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
