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
import { Sparkles } from "lucide-react";

export function PackerList() {
  const { orders } = useOrderStore();
  const navigate = useNavigate();

  // Filter orders that are Pending Packer Duties or later
  const packerOrders = orders.filter(
    (order) =>
      order.status === "Pending Packer Duties" ||
      order.status === "Pending Shipper Duties" ||
      order.status === "Shipped"
  );

  const getStatusBadge = (status: string) => {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          status === "Pending Packer Duties"
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

  return (
    <div>
      <h1 className="text-3xl mb-9.5">Packer — Sales Orders</h1>

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
            {packerOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>
                  {getStatusBadge(order.status)}
                </TableCell>
                <TableCell className="text-gray-600">{order.remarks || "—"}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => navigate(`/packer/${order.id}`)}
                    variant="outline"
                    size="sm"
                    disabled={order.status !== "Pending Packer Duties"}
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