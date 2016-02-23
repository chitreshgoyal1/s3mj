require 'test_helper'

class Admin::SthirdpartiesControllerTest < ActionController::TestCase
  setup do
    @admin_sthirdparty = admin_sthirdparties(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:admin_sthirdparties)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create admin_sthirdparty" do
    assert_difference('Admin::Sthirdparty.count') do
      post :create, admin_sthirdparty: { description: @admin_sthirdparty.description, service_id: @admin_sthirdparty.service_id, title: @admin_sthirdparty.title, tppic: @admin_sthirdparty.tppic }
    end

    assert_redirected_to admin_sthirdparty_path(assigns(:admin_sthirdparty))
  end

  test "should show admin_sthirdparty" do
    get :show, id: @admin_sthirdparty
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @admin_sthirdparty
    assert_response :success
  end

  test "should update admin_sthirdparty" do
    patch :update, id: @admin_sthirdparty, admin_sthirdparty: { description: @admin_sthirdparty.description, service_id: @admin_sthirdparty.service_id, title: @admin_sthirdparty.title, tppic: @admin_sthirdparty.tppic }
    assert_redirected_to admin_sthirdparty_path(assigns(:admin_sthirdparty))
  end

  test "should destroy admin_sthirdparty" do
    assert_difference('Admin::Sthirdparty.count', -1) do
      delete :destroy, id: @admin_sthirdparty
    end

    assert_redirected_to admin_sthirdparties_path
  end
end
