import type { OrderItem } from "../App";
import { formatCurrency } from "./formatCurrency";

export function formatWhatsAppMessage(
  orderItems: OrderItem[],
  totalPrice: number,
  customerName: string,
  customerPhone: string,
): string {
  const lines: string[] = [];

  lines.push("*PESANAN BARU - SUMOJI*");
  lines.push("");
  lines.push("*Detail Pesanan :*");

  for (const item of orderItems) {
    const itemTotal = item.menuItem.price * item.quantity;
    lines.push(
      `- ${item.menuItem.name} x${item.quantity} = ${formatCurrency(itemTotal)}`,
    );
    if (item.selectedSubOptions.length > 0) {
      const subLabels = item.selectedSubOptions.map((optId) => {
        const opt = item.menuItem.subOptions?.find((o) => o.id === optId);
        return opt?.label || optId;
      });
      lines.push(`  _(${subLabels.join(", ")})_`);
    }
  }

  lines.push("");
  lines.push("*Total Pesanan :*");
  lines.push(formatCurrency(totalPrice));
  lines.push("");
  lines.push("*Data Pemesan :*");
  lines.push(`Nama : ${customerName}`);
  lines.push(`No. HP : ${customerPhone}`);
  lines.push("");
  lines.push("Terima kasih telah memesan di *SUMOJI*");

  return lines.join("\n");
}
