class CreateAdminGalleries < ActiveRecord::Migration
  def change
    create_table :admin_galleries do |t|
      t.string :title
      t.string :pic

      t.timestamps null: false
    end
  end
end
