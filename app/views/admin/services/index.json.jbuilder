json.array!(@admin_services) do |admin_service|
  json.extract! admin_service, :id, :service_title, :service_caption, :tp_title, :tp_caption, :cust_title, :cust_caption, :cust_descrption, :notice_board_title
  json.url admin_service_url(admin_service, format: :json)
end
