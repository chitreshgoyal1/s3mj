class CreateAdminSharevideos < ActiveRecord::Migration
  def change
    create_table :admin_sharevideos do |t|
      t.text :embed

      t.timestamps null: false
    end
  end
end
