class Admin::ContactInfosController < ApplicationController
  before_action :set_admin_contact_info, only: [:show, :edit, :update, :destroy]

  # GET /admin/contact_infos
  # GET /admin/contact_infos.json
  def index
    @admin_contact_infos = Admin::ContactInfo.all
  end

  # GET /admin/contact_infos/1
  # GET /admin/contact_infos/1.json
  def show
  end

  # GET /admin/contact_infos/new
  def new
    @admin_contact_info = Admin::ContactInfo.new
  end

  # GET /admin/contact_infos/1/edit
  def edit
  end

  # POST /admin/contact_infos
  # POST /admin/contact_infos.json
  def create
    @admin_contact_info = Admin::ContactInfo.new(admin_contact_info_params)

    respond_to do |format|
      if @admin_contact_info.save
        format.html { redirect_to admin_contact_infos_path, notice: 'Contact info was successfully created.' }
        format.json { render :show, status: :created, location: @admin_contact_info }
      else
        format.html { render :new }
        format.json { render json: @admin_contact_info.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /admin/contact_infos/1
  # PATCH/PUT /admin/contact_infos/1.json
  def update
    respond_to do |format|
      if @admin_contact_info.update(admin_contact_info_params)
        format.html { redirect_to admin_contact_infos_path, notice: 'Contact info was successfully updated.' }
        format.json { render :show, status: :ok, location: @admin_contact_info }
      else
        format.html { render :edit }
        format.json { render json: @admin_contact_info.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /admin/contact_infos/1
  # DELETE /admin/contact_infos/1.json
  def destroy
    @admin_contact_info.destroy
    respond_to do |format|
      format.html { redirect_to admin_contact_infos_url, notice: 'Contact info was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_admin_contact_info
      @admin_contact_info = Admin::ContactInfo.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def admin_contact_info_params
      params.require(:admin_contact_info).permit(:embed_url, :email1, :email2, :phone1_code, :phone1_number, :phone2_code, :phone2_number, :name, :add_line1, :add_line2, :add_line3, :city, :state, :country, :mobile1, :mobile2, :facebook_url, :twitter_url)
    end
end
