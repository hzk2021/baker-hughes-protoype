import { useState } from "react";
import { useNavigate } from "react-router";
import { useOrderStore } from "../store";
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

export function ShipperList() {
  const { orders } = useOrderStore();
  const navigate = useNavigate();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const shipperOrders = orders.filter(
    (order) =>
      order.status === "Pending Shipper Duties" || order.status === "Shipped"
  );

  const selectedOrder = selectedOrderId ? shipperOrders.find(o => o.id === selectedOrderId) : null;

  const getStatusBadge = (status: string) => {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          status === "Pending Shipper Duties"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-green-100 text-green-800"
        }`}
      >
        {status}
      </span>
    );
  };

  const toggleOrder = (orderId: string) => {
    setSelectedOrderId(selectedOrderId === orderId ? null : orderId);
  };

  return (
    <div>
      <h1 className="text-3xl mb-9.5">Shipper — Sales Orders</h1>

      {selectedOrder && (
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Order ID</h4>
              <p className="text-sm text-gray-600">{selectedOrder.id}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Status</h4>
              <p className="text-sm">{getStatusBadge(selectedOrder.status)}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Total SKUs</h4>
              <p className="text-sm text-gray-600">{selectedOrder.products.length}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Total Quantity</h4>
              <p className="text-sm text-gray-600">{selectedOrder.products.reduce((sum, p) => sum + p.quantity, 0)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            {selectedOrder.plannerStartTime && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-1">Planner Timeline</h4>
                <p className="text-sm text-gray-600">
                  Start: {formatTime(selectedOrder.plannerStartTime)}<br />
                  End: {formatTime(selectedOrder.plannerEndTime)}
                </p>
              </div>
            )}
            {selectedOrder.pickerStartTime && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-1">Picker Timeline</h4>
                <p className="text-sm text-gray-600">
                  Start: {formatTime(selectedOrder.pickerStartTime)}<br />
                  End: {formatTime(selectedOrder.pickerEndTime)}
                </p>
              </div>
            )}
            {selectedOrder.packerStartTime && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-1">Packer Timeline</h4>
                <p className="text-sm text-gray-600">
                  Start: {formatTime(selectedOrder.packerStartTime)}<br />
                  End: {formatTime(selectedOrder.packerEndTime)}
                </p>
              </div>
            )}
            {selectedOrder.shipperStartTime && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-1">Shipper Timeline</h4>
                <p className="text-sm text-gray-600">
                  Start: {formatTime(selectedOrder.shipperStartTime)}<br />
                  End: {formatTime(selectedOrder.shipperEndTime)}
                </p>
              </div>
            )}
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
              <Package className="w-4 h-4" /> Products
            </h4>
            <div className="bg-gray-50 rounded border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left p-2 font-medium text-gray-600">SKU</th>
                    <th className="text-left p-2 font-medium text-gray-600">Quantity</th>
                    <th className="text-left p-2 font-medium text-gray-600">Pack Status</th>
                    <th className="text-left p-2 font-medium text-gray-600">Ship Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.products.map((product) => (
                    <tr key={product.sku} className="border-b border-gray-100 last:border-0">
                      <td className="p-2 font-medium">{product.sku}</td>
                      <td className="p-2">{product.quantity}</td>
                      <td className="p-2">
                        {product.packStatusReady ? (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${product.packStatusReady === "Yes" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                            {product.packStatusReady}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="p-2">
                        {product.shipStatus ? (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${product.shipStatus === "Yes" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                            {product.shipStatus}
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
      )}

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
            {shipperOrders.map((order) => (
              <TableRow
                key={order.id}
                className={`cursor-pointer hover:bg-gray-50 ${selectedOrderId === order.id ? "bg-emerald-50" : ""}`}
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
                      navigate(`/shipper/${order.id}`);
                    }}
                    variant="outline"
                    size="sm"
                    disabled={order.status !== "Pending Shipper Duties"}
                  >
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
