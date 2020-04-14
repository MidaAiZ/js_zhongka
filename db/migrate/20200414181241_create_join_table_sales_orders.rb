class CreateJoinTableSalesOrders < ActiveRecord::Migration[5.1]
  def change
    create_join_table :sales, :orders do |t|
      t.references :sale, index: true
      t.references :order, index: false
    end
    add_index :orders_sales, [:order_id, :sale_id], name: :idx_orders_sales_on_oid_sid, unique: true
  end
end
