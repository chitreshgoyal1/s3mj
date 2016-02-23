require 'test_helper'

class Admin::SmedialistsControllerTest < ActionController::TestCase
  setup do
    @admin_smedialist = admin_smedialists(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:admin_smedialists)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create admin_smedialist" do
    assert_difference('Admin::Smedialist.count') do
      post :create, admin_smedialist: { admin_service_id: @admin_smedialist.admin_service_id, description: @admin_smedialist.description, title: @admin_smedialist.title }
    end

    assert_redirected_to admin_smedialist_path(assigns(:admin_smedialist))
  end

  test "should show admin_smedialist" do
    get :show, id: @admin_smedialist
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @admin_smedialist
    assert_response :success
  end

  test "should update admin_smedialist" do
    patch :update, id: @admin_smedialist, admin_smedialist: { admin_service_id: @admin_smedialist.admin_service_id, description: @admin_smedialist.description, title: @admin_smedialist.title }
    assert_redirected_to admin_smedialist_path(assigns(:admin_smedialist))
  end

  test "should destroy admin_smedialist" do
    assert_difference('Admin::Smedialist.count', -1) do
      delete :destroy, id: @admin_smedialist
    end

    assert_redirected_to admin_smedialists_path
  end
end
