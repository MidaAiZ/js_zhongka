class CreateOrders < ActiveRecord::Migration[5.1]
  def change
    create_table :orders do |t|
      t.string :order_number
      t.float :price
      t.string :driver_id
      t.string :car_number
      t.integer :car_body_id
      t.string :goods
      t.float :weight
      t.string :origin
      t.string :destination
      t.string :distance
      t.timestamp :start_time
      t.timestamp :end_time
      t.float :oil_consumption
      t.float :oil_fee
      t.integer :toll_gate
      t.float :road_toll
      t.integer :state
      t.integer :last_state
      t.integer :customer_id
      t.string :sale_name
      t.string :pay_type
      t.timestamp :pay_time
      t.string :remark
      t.boolean :is_deleted, null: false, default: false

      t.timestamps
    end
  end
end
