import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShoppingCart, Trash2, Plus, Minus, CheckCircle, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '../lib/formatCurrency';
import type { OrderItem } from '../App';

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
    name: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const totalPrice = orderItems.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );

  const handleInputChange = (
    field: keyof ContactDetails,
    value: string
  ) => {
    setContactDetails((prev) => ({ ...prev, [field]: value }));
  };

  const getSubOptionLabel = (item: OrderItem, optionId: string): string => {
    const option = item.menuItem.subOptions?.find((opt) => opt.id === optionId);
    return option?.label || optionId;
  };

  const handlePaymentConfirmation = () => {
    if (!contactDetails.name || !contactDetails.phone) {
      toast.error('Missing information', {
        description: 'Please fill in all delivery details first.',
      });
      return;
    }

    if (orderItems.length === 0) {
      toast.error('Your cart is empty', {
        description: 'Please add items to your order first.',
      });
      return;
    }

    setPaymentConfirmed(true);
    toast.success('Payment confirmed!', {
      description: 'Please submit your order to complete.',
      icon: <CheckCircle className="h-5 w-5" />,
    });
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (orderItems.length === 0) {
      toast.error('Your cart is empty', {
        description: 'Please add items to your order first.',
      });
      return;
    }

    if (!contactDetails.name || !contactDetails.phone) {
      toast.error('Missing information', {
        description: 'Please fill in all delivery details.',
      });
      return;
    }

    if (!paymentConfirmed) {
      toast.error('Payment not confirmed', {
        description: 'Please confirm your payment before submitting.',
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate order processing
    setTimeout(() => {
      const order = {
        items: orderItems,
        contact: contactDetails,
        total: totalPrice,
        timestamp: new Date().toISOString(),
        paymentConfirmed: true,
      };

      // Save to localStorage
      const existingOrders = JSON.parse(
        localStorage.getItem('dimSumOrders') || '[]'
      );
      existingOrders.push(order);
      localStorage.setItem('dimSumOrders', JSON.stringify(existingOrders));

      toast.success('Order placed successfully!', {
        description: `Total: ${formatCurrency(totalPrice)}. We'll contact you shortly.`,
        icon: <CheckCircle className="h-5 w-5" />,
      });

      // Reset form
      setContactDetails({
        name: '',
        phone: '',
      });
      setPaymentConfirmed(false);
      onClearOrder();
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section id="order" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 inline-block bg-primary text-primary-foreground px-6 py-2 rounded-full">
            Place Your Order
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Review your selections and provide delivery details to complete your order.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Order Summary
              </CardTitle>
              <CardDescription>
                {orderItems.length === 0
                  ? 'Your cart is empty'
                  : `${orderItems.length} item${orderItems.length !== 1 ? 's' : ''} in your cart`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {orderItems.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <ShoppingCart className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <p>Add items from the menu to get started</p>
                </div>
              ) : (
                <>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {orderItems.map((item, index) => (
                        <div
                          key={`${item.menuItem.id}-${index}`}
                          className="flex gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <img
                            src={item.menuItem.image}
                            alt={item.menuItem.name}
                            className="w-20 h-20 object-cover rounded-md flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm mb-1">
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
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6"
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
                                  className="h-6 w-6"
                                  onClick={() =>
                                    onUpdateQuantity(index, item.quantity + 1)
                                  }
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold">
                                  {formatCurrency(item.menuItem.price * item.quantity)}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 text-destructive hover:text-destructive"
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
                      <span className="text-primary">{formatCurrency(totalPrice)}</span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full mt-4 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={onClearOrder}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Order
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Contact & Payment Form */}
          <div className="space-y-6">
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Delivery Details</CardTitle>
                <CardDescription>
                  Enter your contact information for order confirmation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitOrder} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Your full name"
                      value={contactDetails.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="e.g. 08123456789"
                      value={contactDetails.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                    />
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* QRIS Payment */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  Payment via QRIS
                </CardTitle>
                <CardDescription>
                  Scan the QR code below to complete your payment.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <div className="p-3 bg-white rounded-xl border-2 border-muted inline-block">
                    <img
                      src="/assets/generated/qris-payment-code.dim_300x300.png"
                      alt="QRIS Payment Code"
                      className="w-48 h-48 object-contain"
                    />
                  </div>
                </div>
                {totalPrice > 0 && (
                  <div className="text-center p-3 bg-primary/10 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Amount to pay</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(totalPrice)}
                    </p>
                  </div>
                )}
                <Button
                  type="button"
                  variant={paymentConfirmed ? 'secondary' : 'default'}
                  className="w-full"
                  onClick={handlePaymentConfirmation}
                  disabled={paymentConfirmed}
                >
                  {paymentConfirmed ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Payment Confirmed
                    </>
                  ) : (
                    'I Have Paid'
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Submit Order */}
            <Button
              type="submit"
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleSubmitOrder}
              disabled={isSubmitting || !paymentConfirmed || orderItems.length === 0}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                'Submit Order'
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
