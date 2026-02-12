-- =============================================
-- B2B Stock Management Trigger
-- =============================================

-- Function to handle stock deduction/return based on order status
CREATE OR REPLACE FUNCTION handle_dealer_order_stock()
RETURNS TRIGGER AS $$
DECLARE
  order_item RECORD;
BEGIN
  -- CASE 1: Order APPROVED (deduct stock)
  IF NEW.status = 'Onaylandı' AND (OLD.status IS NULL OR OLD.status != 'Onaylandı') THEN
    FOR order_item IN SELECT * FROM dealer_order_items WHERE order_id = NEW.id LOOP
      UPDATE products
      SET stock = stock - order_item.quantity
      WHERE id = order_item.product_id;
      
      -- Optional: Check for negative stock and raise error?
      -- For now, we allow negative stock (backorder) but you could add:
      -- IF (SELECT stock FROM products WHERE id = order_item.product_id) < 0 THEN
      --   RAISE EXCEPTION 'Insufficient stock for product %', order_item.product_name;
      -- END IF;
    END LOOP;
  END IF;

  -- CASE 2: Order CANCELLED after being APPROVED (cancel/return stock)
  IF NEW.status = 'İptal Edildi' AND OLD.status = 'Onaylandı' THEN
    FOR order_item IN SELECT * FROM dealer_order_items WHERE order_id = NEW.id LOOP
      UPDATE products
      SET stock = stock + order_item.quantity
      WHERE id = order_item.product_id;
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger definition
DROP TRIGGER IF EXISTS on_dealer_order_status_change_stock ON dealer_orders;

CREATE TRIGGER on_dealer_order_status_change_stock
  AFTER UPDATE ON dealer_orders
  FOR EACH ROW EXECUTE FUNCTION handle_dealer_order_stock();
