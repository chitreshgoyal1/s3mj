require 'test_helper'

class Admin::SharevideosControllerTest < ActionController::TestCase
  setup do
    @admin_sharevideo = admin_sharevideos(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:admin_sharevideos)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create admin_sharevideo" do
    assert_difference('Admin::Sharevideo.count') do
      post :create, admin_sharevideo: { embed: @admin_sharevideo.embed }
    end

    assert_redirected_to admin_sharevideo_path(assigns(:admin_sharevideo))
  end

  test "should show admin_sharevideo" do
    get :show, id: @admin_sharevideo
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @admin_sharevideo
    assert_response :success
  end

  test "should update admin_sharevideo" do
    patch :update, id: @admin_sharevideo, admin_sharevideo: { embed: @admin_sharevideo.embed }
    assert_redirected_to admin_sharevideo_path(assigns(:admin_sharevideo))
  end

  test "should destroy admin_sharevideo" do
    assert_difference('Admin::Sharevideo.count', -1) do
      delete :destroy, id: @admin_sharevideo
    end

    assert_redirected_to admin_sharevideos_path
  end
end
