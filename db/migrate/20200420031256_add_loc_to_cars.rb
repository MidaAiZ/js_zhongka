class AddLocToCars < ActiveRecord::Migration[5.1]
  def change
    add_column :car_heads, :loc, :string, default: ''
    add_column :car_bodies, :loc, :string, default: ''
  end
end
