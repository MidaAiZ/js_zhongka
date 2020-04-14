class CreateCarHeads < ActiveRecord::Migration[5.1]
  def change
    create_table :car_heads do |t|
      t.string :car_number
      t.string :head_type
      t.string :fuel_type
      t.string :brand
      t.integer :status

      t.timestamps
    end
  end
end
