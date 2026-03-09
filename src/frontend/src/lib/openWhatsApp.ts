const WHATSAPP_NUMBER = "6281380633345";

export function openWhatsApp(message: string): void {
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
  window.open(url, "_blank", "noopener,noreferrer");
}
