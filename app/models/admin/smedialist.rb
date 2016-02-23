class Admin::Smedialist < ActiveRecord::Base
  belongs_to :admin_service, class_name: "Admin::Service", foreign_key: 'service_id'
end
