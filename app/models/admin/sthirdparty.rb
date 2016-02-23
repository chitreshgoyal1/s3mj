class Admin::Sthirdparty < ActiveRecord::Base
	mount_uploader :tppic, ThirdpartyUploader
	belongs_to :admin_service, class_name: "Admin::Service", foreign_key: 'service_id'
end
