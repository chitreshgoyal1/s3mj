class RegistrationsController < Devise::RegistrationsController
  def new
    render :layout => "admin/empty"
    super
  end
end
