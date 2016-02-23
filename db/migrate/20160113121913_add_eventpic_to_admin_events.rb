class AddEventpicToAdminEvents < ActiveRecord::Migration
  def change
    add_column :admin_events, :eventpic, :string
  end
end
