class AddCustomerInfoToOrders < ActiveRecord::Migration[5.1]
  def change
    change_table :orders do |t|
      t.string :customer_name, index: true
      t.string :customer_tel
    end
    remove_column :orders, :driver_id
    remove_column :orders, :sale_name
    add_index :orders, :car_number
    add_index :orders, :car_body_id
  end
end
