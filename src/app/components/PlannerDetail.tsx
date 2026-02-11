import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
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

export function PlannerDetail() {
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
        <Button onClick={() => navigate("/planner")}>Back to List</Button>
      </div>
    );
  }

  const handleSubmit = () => {
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");
    updateOrder(id!, {
      products,
      status: "Pending Picker Duties",
      plannerStartTime: order.plannerStartTime || now,
      plannerEndTime: now,
    });
    toast.success("Planner duties completed successfully", {
      description: `Order ${id} has been forwarded to Picker for processing.`,
    });
    navigate("/planner");
  };

  const updateProduct = (
    index: number,
    field: "availability" | "plannerRemarks",
    value: string
  ) => {
    const newProducts = [...products];
    newProducts[index] = { ...newProducts[index], [field]: value };
    setProducts(newProducts);
  };

  return (
    <div>
      <h1 className="text-3xl mb-6">{order.id} — Availability Check</h1>

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
              Order {order.id} contains {order.products.length} product SKUs with a total quantity of {order.products.reduce((sum, p) => sum + p.quantity, 0)} items. 
              This order is currently awaiting availability verification. Please review each SKU and confirm stock availability before proceeding to the picking stage.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">Product SKU</TableHead>
              <TableHead className=" w-[150px]">Quantity</TableHead>
              <TableHead className=" w-[180px]">Availability</TableHead>
              <TableHead className="">Your Remarks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product, index) => (
              <TableRow key={product.sku}>
                <TableCell className=" font-medium">{product.sku}</TableCell>
                <TableCell className="">{product.quantity}</TableCell>
                <TableCell className="">
                  <Select
                    value={product.availability || ""}
                    onValueChange={(value) =>
                      updateProduct(index, "availability", value)
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
                <TableCell className="">
                  <Input
                    placeholder="Enter remarks..."
                    value={product.plannerRemarks || ""}
                    onChange={(e) =>
                      updateProduct(index, "plannerRemarks", e.target.value)
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
          <Button onClick={() => navigate("/planner")} variant="outline" size="lg">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}