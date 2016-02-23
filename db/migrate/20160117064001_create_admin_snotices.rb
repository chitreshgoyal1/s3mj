class CreateAdminSnotices < ActiveRecord::Migration
  def change
    create_table :admin_snotices do |t|
      t.string :description
      t.integer :service_id

      t.timestamps null: false
    end
  end
end
