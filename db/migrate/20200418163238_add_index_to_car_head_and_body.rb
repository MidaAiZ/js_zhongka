class AddIndexToCarHeadAndBody < ActiveRecord::Migration[5.1]
  def change
    add_index :car_heads, :car_number, unique: true
    add_index :car_bodies, :body_id, unique: true
  end
end
