class Admin::ServicesController < ApplicationController
  before_action :set_admin_service, only: [:show, :edit, :update, :destroy]

  # GET /admin/services
  # GET /admin/services.json
  def index
    @admin_services = Admin::Service.all
  end

  # GET /admin/services/1
  # GET /admin/services/1.json
  def show
  end

  # GET /admin/services/new
  def new
    @admin_service = Admin::Service.new
  end

  # GET /admin/services/1/edit
  def edit
  end

  # POST /admin/services
  # POST /admin/services.json
  def create
    @admin_service = Admin::Service.new(admin_service_params)

    respond_to do |format|
      if @admin_service.save
        format.html { redirect_to admin_services_url, notice: 'Service was successfully created.' }
        format.json { render :show, status: :created, location: @admin_service }
      else
        format.html { render :new }
        format.json { render json: @admin_service.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /admin/services/1
  # PATCH/PUT /admin/services/1.json
  def update
    respond_to do |format|
      if @admin_service.update(admin_service_params)
        format.html { redirect_to admin_services_url, notice: 'Service was successfully updated.' }
        format.json { render :show, status: :ok, location: @admin_service }
      else
        format.html { render :edit }
        format.json { render json: @admin_service.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /admin/services/1
  # DELETE /admin/services/1.json
  def destroy
    @admin_service.destroy
    respond_to do |format|
      format.html { redirect_to admin_services_url, notice: 'Service was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_admin_service
      @admin_service = Admin::Service.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def admin_service_params
      params.require(:admin_service).permit(:service_title, :service_caption, :tp_title, :tp_caption, :cust_title, :cust_caption, :cust_descrption, :notice_board_title, admin_smedialists_attributes: [:id, :title, :description, :_destroy], admin_sthirdparties_attributes: [:id, :tppic, :title, :description, :_destroy], admin_scustservices_attributes: [:id, :title, :description, :_destroy], admin_snotices_attributes: [:id, :description, :_destroy])
    end
end
