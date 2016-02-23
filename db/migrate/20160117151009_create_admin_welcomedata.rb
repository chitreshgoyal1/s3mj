class CreateAdminWelcomedata < ActiveRecord::Migration
  def change
    create_table :admin_welcomedata do |t|
      t.string :title
      t.string :description
      t.string :picture

      t.timestamps null: false
    end
  end
end
