class Admin::Gallery < ActiveRecord::Base
	mount_uploader :pic, GalleryUploader
end
