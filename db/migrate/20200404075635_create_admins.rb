class CreateAdmins < ActiveRecord::Migration[5.1]
  def change
    create_table :admins do |t|
      t.string :number, null: false
      t.string :password_digest, null: false
      t.string :email, null: false, default: ""
      t.string :tel, null: false, default: ""
      t.string :name, null: false, default: ""
      t.string :role, null: false, default: "admin"
      t.string :avatar, null: false, default: ""
      t.boolean :is_deleted, null: false, default: false

      t.timestamps
    end
  end
end
