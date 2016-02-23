class Admin::Welcomedatum < ActiveRecord::Base
	mount_uploader :picture, WelcomepicUploader
end
