class Admin::WelcomedataController < ApplicationController
  before_action :set_admin_welcomedatum, only: [:show, :edit, :update, :destroy]

  # GET /admin/welcomedata
  # GET /admin/welcomedata.json
  def index
    @admin_welcomedata = Admin::Welcomedatum.all
  end

  # GET /admin/welcomedata/1
  # GET /admin/welcomedata/1.json
  def show
  end

  # GET /admin/welcomedata/new
  def new
    @admin_welcomedatum = Admin::Welcomedatum.new
  end

  # GET /admin/welcomedata/1/edit
  def edit
  end

  # POST /admin/welcomedata
  # POST /admin/welcomedata.json
  def create
    @admin_welcomedatum = Admin::Welcomedatum.new(admin_welcomedatum_params)

    respond_to do |format|
      if @admin_welcomedatum.save
        format.html { redirect_to admin_welcomedata_url, notice: 'Welcomedatum was successfully created.' }
        format.json { render :show, status: :created, location: @admin_welcomedatum }
      else
        format.html { render :new }
        format.json { render json: @admin_welcomedatum.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /admin/welcomedata/1
  # PATCH/PUT /admin/welcomedata/1.json
  def update
    respond_to do |format|
      if @admin_welcomedatum.update(admin_welcomedatum_params)
        format.html { redirect_to admin_welcomedata_url, notice: 'Welcomedatum was successfully updated.' }
        format.json { render :show, status: :ok, location: @admin_welcomedatum }
      else
        format.html { render :edit }
        format.json { render json: @admin_welcomedatum.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /admin/welcomedata/1
  # DELETE /admin/welcomedata/1.json
  def destroy
    @admin_welcomedatum.destroy
    respond_to do |format|
      format.html { redirect_to admin_welcomedata_url, notice: 'Welcomedatum was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_admin_welcomedatum
      @admin_welcomedatum = Admin::Welcomedatum.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def admin_welcomedatum_params
      params.require(:admin_welcomedatum).permit(:title, :description, :picture)
    end
end
