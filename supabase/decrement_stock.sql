create or replace function decrement_stock(p_product_id uuid, p_quantity int)
returns void
language plpgsql
security definer
as $$
begin
  update products
  set stock = stock - p_quantity
  where id = p_product_id
  and stock >= p_quantity;
  
  if not found then
    raise exception 'Insufficient stock for product %', p_product_id;
  end if;
end;
$$;
