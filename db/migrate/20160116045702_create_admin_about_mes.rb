class CreateAdminAboutMes < ActiveRecord::Migration
  def change
    create_table :admin_about_mes do |t|
      t.string :storypic
      t.string :story_title
      t.text :story
      t.string :progressbar_title
      t.text :progressbar_description

      t.timestamps null: false
    end
  end
end
