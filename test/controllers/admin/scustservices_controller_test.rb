require 'test_helper'

class Admin::ScustservicesControllerTest < ActionController::TestCase
  setup do
    @admin_scustservice = admin_scustservices(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:admin_scustservices)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create admin_scustservice" do
    assert_difference('Admin::Scustservice.count') do
      post :create, admin_scustservice: { description: @admin_scustservice.description, service_id: @admin_scustservice.service_id, title: @admin_scustservice.title }
    end

    assert_redirected_to admin_scustservice_path(assigns(:admin_scustservice))
  end

  test "should show admin_scustservice" do
    get :show, id: @admin_scustservice
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @admin_scustservice
    assert_response :success
  end

  test "should update admin_scustservice" do
    patch :update, id: @admin_scustservice, admin_scustservice: { description: @admin_scustservice.description, service_id: @admin_scustservice.service_id, title: @admin_scustservice.title }
    assert_redirected_to admin_scustservice_path(assigns(:admin_scustservice))
  end

  test "should destroy admin_scustservice" do
    assert_difference('Admin::Scustservice.count', -1) do
      delete :destroy, id: @admin_scustservice
    end

    assert_redirected_to admin_scustservices_path
  end
end
