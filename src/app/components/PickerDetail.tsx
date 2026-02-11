import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useOrderStore } from "../store";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Input } from "./ui/input";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { formatTime } from "../formatTime";

export function PickerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOrder, updateOrder } = useOrderStore();
  const order = getOrder(id!);

  const [products, setProducts] = useState(order?.products || []);
  useEffect(() => {
    if (order) {
      setProducts(order.products);
    }
  }, [order]);

  if (!order) {
    return (
      <div>
        <h1 className="text-3xl mb-6">Order Not Found</h1>
        <Button onClick={() => navigate("/picker")}>Back to List</Button>
      </div>
    );
  }

  const handleSubmit = () => {
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");
    updateOrder(id!, {
      products,
      status: "Pending Packer Duties",
      pickerStartTime: order.pickerStartTime || now,
      pickerEndTime: now,
    });
    toast.success("Picker duties completed successfully", {
      description: `Order ${id} has been forwarded to Packer for processing.`,
    });
    navigate("/picker");
  };

  const updateProduct = (
    index: number,
    field: "pickerRemarks",
    value: string
  ) => {
    const newProducts = [...products];
    newProducts[index] = { ...newProducts[index], [field]: value };
    setProducts(newProducts);
  };

  const availableCount = products.filter(p => p.availability === "Yes").length;

  return (
    <div>
      <h1 className="text-3xl mb-6">{order.id} — Pick Items</h1>

      {/* Planner's Remarks */}
      {order.plannerRemarks && (
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-gray-900 mb-2">Planner's Remarks</h3>
          <p className="text-sm text-gray-700">{order.plannerRemarks}</p>
        </div>
      )}

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
              <strong>Previous Stage (Planner):</strong> Availability check completed on {formatTime(order.plannerEndTime)}. 
              {availableCount} out of {products.length} SKUs are available in stock. 
              Please proceed with picking the available items and update the pick status for each SKU. Items marked as unavailable should be noted in remarks.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">Product SKU</TableHead>
              <TableHead className=" w-[120px]">Quantity</TableHead>
              <TableHead className=" w-[140px]">Availability</TableHead>
              <TableHead className="">Planner's Remarks</TableHead>
              <TableHead className="">Your Remarks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product, index) => (
              <TableRow key={product.sku}>
                <TableCell className=" font-medium">{product.sku}</TableCell>
                <TableCell className="">{product.quantity}</TableCell>
                <TableCell className="">
                  <div className="flex">
                    <Badge
                      variant={product.availability === "Yes" ? "default" : "destructive"}
                    >
                      {product.availability || "N/A"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className=" text-sm text-gray-600">
                  {product.plannerRemarks || "—"}
                </TableCell>
                <TableCell className="">
                  <Input
                    placeholder="Enter remarks..."
                    value={product.pickerRemarks || ""}
                    onChange={(e) =>
                      updateProduct(index, "pickerRemarks", e.target.value)
                    }
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex gap-3 mt-6">
          <Button onClick={handleSubmit} size="lg">
            Submit
          </Button>
          <Button onClick={() => navigate("/picker")} variant="outline" size="lg">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}