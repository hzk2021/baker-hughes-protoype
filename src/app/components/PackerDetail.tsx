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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { formatTime } from "../formatTime";

export function PackerDetail() {
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
        <Button onClick={() => navigate("/packer")}>Back to List</Button>
      </div>
    );
  }

  const handleSubmit = () => {
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");
    updateOrder(id!, {
      products,
      status: "Pending Shipper Duties",
      packerStartTime: order.packerStartTime || now,
      packerEndTime: now,
    });
    toast.success("Packer duties completed successfully", {
      description: `Order ${id} has been forwarded to Shipper for processing.`,
    });
    navigate("/packer");
  };

  const updateProduct = (
    index: number,
    field: "packerRemarks" | "packStatusReady",
    value: string
  ) => {
    const newProducts = [...products];
    newProducts[index] = { ...newProducts[index], [field]: value };
    setProducts(newProducts);
  };

  const pickedReadyCount = products.filter(p => p.pickStatusReady === "Yes").length;
  const availableCount = products.filter(p => p.availability === "Yes").length;

  return (
    <div>
      <h1 className="text-3xl mb-6">{order.id} — Pack Items</h1>

      {/* Picker's Remarks */}
      {order.pickerRemarks && (
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-gray-900 mb-2">Picker's Remarks</h3>
          <p className="text-sm text-gray-700">{order.pickerRemarks}</p>
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
              <strong>Previous Stages:</strong>
              <br />
              • <strong>Planner:</strong> Completed on {formatTime(order.plannerEndTime)}. {availableCount}/{products.length} SKUs confirmed available.
              <br />
              • <strong>Picker:</strong> Completed on {formatTime(order.pickerEndTime)}. {pickedReadyCount}/{products.length} SKUs picked successfully.
              <br />
              <br />
              Please verify all picked items and update pack status. Ensure proper packaging for each SKU before marking as ready.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">Product SKU</TableHead>
              <TableHead className=" w-[100px]">Quantity</TableHead>
              <TableHead className=" w-[140px]">Pick Status Ready</TableHead>
              <TableHead className="w-[160px]">Pack Status Ready</TableHead>
              <TableHead className="">Picker's Remarks</TableHead>
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
                      variant={product.pickStatusReady === "Yes" ? "default" : "destructive"}
                    >
                      {product.pickStatusReady || "N/A"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="">
                  <Select
                    value={product.packStatusReady || ""}
                    onValueChange={(value) =>
                      updateProduct(index, "packStatusReady", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className=" text-sm text-gray-600">
                  {product.pickerRemarks || "—"}
                </TableCell>
                <TableCell className="">
                  <Input
                    placeholder="Enter remarks..."
                    value={product.packerRemarks || ""}
                    onChange={(e) =>
                      updateProduct(index, "packerRemarks", e.target.value)
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
          <Button onClick={() => navigate("/packer")} variant="outline" size="lg">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}