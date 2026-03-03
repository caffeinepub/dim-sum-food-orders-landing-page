import { formatCurrency } from './formatCurrency';
import type { OrderItem } from '../App';

export function formatWhatsAppMessage(
  orderItems: OrderItem[],
  totalPrice: number,
  customerName: string,
  customerPhone: string
): string {
  const lines: string[] = [];

  lines.push('🥟 *Pesanan Baru - SUMOJI Dim Sum*');
  lines.push('');
  lines.push('📋 *Detail Pesanan:*');

  orderItems.forEach((item) => {
    const itemTotal = item.menuItem.price * item.quantity;
    lines.push(`• ${item.menuItem.name} x${item.quantity} = ${formatCurrency(itemTotal)}`);
    if (item.selectedSubOptions.length > 0) {
      const subLabels = item.selectedSubOptions.map((optId) => {
        const opt = item.menuItem.subOptions?.find((o) => o.id === optId);
        return opt?.label || optId;
      });
      lines.push(`  _(${subLabels.join(', ')})_`);
    }
  });

  lines.push('');
  lines.push(`💰 *Total: ${formatCurrency(totalPrice)}*`);
  lines.push('');
  lines.push('👤 *Data Pemesan:*');
  lines.push(`Nama: ${customerName}`);
  lines.push(`No. HP: ${customerPhone}`);
  lines.push('');
  lines.push('✅ Pembayaran sudah dilakukan via QRIS.');

  return lines.join('\n');
}
