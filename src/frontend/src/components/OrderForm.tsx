import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  CheckCircle,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { OrderItem } from "../App";
import { formatCurrency } from "../lib/formatCurrency";
import { formatWhatsAppMessage } from "../lib/formatWhatsAppMessage";
import { openWhatsApp } from "../lib/openWhatsApp";

interface OrderFormProps {
  orderItems: OrderItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onClearOrder: () => void;
}

interface ContactDetails {
  name: string;
  phone: string;
}

export default function OrderForm({
  orderItems,
  onUpdateQuantity,
  onClearOrder,
}: OrderFormProps) {
  const [contactDetails, setContactDetails] = useState<ContactDetails>({
    name: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPrice = orderItems.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0,
  );

  const handleInputChange = (field: keyof ContactDetails, value: string) => {
    setContactDetails((prev) => ({ ...prev, [field]: value }));
  };

  const getSubOptionLabel = (item: OrderItem, optionId: string): string => {
    const option = item.menuItem.subOptions?.find((opt) => opt.id === optionId);
    return option?.label || optionId;
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (orderItems.length === 0) {
      toast.error("Your cart is empty", {
        description: "Please add items to your order first.",
      });
      return;
    }

    if (!contactDetails.name || !contactDetails.phone) {
      toast.error("Missing information", {
        description: "Please fill in all delivery details.",
      });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const message = formatWhatsAppMessage(
        orderItems,
        totalPrice,
        contactDetails.name,
        contactDetails.phone,
      );
      openWhatsApp(message);

      toast.success("Order sent! We'll be in touch shortly.", {
        icon: <CheckCircle className="h-5 w-5" />,
      });

      setContactDetails({ name: "", phone: "" });
      onClearOrder();
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <section id="order" className="py-12 sm:py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 inline-block bg-primary text-primary-foreground px-5 py-2 rounded-full">
            Place Your Order
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mt-3">
            Review your selections and provide delivery details to complete your
            order.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* ── Order Summary ── */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <ShoppingCart className="h-5 w-5" />
                Order Summary
              </CardTitle>
              <CardDescription>
                {orderItems.length === 0
                  ? "Your cart is empty"
                  : `${orderItems.length} item${orderItems.length !== 1 ? "s" : ""} in your cart`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {orderItems.length === 0 ? (
                <div
                  className="text-center py-10 sm:py-12 text-muted-foreground"
                  data-ocid="order.empty_state"
                >
                  <ShoppingCart className="h-14 w-14 sm:h-16 sm:w-16 mx-auto mb-4 opacity-20" />
                  <p>Add items from the menu to get started</p>
                </div>
              ) : (
                <>
                  <ScrollArea className="h-[280px] sm:h-[340px] lg:h-[400px] pr-2 sm:pr-4">
                    <div
                      className="space-y-3 sm:space-y-4"
                      data-ocid="order.list"
                    >
                      {orderItems.map((item, index) => (
                        <div
                          key={`${item.menuItem.id}-${index}`}
                          data-ocid={`order.item.${index + 1}`}
                          className="flex gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <img
                            src={item.menuItem.image}
                            alt={item.menuItem.name}
                            className="w-14 h-14 sm:w-20 sm:h-20 object-cover rounded-md flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm mb-1 truncate">
                              {item.menuItem.name}
                            </h4>
                            {item.selectedSubOptions.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {item.selectedSubOptions.map((optionId) => (
                                  <Badge
                                    key={optionId}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {getSubOptionLabel(item, optionId)}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <div className="flex items-center gap-1 sm:gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7 sm:h-6 sm:w-6 min-h-[28px] min-w-[28px]"
                                  data-ocid={`order.secondary_button.${index + 1}`}
                                  onClick={() =>
                                    onUpdateQuantity(index, item.quantity - 1)
                                  }
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="text-sm font-medium w-6 text-center">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-7 w-7 sm:h-6 sm:w-6 min-h-[28px] min-w-[28px]"
                                  data-ocid={`order.secondary_button.${index + 1}`}
                                  onClick={() =>
                                    onUpdateQuantity(index, item.quantity + 1)
                                  }
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="flex items-center gap-1 sm:gap-2">
                                <span className="text-sm font-semibold">
                                  {formatCurrency(
                                    item.menuItem.price * item.quantity,
                                  )}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 sm:h-6 sm:w-6 min-h-[28px] min-w-[28px] text-destructive hover:text-destructive"
                                  data-ocid={`order.delete_button.${index + 1}`}
                                  onClick={() => onUpdateQuantity(index, 0)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">
                        {formatCurrency(totalPrice)}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full mt-4 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground min-h-[44px]"
                    data-ocid="order.delete_button"
                    onClick={onClearOrder}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Order
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* ── Contact & Order Column ── */}
          <div className="space-y-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Delivery Details
                </CardTitle>
                <CardDescription>
                  Enter your contact information and send your order via
                  WhatsApp.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitOrder} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      data-ocid="order.input"
                      placeholder="Your full name"
                      value={contactDetails.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      required
                      className="input-no-zoom"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      data-ocid="order.input"
                      type="tel"
                      placeholder="e.g. 08123456789"
                      value={contactDetails.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      required
                      className="input-no-zoom"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full min-h-[44px]"
                    data-ocid="order.submit_button"
                    disabled={orderItems.length === 0 || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <ArrowRight className="h-4 w-4 mr-2 animate-pulse" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Send Order via WhatsApp
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
