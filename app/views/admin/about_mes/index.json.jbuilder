json.array!(@admin_about_mes) do |admin_about_me|
  json.extract! admin_about_me, :id, :storypic, :story_title, :story, :progressbar_title, :progressbar_description
  json.url admin_about_me_url(admin_about_me, format: :json)
end
