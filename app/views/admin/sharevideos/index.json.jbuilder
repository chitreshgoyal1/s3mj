json.array!(@admin_sharevideos) do |admin_sharevideo|
  json.extract! admin_sharevideo, :id, :embed
  json.url admin_sharevideo_url(admin_sharevideo, format: :json)
end
