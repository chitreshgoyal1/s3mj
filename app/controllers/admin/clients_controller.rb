class Admin::ClientsController < ApplicationController
  before_action :set_admin_client, only: [:show, :edit, :update, :destroy]

  # GET /admin/clients
  # GET /admin/clients.json
  def index
    @admin_clients = Admin::Client.all
  end

  # GET /admin/clients/1
  # GET /admin/clients/1.json
  def show
  end

  # GET /admin/clients/new
  def new
    @admin_client = Admin::Client.new
  end

  # GET /admin/clients/1/edit
  def edit
  end

  # POST /admin/clients
  # POST /admin/clients.json
  def create
    @admin_client = Admin::Client.new(admin_client_params)

    respond_to do |format|
      if @admin_client.save
        format.html { redirect_to admin_clients_url, notice: 'Client was successfully created.' }
        format.json { render :show, status: :created, location: @admin_client }
      else
        format.html { render :new }
        format.json { render json: @admin_client.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /admin/clients/1
  # PATCH/PUT /admin/clients/1.json
  def update
    respond_to do |format|
      if @admin_client.update(admin_client_params)
        format.html { redirect_to admin_clients_url, notice: 'Client was successfully updated.' }
        format.json { render :show, status: :ok, location: @admin_client }
      else
        format.html { render :edit }
        format.json { render json: @admin_client.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /admin/clients/1
  # DELETE /admin/clients/1.json
  def destroy
    @admin_client.destroy
    respond_to do |format|
      format.html { redirect_to admin_clients_url, notice: 'Client was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_admin_client
      @admin_client = Admin::Client.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def admin_client_params
      params.require(:admin_client).permit(:name, :clientpic, :trustper, :feedback, :contact_details)
    end
end
