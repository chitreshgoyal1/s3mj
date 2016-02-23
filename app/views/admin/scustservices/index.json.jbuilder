json.array!(@admin_scustservices) do |admin_scustservice|
  json.extract! admin_scustservice, :id, :title, :description, :service_id
  json.url admin_scustservice_url(admin_scustservice, format: :json)
end
