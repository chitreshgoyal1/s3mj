require 'test_helper'

class Admin::WelcomedataControllerTest < ActionController::TestCase
  setup do
    @admin_welcomedatum = admin_welcomedata(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:admin_welcomedata)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create admin_welcomedatum" do
    assert_difference('Admin::Welcomedatum.count') do
      post :create, admin_welcomedatum: { description: @admin_welcomedatum.description, picture: @admin_welcomedatum.picture, title: @admin_welcomedatum.title }
    end

    assert_redirected_to admin_welcomedatum_path(assigns(:admin_welcomedatum))
  end

  test "should show admin_welcomedatum" do
    get :show, id: @admin_welcomedatum
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @admin_welcomedatum
    assert_response :success
  end

  test "should update admin_welcomedatum" do
    patch :update, id: @admin_welcomedatum, admin_welcomedatum: { description: @admin_welcomedatum.description, picture: @admin_welcomedatum.picture, title: @admin_welcomedatum.title }
    assert_redirected_to admin_welcomedatum_path(assigns(:admin_welcomedatum))
  end

  test "should destroy admin_welcomedatum" do
    assert_difference('Admin::Welcomedatum.count', -1) do
      delete :destroy, id: @admin_welcomedatum
    end

    assert_redirected_to admin_welcomedata_path
  end
end
