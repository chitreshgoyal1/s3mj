class Admin::AboutMesController < ApplicationController
  before_action :set_admin_about_me, only: [:show, :edit, :update, :destroy]

  # GET /admin/about_mes
  # GET /admin/about_mes.json
  def index
    @admin_about_mes = Admin::AboutMe.all
  end

  # GET /admin/about_mes/1
  # GET /admin/about_mes/1.json
  def show
  end

  # GET /admin/about_mes/new
  def new
    @admin_about_me = Admin::AboutMe.new
  end

  # GET /admin/about_mes/1/edit
  def edit
  end

  # POST /admin/about_mes
  # POST /admin/about_mes.json
  def create
    @admin_about_me = Admin::AboutMe.new(admin_about_me_params)

    respond_to do |format|
      if @admin_about_me.save
        format.html { redirect_to admin_about_mes_url, notice: 'About me was successfully created.' }
        format.json { render :show, status: :created, location: @admin_about_me }
      else
        format.html { render :new }
        format.json { render json: @admin_about_me.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /admin/about_mes/1
  # PATCH/PUT /admin/about_mes/1.json
  def update
    respond_to do |format|
      if @admin_about_me.update(admin_about_me_params)
        format.html { redirect_to admin_about_mes_url, notice: 'About me was successfully updated.' }
        format.json { render :show, status: :ok, location: @admin_about_me }
      else
        format.html { render :edit }
        format.json { render json: @admin_about_me.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /admin/about_mes/1
  # DELETE /admin/about_mes/1.json
  def destroy
    @admin_about_me.destroy
    respond_to do |format|
      format.html { redirect_to admin_about_mes_url, notice: 'About me was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_admin_about_me
      @admin_about_me = Admin::AboutMe.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def admin_about_me_params
      params.require(:admin_about_me).permit(:storypic, :story_title, :story, :progressbar_title, :progressbar_description)
    end
end
