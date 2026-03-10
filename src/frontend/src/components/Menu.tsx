import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { MenuItem } from "../App";
import { formatCurrency } from "../lib/formatCurrency";

const ingredientOptions = [
  { id: "wortel", label: "Wortel" },
  { id: "jamur", label: "Jamur" },
  { id: "beef", label: "Beef" },
  { id: "cumi", label: "Cumi" },
  { id: "udang", label: "Udang" },
  { id: "kepiting", label: "Kepiting" },
  { id: "telor-puyuh", label: "Telor Puyuh" },
];

const PORSIAN_MAX_SELECTIONS = 5;

const menuItems: MenuItem[] = [
  {
    id: "porsian",
    name: "Porsian",
    description: "1 Porsi isi 5pcs",
    price: 17500,
    image: "/assets/generated/porsian-menu.dim_600x400.png",
    subOptions: ingredientOptions,
  },
  {
    id: "party-pack-40",
    name: "Party Pack 40pcs",
    description: "Party Pack isi 40 pcs",
    price: 130000,
    image: "/assets/generated/party-pack-40pcs-menu.dim_600x400.png",
    subOptions: ingredientOptions,
  },
  {
    id: "party-pack-50",
    name: "Party Pack 50pcs",
    description: "Party Pack isi 50 pcs",
    price: 165000,
    image: "/assets/generated/party-pack-50pcs-menu.dim_600x400.png",
    subOptions: ingredientOptions,
  },
];

interface MenuProps {
  onAddToOrder: (
    item: MenuItem,
    quantity: number,
    selectedSubOptions: string[],
  ) => void;
}

export default function Menu({ onAddToOrder }: MenuProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string[]>
  >({});

  const handleQuantityChange = (itemId: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(1, (prev[itemId] || 1) + delta),
    }));
  };

  const handleSubOptionToggle = (
    itemId: string,
    optionId: string,
    maxSelections?: number,
  ) => {
    setSelectedOptions((prev) => {
      const current = prev[itemId] || [];
      const isSelected = current.includes(optionId);

      if (
        !isSelected &&
        maxSelections !== undefined &&
        current.length >= maxSelections
      ) {
        return prev;
      }

      return {
        ...prev,
        [itemId]: isSelected
          ? current.filter((id) => id !== optionId)
          : [...current, optionId],
      };
    });
  };

  const handleAddToOrder = (item: MenuItem) => {
    const quantity = quantities[item.id] || 1;
    const subOptions = selectedOptions[item.id] || [];

    if (
      item.subOptions &&
      item.subOptions.length > 0 &&
      subOptions.length === 0
    ) {
      toast.error(
        "Please select at least one ingredient before adding to order.",
      );
      return;
    }

    onAddToOrder(item, quantity, subOptions);

    const optionsText =
      subOptions.length > 0
        ? ` with ${subOptions.length} variant${subOptions.length !== 1 ? "s" : ""}`
        : "";

    toast.success(
      `Added ${quantity}x ${item.name}${optionsText} to your order`,
      {
        description: formatCurrency(item.price * quantity),
        style: { background: "#F2E852", color: "#000" },
      },
    );

    setQuantities((prev) => ({ ...prev, [item.id]: 1 }));
    setSelectedOptions((prev) => ({ ...prev, [item.id]: [] }));
  };

  const scrollToOrder = () => {
    document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="menu" className="py-12 sm:py-20 px-4 bg-background">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 inline-block bg-primary text-primary-foreground px-5 py-2 rounded-full">
            Our Menu
          </h2>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-10 sm:mb-12">
          {menuItems.map((item) => {
            const quantity = quantities[item.id] || 1;
            const itemSelectedOptions = selectedOptions[item.id] || [];
            const isPorsian = item.id === "porsian";
            const maxSelections = isPorsian
              ? PORSIAN_MAX_SELECTIONS
              : undefined;
            const reachedMax =
              maxSelections !== undefined &&
              itemSelectedOptions.length >= maxSelections;

            return (
              <Card
                key={item.id}
                className="overflow-hidden hover:shadow-xl transition-shadow duration-300 border-2 hover:border-primary/20"
              >
                <div className="aspect-video sm:aspect-square overflow-hidden bg-muted">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg sm:text-xl">
                    {item.name}
                  </CardTitle>
                  <CardDescription className="text-sm line-clamp-2">
                    {item.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-3 space-y-4">
                  <div className="text-xl sm:text-2xl font-bold text-primary">
                    {formatCurrency(item.price)}
                  </div>

                  {/* Ingredient Options */}
                  {item.subOptions && item.subOptions.length > 0 && (
                    <div className="space-y-2 pt-2 border-t">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Pilih Isian
                        </p>
                        {maxSelections !== undefined && (
                          <p className="text-xs text-muted-foreground">
                            {itemSelectedOptions.length}/{maxSelections}{" "}
                            selected
                          </p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                        {item.subOptions.map((option) => {
                          const isChecked = itemSelectedOptions.includes(
                            option.id,
                          );
                          const isDisabled = !isChecked && reachedMax;

                          return (
                            <div
                              key={option.id}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`${item.id}-${option.id}`}
                                checked={isChecked}
                                disabled={isDisabled}
                                onCheckedChange={() =>
                                  handleSubOptionToggle(
                                    item.id,
                                    option.id,
                                    maxSelections,
                                  )
                                }
                                className="flex-shrink-0"
                              />
                              <Label
                                htmlFor={`${item.id}-${option.id}`}
                                className={`text-sm font-normal leading-none ${
                                  isDisabled
                                    ? "cursor-not-allowed opacity-40"
                                    : "cursor-pointer"
                                }`}
                              >
                                {option.label}
                              </Label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                  {/* Quantity Selector */}
                  <div className="flex items-center justify-center gap-3 w-full">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-11 w-11 min-h-[44px] min-w-[44px]"
                      onClick={() => handleQuantityChange(item.id, -1)}
                      disabled={quantity <= 1}
                      data-ocid={`menu.secondary_button.${item.id}`}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-lg font-semibold w-8 text-center">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-11 w-11 min-h-[44px] min-w-[44px]"
                      onClick={() => handleQuantityChange(item.id, 1)}
                      data-ocid={`menu.secondary_button.${item.id}`}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {/* Add to Order Button */}
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 min-h-[44px] text-sm sm:text-base"
                    onClick={() => handleAddToOrder(item)}
                    disabled={
                      !!(
                        item.subOptions &&
                        item.subOptions.length > 0 &&
                        itemSelectedOptions.length === 0
                      )
                    }
                    data-ocid={"menu.primary_button"}
                  >
                    Add to Order
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* CTA to Order Section */}
        <div className="text-center">
          <Button
            size="lg"
            variant="outline"
            onClick={scrollToOrder}
            data-ocid="menu.secondary_button"
            className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground min-h-[44px] text-sm sm:text-base px-5 sm:px-8"
          >
            View Your Order & Checkout
          </Button>
        </div>
      </div>
    </section>
  );
}
