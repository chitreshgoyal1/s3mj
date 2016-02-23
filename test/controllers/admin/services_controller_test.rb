require 'test_helper'

class Admin::ServicesControllerTest < ActionController::TestCase
  setup do
    @admin_service = admin_services(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:admin_services)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create admin_service" do
    assert_difference('Admin::Service.count') do
      post :create, admin_service: { cust_caption: @admin_service.cust_caption, cust_descrption: @admin_service.cust_descrption, cust_title: @admin_service.cust_title, notice_board_title: @admin_service.notice_board_title, service_caption: @admin_service.service_caption, service_title: @admin_service.service_title, tp_caption: @admin_service.tp_caption, tp_title: @admin_service.tp_title }
    end

    assert_redirected_to admin_service_path(assigns(:admin_service))
  end

  test "should show admin_service" do
    get :show, id: @admin_service
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @admin_service
    assert_response :success
  end

  test "should update admin_service" do
    patch :update, id: @admin_service, admin_service: { cust_caption: @admin_service.cust_caption, cust_descrption: @admin_service.cust_descrption, cust_title: @admin_service.cust_title, notice_board_title: @admin_service.notice_board_title, service_caption: @admin_service.service_caption, service_title: @admin_service.service_title, tp_caption: @admin_service.tp_caption, tp_title: @admin_service.tp_title }
    assert_redirected_to admin_service_path(assigns(:admin_service))
  end

  test "should destroy admin_service" do
    assert_difference('Admin::Service.count', -1) do
      delete :destroy, id: @admin_service
    end

    assert_redirected_to admin_services_path
  end
end
