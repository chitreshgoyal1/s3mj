class Admin::SthirdpartiesController < ApplicationController
  before_action :set_admin_sthirdparty, only: [:show, :edit, :update, :destroy]

  # GET /admin/sthirdparties
  # GET /admin/sthirdparties.json
  def index
    @admin_sthirdparties = Admin::Sthirdparty.all
  end

  # GET /admin/sthirdparties/1
  # GET /admin/sthirdparties/1.json
  def show
  end

  # GET /admin/sthirdparties/new
  def new
    @admin_sthirdparty = Admin::Sthirdparty.new
  end

  # GET /admin/sthirdparties/1/edit
  def edit
  end

  # POST /admin/sthirdparties
  # POST /admin/sthirdparties.json
  def create
    @admin_sthirdparty = Admin::Sthirdparty.new(admin_sthirdparty_params)

    respond_to do |format|
      if @admin_sthirdparty.save
        format.html { redirect_to @admin_sthirdparty, notice: 'Sthirdparty was successfully created.' }
        format.json { render :show, status: :created, location: @admin_sthirdparty }
      else
        format.html { render :new }
        format.json { render json: @admin_sthirdparty.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /admin/sthirdparties/1
  # PATCH/PUT /admin/sthirdparties/1.json
  def update
    respond_to do |format|
      if @admin_sthirdparty.update(admin_sthirdparty_params)
        format.html { redirect_to @admin_sthirdparty, notice: 'Sthirdparty was successfully updated.' }
        format.json { render :show, status: :ok, location: @admin_sthirdparty }
      else
        format.html { render :edit }
        format.json { render json: @admin_sthirdparty.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /admin/sthirdparties/1
  # DELETE /admin/sthirdparties/1.json
  def destroy
    @admin_sthirdparty.destroy
    respond_to do |format|
      format.html { redirect_to admin_sthirdparties_url, notice: 'Sthirdparty was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_admin_sthirdparty
      @admin_sthirdparty = Admin::Sthirdparty.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def admin_sthirdparty_params
      params.require(:admin_sthirdparty).permit(:tppic, :title, :description, :service_id)
    end
end
