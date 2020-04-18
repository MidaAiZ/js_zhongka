class AddInfoToOrders < ActiveRecord::Migration[5.1]
  def change
    change_table :orders do |t|
      t.integer :total_fee, default: 0, null: false
      t.string :via_stations, default: ""
      t.integer :pay1_amount
      t.string :pay1_type
      t.timestamp :pay1_time
      t.integer :pay2_amount
      t.string :pay2_type
      t.timestamp :pay2_time
    end
    remove_column :orders, :pay_time
    remove_column :orders, :pay_type
  end
end
