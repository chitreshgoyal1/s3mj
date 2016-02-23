require 'test_helper'

class Admin::SnoticesControllerTest < ActionController::TestCase
  setup do
    @admin_snotice = admin_snotices(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:admin_snotices)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create admin_snotice" do
    assert_difference('Admin::Snotice.count') do
      post :create, admin_snotice: { description: @admin_snotice.description, service_id: @admin_snotice.service_id }
    end

    assert_redirected_to admin_snotice_path(assigns(:admin_snotice))
  end

  test "should show admin_snotice" do
    get :show, id: @admin_snotice
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @admin_snotice
    assert_response :success
  end

  test "should update admin_snotice" do
    patch :update, id: @admin_snotice, admin_snotice: { description: @admin_snotice.description, service_id: @admin_snotice.service_id }
    assert_redirected_to admin_snotice_path(assigns(:admin_snotice))
  end

  test "should destroy admin_snotice" do
    assert_difference('Admin::Snotice.count', -1) do
      delete :destroy, id: @admin_snotice
    end

    assert_redirected_to admin_snotices_path
  end
end
