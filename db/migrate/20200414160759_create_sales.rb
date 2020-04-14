class CreateSales < ActiveRecord::Migration[5.1]
  def change
    create_table :sales do |t|
      t.string :name
      t.string :tel
      t.integer :gender
      t.date :age
      t.date :join_time
      t.jsonb :info
      t.string :remark

      t.timestamps
    end
  end
end
