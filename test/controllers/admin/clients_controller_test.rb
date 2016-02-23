require 'test_helper'

class Admin::ClientsControllerTest < ActionController::TestCase
  setup do
    @admin_client = admin_clients(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:admin_clients)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create admin_client" do
    assert_difference('Admin::Client.count') do
      post :create, admin_client: { clientpic: @admin_client.clientpic, contact_details: @admin_client.contact_details, feedback: @admin_client.feedback, name: @admin_client.name, trustper: @admin_client.trustper }
    end

    assert_redirected_to admin_client_path(assigns(:admin_client))
  end

  test "should show admin_client" do
    get :show, id: @admin_client
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @admin_client
    assert_response :success
  end

  test "should update admin_client" do
    patch :update, id: @admin_client, admin_client: { clientpic: @admin_client.clientpic, contact_details: @admin_client.contact_details, feedback: @admin_client.feedback, name: @admin_client.name, trustper: @admin_client.trustper }
    assert_redirected_to admin_client_path(assigns(:admin_client))
  end

  test "should destroy admin_client" do
    assert_difference('Admin::Client.count', -1) do
      delete :destroy, id: @admin_client
    end

    assert_redirected_to admin_clients_path
  end
end
