json.array!(@admin_snotices) do |admin_snotice|
  json.extract! admin_snotice, :id, :description, :service_id
  json.url admin_snotice_url(admin_snotice, format: :json)
end
