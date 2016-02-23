class CreateAdminSmedialists < ActiveRecord::Migration
  def change
    create_table :admin_smedialists do |t|
      t.string :title
      t.string :description
      t.integer :service_id

      t.timestamps null: false
    end
  end
end
