class Admin::Service < ActiveRecord::Base
	has_many :admin_smedialists, :dependent => :destroy, class_name: "Admin::Smedialist"
	accepts_nested_attributes_for :admin_smedialists, :reject_if => :all_blank, :allow_destroy => true

	has_many :admin_sthirdparties, :dependent => :destroy, class_name: "Admin::Sthirdparty"
	accepts_nested_attributes_for :admin_sthirdparties, :reject_if => :all_blank, :allow_destroy => true

	has_many :admin_scustservices, :dependent => :destroy, class_name: "Admin::Scustservice"
	accepts_nested_attributes_for :admin_scustservices, :reject_if => :all_blank, :allow_destroy => true

	has_many :admin_snotices, :dependent => :destroy, class_name: "Admin::Snotice"
	accepts_nested_attributes_for :admin_snotices, :reject_if => :all_blank, :allow_destroy => true
end
