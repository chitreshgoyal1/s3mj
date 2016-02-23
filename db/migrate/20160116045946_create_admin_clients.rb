class CreateAdminClients < ActiveRecord::Migration
  def change
    create_table :admin_clients do |t|
      t.string :name
      t.string :clientpic
      t.string :trustper
      t.text :feedback
      t.string :contact_details

      t.timestamps null: false
    end
  end
end
