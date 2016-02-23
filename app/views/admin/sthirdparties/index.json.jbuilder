json.array!(@admin_sthirdparties) do |admin_sthirdparty|
  json.extract! admin_sthirdparty, :id, :tppic, :title, :description, :service_id
  json.url admin_sthirdparty_url(admin_sthirdparty, format: :json)
end
