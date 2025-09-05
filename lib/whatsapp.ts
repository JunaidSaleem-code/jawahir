// WhatsApp number targets are sourced exclusively from NEXT_PUBLIC_WHATSAPP_NUMBERS

export function normalizePakistaniPhone(input: string | undefined): string | undefined {
  if (!input) return undefined;
  let digits = input.replace(/[^0-9]/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.startsWith('92') && digits.length === 12) return digits;
  if (digits.startsWith('0') && digits.length === 11) return `92${digits.slice(1)}`;
  if (digits.startsWith('3') && digits.length === 10) return `92${digits}`;
  if (digits.length === 12 && digits.startsWith('92')) return digits;
  return digits;
}

export function buildWhatsAppMessage(params: {
  productName: string;
  productPricePkr: number | string;
  productUrl: string;
  productImageUrl?: string;
  customerName?: string;
  customerPhone?: string;
  includeUrdu?: boolean;
  orderId?: string;
}): string {
  const {
    productName,
    productPricePkr,
    productUrl,
    productImageUrl,
    customerName,
    customerPhone,
    includeUrdu = false,
    orderId,
  } = params;

  const greeting = includeUrdu ? 'السلام علیکم!' : 'Hello!';
  const lines: string[] = [];
  lines.push(`${greeting} I would like to place an order.`);
  if (orderId) lines.push(`🧾 Order ID: ${orderId}`);
  lines.push(`\n🛒 Product: ${productName}`);
  lines.push(`💵 Price: Rs. ${productPricePkr}`);
  lines.push(`🔗 Link: ${productUrl}`);
  if (productImageUrl) lines.push(`🖼️ Image: ${productImageUrl}`);
  const customerLabel = customerName || customerPhone ? `${customerName ?? ''}${customerName && customerPhone ? ' / ' : ''}${customerPhone ?? ''}` : 'Guest';
  lines.push(`👤 Customer: ${customerLabel || 'Guest'}`);
  return encodeURIComponent(lines.join('\n'));
}

export function buildCartWhatsAppMessage(params: {
  items: Array<{
    title: string;
    pricePkr: number | string;
    quantity: number;
    size?: string;
    imageUrl?: string;
    productUrl?: string;
  }>;
  totals?: { subtotalPkr?: number | string; shippingPkr?: number | string; taxPkr?: number | string; grandTotalPkr?: number | string };
  customerName?: string;
  customerPhone?: string;
  includeUrdu?: boolean;
  orderId?: string;
}): string {
  const { items, totals, customerName, customerPhone, includeUrdu = false, orderId } = params;
  const greeting = includeUrdu ? 'السلام علیکم!' : 'Hello!';
  const lines: string[] = [];
  lines.push(`${greeting} I would like to place an order for my cart.`);
  if (orderId) lines.push(`🧾 Order ID: ${orderId}`);
  lines.push('\nItems:');
  items.forEach((it, idx) => {
    const name = it.title + (it.size ? ` • ${it.size}` : '');
    lines.push(`${idx + 1}. ${name}`);
    lines.push(`   💵 Rs. ${it.pricePkr} × ${it.quantity}`);
    if (it.productUrl) lines.push(`   🔗 ${it.productUrl}`);
    if (it.imageUrl) lines.push(`   🖼️ ${it.imageUrl}`);
  });
  if (totals) {
    lines.push('\nTotals:');
    if (totals.subtotalPkr != null) lines.push(`• Subtotal: Rs. ${totals.subtotalPkr}`);
    if (totals.shippingPkr != null) lines.push(`• Shipping: Rs. ${totals.shippingPkr}`);
    if (totals.taxPkr != null) lines.push(`• Tax: Rs. ${totals.taxPkr}`);
    if (totals.grandTotalPkr != null) lines.push(`• Grand Total: Rs. ${totals.grandTotalPkr}`);
  }
  const customerLabel = customerName || customerPhone ? `${customerName ?? ''}${customerName && customerPhone ? ' / ' : ''}${customerPhone ?? ''}` : 'Guest';
  lines.push(`\n👤 Customer: ${customerLabel || 'Guest'}`);
  return encodeURIComponent(lines.join('\n'));
}

export function buildStructuredWhatsAppMessage(params: {
  items: Array<{
    title: string;
    pricePkr: number;
    quantity: number;
    size?: string;
    productUrl?: string;
  }>;
  totals: {
    subtotalPkr: number;
    shippingPkr?: number;
    taxPkr?: number;
    grandTotalPkr: number;
  };
  customerName: string;
  customerPhone: string;
  address?: string;
  paymentMethod?: string;
  orderId?: string;
}): string {
  const { items, totals, customerName, customerPhone, address, paymentMethod, orderId } = params;
  
  const lines: string[] = [];
  lines.push('🛒 New Order Request');
  if (orderId) lines.push(`🧾 Order ID: ${orderId}`);
  lines.push('');
  lines.push('📌 Items:');
  
  items.forEach((item, index) => {
    const itemName = `${item.title}${item.size ? ` (${item.size})` : ''}`;
    lines.push(`${index + 1}) ${itemName}`);
    lines.push(`   💵 Rs. ${item.pricePkr.toLocaleString()} × ${item.quantity}`);
    if (item.productUrl) {
      lines.push(`   🔗 [View Product](${item.productUrl})`);
    }
    lines.push('');
  });
  
  lines.push('---------------------------');
  lines.push('📊 Totals:');
  lines.push(`Subtotal: Rs. ${totals.subtotalPkr.toLocaleString()}`);
  if (totals.shippingPkr) {
    lines.push(`Delivery: Rs. ${totals.shippingPkr.toLocaleString()}`);
  }
  if (totals.taxPkr) {
    lines.push(`Tax: Rs. ${totals.taxPkr.toLocaleString()}`);
  }
  lines.push(`Grand Total: Rs. ${totals.grandTotalPkr.toLocaleString()}`);
  lines.push('');
  lines.push(`👤 Customer: ${customerName}`);
  lines.push(`📞 Contact: ${customerPhone}`);
  lines.push(`📍 Address: ${address || 'To be filled by customer'}`);
  lines.push('');
  lines.push(`✅ Payment Method: ${paymentMethod || 'Cash on Delivery'}`);
  
  return encodeURIComponent(lines.join('\n'));
}

export function useWhatsAppTargets(): string[] {
  const envPhonesRaw = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBERS || '').trim();
  const envPhones = envPhonesRaw
    ? envPhonesRaw
        .split(',')
        .map((p) => normalizePakistaniPhone((p || '').trim()))
        .filter(Boolean) as string[]
    : [];
  return Array.from(new Set(envPhones));
}

export function buildWhatsAppLink(phone: string, encodedMessage: string): string {
  const target = phone.startsWith('92') ? phone : normalizePakistaniPhone(phone) || phone;
  return `https://api.whatsapp.com/send?phone=${target}&text=${encodedMessage}`;
}


