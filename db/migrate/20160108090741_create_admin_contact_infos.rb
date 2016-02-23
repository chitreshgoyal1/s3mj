class CreateAdminContactInfos < ActiveRecord::Migration
  def change
    create_table :admin_contact_infos do |t|
      t.text :embed_url
      t.string :email1
      t.string :email2
      t.integer :phone1_code
      t.string :phone1_number
      t.integer :phone2_code
      t.string :phone2_number
      t.string :name
      t.string :add_line1
      t.string :add_line2
      t.string :add_line3
      t.string :city
      t.string :state
      t.string :country
      t.string :mobile1
      t.string :mobile2
      t.string :facebook_url
      t.string :twitter_url

      t.timestamps null: false
    end
  end
end
