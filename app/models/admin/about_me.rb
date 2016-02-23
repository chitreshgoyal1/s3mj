class Admin::AboutMe < ActiveRecord::Base
	mount_uploader :storypic, AboutmeUploader
end
