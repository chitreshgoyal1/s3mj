class Admin::Event < ActiveRecord::Base
	mount_uploader :eventpic, EventUploader

end
