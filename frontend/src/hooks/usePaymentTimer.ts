import { useState, useEffect, useRef } from 'react';

const ORDER_STORAGE_KEY = 'dimSumActiveOrder';

export interface ActiveOrder {
  expiryTimestamp: number; // Unix ms
  paymentStatus: 'pending' | 'paid' | 'expired';
  contactName: string;
  contactPhone: string;
  total: number;
}

export function saveActiveOrder(order: ActiveOrder) {
  localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));
}

export function loadActiveOrder(): ActiveOrder | null {
  try {
    const raw = localStorage.getItem(ORDER_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ActiveOrder;
  } catch {
    return null;
  }
}

export function clearActiveOrder() {
  localStorage.removeItem(ORDER_STORAGE_KEY);
}

export function markOrderPaid() {
  const order = loadActiveOrder();
  if (order) {
    saveActiveOrder({ ...order, paymentStatus: 'paid' });
  }
}

interface UsePaymentTimerReturn {
  secondsRemaining: number | null;
  isExpired: boolean;
  isPaid: boolean;
  hasActiveOrder: boolean;
  formattedTime: string;
}

export function usePaymentTimer(onExpiry?: () => void): UsePaymentTimerReturn {
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [hasActiveOrder, setHasActiveOrder] = useState(false);
  const onExpiryRef = useRef(onExpiry);
  onExpiryRef.current = onExpiry;

  useEffect(() => {
    const compute = () => {
      const order = loadActiveOrder();
      if (!order) {
        setHasActiveOrder(false);
        setSecondsRemaining(null);
        setIsPaid(false);
        return;
      }

      setHasActiveOrder(true);

      if (order.paymentStatus === 'paid') {
        setIsPaid(true);
        setSecondsRemaining(null);
        return;
      }

      const now = Date.now();
      const remaining = Math.floor((order.expiryTimestamp - now) / 1000);

      if (remaining <= 0) {
        setSecondsRemaining(0);
        setIsPaid(false);
        // Trigger expiry callback
        onExpiryRef.current?.();
        return;
      }

      setSecondsRemaining(remaining);
      setIsPaid(false);
    };

    // Run immediately on mount
    compute();

    const interval = setInterval(compute, 1000);
    return () => clearInterval(interval);
  }, []);

  const isExpired = secondsRemaining !== null && secondsRemaining <= 0;

  const formattedTime = (() => {
    if (secondsRemaining === null || secondsRemaining <= 0) return '00:00:00';
    const h = Math.floor(secondsRemaining / 3600);
    const m = Math.floor((secondsRemaining % 3600) / 60);
    const s = secondsRemaining % 60;
    return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
  })();

  return { secondsRemaining, isExpired, isPaid, hasActiveOrder, formattedTime };
}
