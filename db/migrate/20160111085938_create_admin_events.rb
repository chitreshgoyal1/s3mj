class CreateAdminEvents < ActiveRecord::Migration
  def change
    create_table :admin_events do |t|
      t.text :title
      t.text :description
      t.date :event_date_from
      t.date :event_date_to
      t.datetime :start_time
      t.datetime :end_time
      t.text :location
      t.text :summery

      t.timestamps null: false
    end
  end
end
