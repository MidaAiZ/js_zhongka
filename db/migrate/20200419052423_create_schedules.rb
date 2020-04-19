class CreateSchedules < ActiveRecord::Migration[5.1]
  def change
    create_table :schedules do |t|
      t.string :name
      t.timestamp :begin_time
      t.timestamp :end_time
      t.integer :car_head_id
      t.integer :car_body_id
      t.string :executor
      t.string :desc
      t.integer :state

      t.timestamps
    end
  end
end
