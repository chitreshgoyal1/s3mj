class Admin::ScustservicesController < ApplicationController
  before_action :set_admin_scustservice, only: [:show, :edit, :update, :destroy]

  # GET /admin/scustservices
  # GET /admin/scustservices.json
  def index
    @admin_scustservices = Admin::Scustservice.all
  end

  # GET /admin/scustservices/1
  # GET /admin/scustservices/1.json
  def show
  end

  # GET /admin/scustservices/new
  def new
    @admin_scustservice = Admin::Scustservice.new
  end

  # GET /admin/scustservices/1/edit
  def edit
  end

  # POST /admin/scustservices
  # POST /admin/scustservices.json
  def create
    @admin_scustservice = Admin::Scustservice.new(admin_scustservice_params)

    respond_to do |format|
      if @admin_scustservice.save
        format.html { redirect_to @admin_scustservice, notice: 'Scustservice was successfully created.' }
        format.json { render :show, status: :created, location: @admin_scustservice }
      else
        format.html { render :new }
        format.json { render json: @admin_scustservice.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /admin/scustservices/1
  # PATCH/PUT /admin/scustservices/1.json
  def update
    respond_to do |format|
      if @admin_scustservice.update(admin_scustservice_params)
        format.html { redirect_to @admin_scustservice, notice: 'Scustservice was successfully updated.' }
        format.json { render :show, status: :ok, location: @admin_scustservice }
      else
        format.html { render :edit }
        format.json { render json: @admin_scustservice.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /admin/scustservices/1
  # DELETE /admin/scustservices/1.json
  def destroy
    @admin_scustservice.destroy
    respond_to do |format|
      format.html { redirect_to admin_scustservices_url, notice: 'Scustservice was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_admin_scustservice
      @admin_scustservice = Admin::Scustservice.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def admin_scustservice_params
      params.require(:admin_scustservice).permit(:title, :description, :service_id)
    end
end
