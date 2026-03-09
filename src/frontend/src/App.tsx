import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Menu from "./components/Menu";
import OrderForm from "./components/OrderForm";

export interface SubOption {
  id: string;
  label: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  subOptions?: SubOption[];
}

export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  selectedSubOptions: string[];
}

function App() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const handleAddToOrder = (
    item: MenuItem,
    quantity: number,
    selectedSubOptions: string[],
  ) => {
    setOrderItems((prev) => {
      const existingIndex = prev.findIndex(
        (oi) =>
          oi.menuItem.id === item.id &&
          JSON.stringify(oi.selectedSubOptions.sort()) ===
            JSON.stringify(selectedSubOptions.sort()),
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [...prev, { menuItem: item, quantity, selectedSubOptions }];
    });
  };

  const handleUpdateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      setOrderItems((prev) => prev.filter((_, i) => i !== index));
    } else {
      setOrderItems((prev) =>
        prev.map((oi, i) => (i === index ? { ...oi, quantity } : oi)),
      );
    }
  };

  const handleClearOrder = () => {
    setOrderItems([]);
  };

  return (
    <div className="min-h-screen">
      <Hero />
      <Menu onAddToOrder={handleAddToOrder} />
      <OrderForm
        orderItems={orderItems}
        onUpdateQuantity={handleUpdateQuantity}
        onClearOrder={handleClearOrder}
      />
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
