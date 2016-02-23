json.array!(@admin_smedialists) do |admin_smedialist|
  json.extract! admin_smedialist, :id, :title, :description, :admin_service_id
  json.url admin_smedialist_url(admin_smedialist, format: :json)
end
