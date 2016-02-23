require 'test_helper'

class Admin::AboutMesControllerTest < ActionController::TestCase
  setup do
    @admin_about_me = admin_about_mes(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:admin_about_mes)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create admin_about_me" do
    assert_difference('Admin::AboutMe.count') do
      post :create, admin_about_me: { progressbar_description: @admin_about_me.progressbar_description, progressbar_title: @admin_about_me.progressbar_title, story: @admin_about_me.story, story_title: @admin_about_me.story_title, storypic: @admin_about_me.storypic }
    end

    assert_redirected_to admin_about_me_path(assigns(:admin_about_me))
  end

  test "should show admin_about_me" do
    get :show, id: @admin_about_me
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @admin_about_me
    assert_response :success
  end

  test "should update admin_about_me" do
    patch :update, id: @admin_about_me, admin_about_me: { progressbar_description: @admin_about_me.progressbar_description, progressbar_title: @admin_about_me.progressbar_title, story: @admin_about_me.story, story_title: @admin_about_me.story_title, storypic: @admin_about_me.storypic }
    assert_redirected_to admin_about_me_path(assigns(:admin_about_me))
  end

  test "should destroy admin_about_me" do
    assert_difference('Admin::AboutMe.count', -1) do
      delete :destroy, id: @admin_about_me
    end

    assert_redirected_to admin_about_mes_path
  end
end
