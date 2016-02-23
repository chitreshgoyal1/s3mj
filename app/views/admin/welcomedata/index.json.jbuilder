json.array!(@admin_welcomedata) do |admin_welcomedatum|
  json.extract! admin_welcomedatum, :id, :title, :description, :picture
  json.url admin_welcomedatum_url(admin_welcomedatum, format: :json)
end
