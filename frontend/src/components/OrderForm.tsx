import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShoppingCart, Trash2, Plus, Minus, CheckCircle, QrCode, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '../lib/formatCurrency';
import { formatWhatsAppMessage } from '../lib/formatWhatsAppMessage';
import { openWhatsApp } from '../lib/openWhatsApp';
import type { OrderItem } from '../App';
import {
  usePaymentTimer,
  saveActiveOrder,
  clearActiveOrder,
  markOrderPaid,
  loadActiveOrder,
} from '../hooks/usePaymentTimer';

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
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);

  // Track if we've already shown the expiry toast to avoid duplicates
  const [expiryHandled, setExpiryHandled] = useState(false);

  const handleExpiry = useCallback(() => {
    if (expiryHandled) return;
    setExpiryHandled(true);
    clearActiveOrder();
    onClearOrder();
    setPaymentConfirmed(false);
    setIsOrderConfirmed(false);
    toast.error('Order canceled', {
      description: 'Your order has been canceled because payment was not received within 1 hour.',
      duration: 8000,
      icon: <AlertCircle className="h-5 w-5" />,
    });
  }, [expiryHandled, onClearOrder]);

  const { formattedTime, isExpired, isPaid, hasActiveOrder } = usePaymentTimer(handleExpiry);

  // Determine if there's an active pending order (submitted but not yet paid/expired)
  const activeOrder = loadActiveOrder();
  const isAwaitingPayment =
    hasActiveOrder &&
    !isPaid &&
    !isExpired &&
    activeOrder?.paymentStatus === 'pending';

  // Show QR section if order is locally confirmed OR already awaiting payment (persisted)
  const showQRSection = isOrderConfirmed || isAwaitingPayment || isPaid;

  const totalPrice = orderItems.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );

  const handleInputChange = (field: keyof ContactDetails, value: string) => {
    setContactDetails((prev) => ({ ...prev, [field]: value }));
  };

  const getSubOptionLabel = (item: OrderItem, optionId: string): string => {
    const option = item.menuItem.subOptions?.find((opt) => opt.id === optionId);
    return option?.label || optionId;
  };

  const handleConfirmPaymentReceived = () => {
    markOrderPaid();
    setPaymentConfirmed(true);
    toast.success('Payment successful!', {
      description: 'Your order is confirmed. Thank you!',
      icon: <CheckCircle className="h-5 w-5" />,
      duration: 2000,
    });
    // Reload the page after a short delay so the toast is visible
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
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

    setIsOrderConfirmed(true);
    toast.success('Order confirmed!', {
      description: 'Please scan the QR code below to complete your payment.',
      icon: <QrCode className="h-5 w-5" />,
    });
  };

  const handleSubmitOrder = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      const expiryTimestamp = Date.now() + 60 * 60 * 1000; // 1 hour from now

      // Save active order with expiry to localStorage
      saveActiveOrder({
        expiryTimestamp,
        paymentStatus: 'pending',
        contactName: contactDetails.name,
        contactPhone: contactDetails.phone,
        total: totalPrice,
      });

      // Also save to order history
      const order = {
        items: orderItems,
        contact: contactDetails,
        total: totalPrice,
        timestamp: new Date().toISOString(),
        expiryTimestamp,
        paymentStatus: 'pending',
      };
      const existingOrders = JSON.parse(localStorage.getItem('dimSumOrders') || '[]');
      existingOrders.push(order);
      localStorage.setItem('dimSumOrders', JSON.stringify(existingOrders));

      toast.success('Order placed successfully!', {
        description: `Total: ${formatCurrency(totalPrice)}. Please complete payment within 1 hour.`,
        icon: <CheckCircle className="h-5 w-5" />,
      });

      // Send order details to WhatsApp
      const message = formatWhatsAppMessage(
        orderItems,
        totalPrice,
        contactDetails.name,
        contactDetails.phone
      );
      openWhatsApp(message);

      // Reset form fields but keep cart visible until payment confirmed/expired
      setContactDetails({ name: '', phone: '' });
      setExpiryHandled(false);
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

        {/* Payment Status Banner */}
        {isAwaitingPayment && (
          <div className="mb-8 p-4 rounded-xl border-2 border-amber-500/60 bg-amber-50 dark:bg-amber-950/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-amber-600 flex-shrink-0 animate-pulse" />
              <div>
                <p className="font-semibold text-amber-800 dark:text-amber-300">
                  Awaiting Payment
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  Complete your QRIS payment before the timer runs out.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
                Time Remaining
              </span>
              <span className="text-3xl font-mono font-bold text-amber-700 dark:text-amber-300 tabular-nums">
                {formattedTime}
              </span>
            </div>
          </div>
        )}

        {isPaid && (
          <div className="mb-8 p-4 rounded-xl border-2 border-green-500/60 bg-green-50 dark:bg-green-950/30 flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-800 dark:text-green-300">
                Payment Successful!
              </p>
              <p className="text-sm text-green-700 dark:text-green-400">
                Your order has been confirmed. Thank you for your payment!
              </p>
            </div>
          </div>
        )}

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
                                  disabled={isAwaitingPayment || isPaid || isOrderConfirmed}
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
                                  disabled={isAwaitingPayment || isPaid || isOrderConfirmed}
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
                                  disabled={isAwaitingPayment || isPaid || isOrderConfirmed}
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

                  {!isAwaitingPayment && !isPaid && !isOrderConfirmed && (
                    <Button
                      variant="outline"
                      className="w-full mt-4 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={onClearOrder}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear Order
                    </Button>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Contact & Payment Form */}
          <div className="space-y-6">
            {/* Show contact form only when not awaiting payment and not paid and not yet confirmed */}
            {!isAwaitingPayment && !isPaid && !isOrderConfirmed && (
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Delivery Details</CardTitle>
                  <CardDescription>
                    Enter your contact information, then confirm your order to proceed to payment.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleConfirmOrder} className="space-y-4">
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

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={orderItems.length === 0}
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Confirm Order &amp; Proceed to Payment
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* QRIS Payment — only shown after order is confirmed */}
            {showQRSection && (
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="h-5 w-5" />
                    Payment via QRIS
                  </CardTitle>
                  <CardDescription>
                    {isAwaitingPayment
                      ? 'Scan the QR code below to complete your payment before the timer expires.'
                      : isPaid
                      ? 'Payment has been received. Thank you!'
                      : 'Scan the QR code below to complete your payment.'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-center">
                    <div className="p-2 bg-white rounded-xl border-2 border-muted inline-block">
                      <img
                        src="/assets/G191285866-0703A01-default.png"
                        alt="QRIS Payment Code - DIMSUM OJI"
                        className="w-full max-w-xs object-contain rounded-lg"
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

                  {/* Countdown inside payment card when awaiting */}
                  {isAwaitingPayment && (
                    <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700">
                      <Clock className="h-4 w-4 text-amber-600 animate-pulse" />
                      <span className="text-sm text-amber-700 dark:text-amber-300 font-medium">
                        {formattedTime} remaining to complete payment
                      </span>
                    </div>
                  )}

                  <div className="space-y-3">
                    {/* Send to WhatsApp button — shown when order is confirmed but not yet submitted */}
                    {isOrderConfirmed && !isAwaitingPayment && !isPaid && (
                      <Button
                        className="w-full"
                        onClick={handleSubmitOrder}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="animate-spin mr-2">⏳</span>
                            Processing...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Send Order via WhatsApp
                          </>
                        )}
                      </Button>
                    )}

                    {/* Confirm payment received button */}
                    {(isAwaitingPayment || isOrderConfirmed) && !isPaid && !paymentConfirmed && (
                      <Button
                        variant="outline"
                        className="w-full border-green-500 text-green-700 hover:bg-green-50 dark:hover:bg-green-950/30"
                        onClick={handleConfirmPaymentReceived}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirm Payment Received
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
