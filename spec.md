# Specification

## Summary
**Goal:** Automatically refresh the page after the user confirms payment received, resetting the app to its initial state.

**Planned changes:**
- After the user clicks the "Confirm Payment Received" button in the OrderForm component, call `window.location.reload()` to trigger a full page reload.
- The reload occurs after any confirmation feedback or success state is shown to the user.

**User-visible outcome:** After confirming payment, the page fully reloads and the app resets to its initial empty state with no cart items or active order.
