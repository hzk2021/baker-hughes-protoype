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
import { Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { formatTime } from "../formatTime";

export function ShipperDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOrder, updateOrder } = useOrderStore();
  const order = getOrder(id!);

  const [products, setProducts] = useState(order?.products || []);
  const [expandedSkuIndex, setExpandedSkuIndex] = useState<number | null>(null);
  useEffect(() => {
    if (order) {
      setProducts(order.products);
    }
  }, [order]);

  if (!order) {
    return (
      <div>
        <h1 className="text-3xl mb-6">Order Not Found</h1>
        <Button onClick={() => navigate("/shipper")}>Back to List</Button>
      </div>
    );
  }

  const handleSubmit = () => {
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");
    updateOrder(id!, {
      products,
      status: "Shipped",
      shipperStartTime: order.shipperStartTime || now,
      shipperEndTime: now,
    });
    toast.success("Shipper duties completed successfully", {
      description: `Order ${id} has been marked as Shipped.`,
    });
    navigate("/shipper");
  };

  const updateProduct = (
    index: number,
    field: "shipperRemarks" | "shipStatus",
    value: string
  ) => {
    const newProducts = [...products];
    newProducts[index] = { ...newProducts[index], [field]: value };
    setProducts(newProducts);
  };

  const toggleSkuDetail = (index: number) => {
    setExpandedSkuIndex(expandedSkuIndex === index ? null : index);
  };

  const packedReadyCount = products.filter(p => p.packStatusReady === "Yes").length;
  const pickedReadyCount = products.filter(p => p.pickStatusReady === "Yes").length;
  const availableCount = products.filter(p => p.availability === "Yes").length;

  return (
    <div>
      <h1 className="text-3xl mb-6">{order.id} — Ship Items</h1>

      {/* Packer's Remarks */}
      {order.packerRemarks && (
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-gray-900 mb-2">Packer's Remarks</h3>
          <p className="text-sm text-gray-700">{order.packerRemarks}</p>
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
              • <strong>Packer:</strong> Completed on {formatTime(order.packerEndTime)}. {packedReadyCount}/{products.length} SKUs packed and ready.
              <br />
              <br />
              All items are packed and ready for shipment. Please verify packaging integrity and confirm ship status for each SKU. Update tracking information in remarks if applicable.
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
              <TableHead className=" w-[140px]">Pack Status Ready</TableHead>
              <TableHead className="w-[140px]">Ship Status</TableHead>
              <TableHead className="">Packer's Remarks</TableHead>
              <TableHead className="">Your Remarks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product, index) => (
              <>
                <TableRow key={product.sku} className="cursor-pointer hover:bg-gray-50" onClick={() => toggleSkuDetail(index)}>
                  <TableCell className="font-medium">
                    <span className="inline-flex items-center gap-1">
                      {expandedSkuIndex === index ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                      {product.sku}
                    </span>
                  </TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>
                    <div className="flex">
                      <Badge
                        variant={product.packStatusReady === "Yes" ? "default" : "destructive"}
                      >
                        {product.packStatusReady || "N/A"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Select
                      value={product.shipStatus || ""}
                      onValueChange={(value) =>
                        updateProduct(index, "shipStatus", value)
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
                  <TableCell className="text-sm text-gray-600">
                    {product.packerRemarks || "—"}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Input
                      placeholder="Enter remarks..."
                      value={product.shipperRemarks || ""}
                      onChange={(e) =>
                        updateProduct(index, "shipperRemarks", e.target.value)
                      }
                    />
                  </TableCell>
                </TableRow>
                {expandedSkuIndex === index && (
                  <TableRow>
                    <TableCell colSpan={6} className="bg-gray-50 p-0">
                      <div className="p-4 border-t border-gray-200">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">SKU History — {product.sku}</h4>
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <h5 className="text-xs font-semibold text-gray-500 uppercase mb-1">Planner Stage</h5>
                            <div className="bg-white rounded border border-gray-200 p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs text-gray-500">Availability:</span>
                                <Badge variant={product.availability === "Yes" ? "default" : "destructive"}>
                                  {product.availability || "N/A"}
                                </Badge>
                              </div>
                              <div className="text-xs text-gray-500 mb-1">Remarks:</div>
                              <p className="text-sm text-gray-700">{product.plannerRemarks || "—"}</p>
                            </div>
                          </div>
                          <div>
                            <h5 className="text-xs font-semibold text-gray-500 uppercase mb-1">Picker Stage</h5>
                            <div className="bg-white rounded border border-gray-200 p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs text-gray-500">Pick Status:</span>
                                <Badge variant={product.pickStatusReady === "Yes" ? "default" : "destructive"}>
                                  {product.pickStatusReady || "N/A"}
                                </Badge>
                              </div>
                              <div className="text-xs text-gray-500 mb-1">Remarks:</div>
                              <p className="text-sm text-gray-700">{product.pickerRemarks || "—"}</p>
                            </div>
                          </div>
                          <div>
                            <h5 className="text-xs font-semibold text-gray-500 uppercase mb-1">Packer Stage</h5>
                            <div className="bg-white rounded border border-gray-200 p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs text-gray-500">Pack Status:</span>
                                <Badge variant={product.packStatusReady === "Yes" ? "default" : "destructive"}>
                                  {product.packStatusReady || "N/A"}
                                </Badge>
                              </div>
                              <div className="text-xs text-gray-500 mb-1">Remarks:</div>
                              <p className="text-sm text-gray-700">{product.packerRemarks || "—"}</p>
                            </div>
                          </div>
                          <div>
                            <h5 className="text-xs font-semibold text-gray-500 uppercase mb-1">Timeline</h5>
                            <div className="bg-white rounded border border-gray-200 p-3">
                              <p className="text-sm text-gray-600">
                                <span className="text-xs text-gray-500">Planner:</span> {formatTime(order.plannerStartTime)} — {formatTime(order.plannerEndTime)}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                <span className="text-xs text-gray-500">Picker:</span> {formatTime(order.pickerStartTime)} — {formatTime(order.pickerEndTime)}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                <span className="text-xs text-gray-500">Packer:</span> {formatTime(order.packerStartTime)} — {formatTime(order.packerEndTime)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>

        <div className="flex gap-3 mt-6">
          <Button onClick={handleSubmit} size="lg">
            Submit
          </Button>
          <Button onClick={() => navigate("/shipper")} variant="outline" size="lg">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
