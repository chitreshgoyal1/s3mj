class Admin::SnoticesController < ApplicationController
  before_action :set_admin_snotice, only: [:show, :edit, :update, :destroy]

  # GET /admin/snotices
  # GET /admin/snotices.json
  def index
    @admin_snotices = Admin::Snotice.all
  end

  # GET /admin/snotices/1
  # GET /admin/snotices/1.json
  def show
  end

  # GET /admin/snotices/new
  def new
    @admin_snotice = Admin::Snotice.new
  end

  # GET /admin/snotices/1/edit
  def edit
  end

  # POST /admin/snotices
  # POST /admin/snotices.json
  def create
    @admin_snotice = Admin::Snotice.new(admin_snotice_params)

    respond_to do |format|
      if @admin_snotice.save
        format.html { redirect_to @admin_snotice, notice: 'Snotice was successfully created.' }
        format.json { render :show, status: :created, location: @admin_snotice }
      else
        format.html { render :new }
        format.json { render json: @admin_snotice.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /admin/snotices/1
  # PATCH/PUT /admin/snotices/1.json
  def update
    respond_to do |format|
      if @admin_snotice.update(admin_snotice_params)
        format.html { redirect_to @admin_snotice, notice: 'Snotice was successfully updated.' }
        format.json { render :show, status: :ok, location: @admin_snotice }
      else
        format.html { render :edit }
        format.json { render json: @admin_snotice.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /admin/snotices/1
  # DELETE /admin/snotices/1.json
  def destroy
    @admin_snotice.destroy
    respond_to do |format|
      format.html { redirect_to admin_snotices_url, notice: 'Snotice was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_admin_snotice
      @admin_snotice = Admin::Snotice.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def admin_snotice_params
      params.require(:admin_snotice).permit(:description, :service_id)
    end
end
