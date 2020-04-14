class CreateCarBodies < ActiveRecord::Migration[5.1]
  def change
    create_table :car_bodies do |t|
      t.string :body_id
      t.string :body_type
      t.string :brand
      t.integer :status
      t.string :max_weight

      t.timestamps
    end
  end
end
