class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  before_action :authenticate_user!
  layout :layout_by_resource
  
  protected
  
  def layout_by_resource
    if devise_controller?
      if ["users","contact_infos"].include?(params[:controller])
        "admin/admin"
      else
        # this layout will be displayed on login page,forgot password, new user registration
        "admin/empty"
      end
    elsif params[:controller] == 'frontend'
      "application"
    else
      "admin/admin"
    end
  end
  
  def redirect_to_loggedin_page
    if user_signed_in?
      redirect_to admin_users_path
    end
  end

  def footer_data
    @admin_contact_infos = Admin::ContactInfo.all
  end
  
end
