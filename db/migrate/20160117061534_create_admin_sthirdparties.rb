class CreateAdminSthirdparties < ActiveRecord::Migration
  def change
    create_table :admin_sthirdparties do |t|
      t.string :tppic
      t.string :title
      t.string :description
      t.integer :service_id

      t.timestamps null: false
    end
  end
end
