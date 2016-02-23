json.array!(@admin_events) do |admin_event|
  json.extract! admin_event, :id, :title, :description, :event_date_from, :event_date_to, :location, :summery
  json.url admin_event_url(admin_event, format: :json)
end
