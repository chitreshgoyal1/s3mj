class CreateAdminServices < ActiveRecord::Migration
  def change
    create_table :admin_services do |t|
      t.string :service_title
      t.string :service_caption
      t.string :tp_title
      t.string :tp_caption
      t.string :cust_title
      t.string :cust_caption
      t.text :cust_descrption
      t.string :notice_board_title

      t.timestamps null: false
    end
  end
end
