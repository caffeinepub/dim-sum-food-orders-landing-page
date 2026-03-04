# Specification

## Summary
**Goal:** Show the QRIS QR code payment only after order confirmation, and reset the entire order state when payment is confirmed.

**Planned changes:**
- Hide the QRIS QR code section in OrderForm until the user confirms their order; only reveal it after the order confirmation step is completed
- When the "Confirm Payment Received" button is clicked, reset all order state (cart items, contact info, payment status, and any related localStorage data) and return the UI to the initial empty/menu state

**User-visible outcome:** Users will only see the QR code payment section after confirming their order. After confirming payment received, the order form resets completely to a fresh state without requiring a page reload.
