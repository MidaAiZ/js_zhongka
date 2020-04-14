class CreateJoinTableDriversOrders < ActiveRecord::Migration[5.1]
  def change
    create_join_table :drivers, :orders do |t|
      t.references :driver, index: true
      t.references :order, index: false
    end
    add_index :drivers_orders, [:order_id, :driver_id], name: :idx_drivers_orders_on_oid_did, unique: true
  end
end
