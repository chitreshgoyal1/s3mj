class Admin::Client < ActiveRecord::Base
	mount_uploader :clientpic, ClientUploader
end
