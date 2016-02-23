require 'test_helper'

class Admin::ContactInfosControllerTest < ActionController::TestCase
  setup do
    @admin_contact_info = admin_contact_infos(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:admin_contact_infos)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create admin_contact_info" do
    assert_difference('Admin::ContactInfo.count') do
      post :create, admin_contact_info: { add_line1: @admin_contact_info.add_line1, add_line2: @admin_contact_info.add_line2, add_line3: @admin_contact_info.add_line3, city: @admin_contact_info.city, country: @admin_contact_info.country, email1: @admin_contact_info.email1, email2: @admin_contact_info.email2, embed_url: @admin_contact_info.embed_url, facebook_url: @admin_contact_info.facebook_url, mobile1: @admin_contact_info.mobile1, mobile2: @admin_contact_info.mobile2, name: @admin_contact_info.name, phone1_code: @admin_contact_info.phone1_code, phone1_number: @admin_contact_info.phone1_number, phone2_code: @admin_contact_info.phone2_code, phone2_number: @admin_contact_info.phone2_number, state: @admin_contact_info.state, twitter_url: @admin_contact_info.twitter_url }
    end

    assert_redirected_to admin_contact_info_path(assigns(:admin_contact_info))
  end

  test "should show admin_contact_info" do
    get :show, id: @admin_contact_info
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @admin_contact_info
    assert_response :success
  end

  test "should update admin_contact_info" do
    patch :update, id: @admin_contact_info, admin_contact_info: { add_line1: @admin_contact_info.add_line1, add_line2: @admin_contact_info.add_line2, add_line3: @admin_contact_info.add_line3, city: @admin_contact_info.city, country: @admin_contact_info.country, email1: @admin_contact_info.email1, email2: @admin_contact_info.email2, embed_url: @admin_contact_info.embed_url, facebook_url: @admin_contact_info.facebook_url, mobile1: @admin_contact_info.mobile1, mobile2: @admin_contact_info.mobile2, name: @admin_contact_info.name, phone1_code: @admin_contact_info.phone1_code, phone1_number: @admin_contact_info.phone1_number, phone2_code: @admin_contact_info.phone2_code, phone2_number: @admin_contact_info.phone2_number, state: @admin_contact_info.state, twitter_url: @admin_contact_info.twitter_url }
    assert_redirected_to admin_contact_info_path(assigns(:admin_contact_info))
  end

  test "should destroy admin_contact_info" do
    assert_difference('Admin::ContactInfo.count', -1) do
      delete :destroy, id: @admin_contact_info
    end

    assert_redirected_to admin_contact_infos_path
  end
end
