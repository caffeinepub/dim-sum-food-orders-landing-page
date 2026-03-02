# Specification

## Summary
**Goal:** Replace the existing QRIS payment image with the newly uploaded QRIS image for Dimsum Oji.

**Planned changes:**
- Save the uploaded QRIS image (G191285866-0703A01-default.png) as a static asset at `frontend/public/assets/generated/qris.png`
- Update the `<img>` src reference in `OrderForm.tsx` to point to the new `qris.png` file

**User-visible outcome:** The QRIS payment section in the order form displays the new QRIS image showing "DIMSUM OJI" with NMID ID1026488874078.
