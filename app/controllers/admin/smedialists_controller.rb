class Admin::SmedialistsController < ApplicationController
  before_action :set_admin_smedialist, only: [:show, :edit, :update, :destroy]

  # GET /admin/smedialists
  # GET /admin/smedialists.json
  def index
    @admin_smedialists = Admin::Smedialist.all
  end

  # GET /admin/smedialists/1
  # GET /admin/smedialists/1.json
  def show
  end

  # GET /admin/smedialists/new
  def new
    @admin_smedialist = Admin::Smedialist.new
  end

  # GET /admin/smedialists/1/edit
  def edit
  end

  # POST /admin/smedialists
  # POST /admin/smedialists.json
  def create
    @admin_smedialist = Admin::Smedialist.new(admin_smedialist_params)

    respond_to do |format|
      if @admin_smedialist.save
        format.html { redirect_to @admin_smedialist, notice: 'Smedialist was successfully created.' }
        format.json { render :show, status: :created, location: @admin_smedialist }
      else
        format.html { render :new }
        format.json { render json: @admin_smedialist.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /admin/smedialists/1
  # PATCH/PUT /admin/smedialists/1.json
  def update
    respond_to do |format|
      if @admin_smedialist.update(admin_smedialist_params)
        format.html { redirect_to @admin_smedialist, notice: 'Smedialist was successfully updated.' }
        format.json { render :show, status: :ok, location: @admin_smedialist }
      else
        format.html { render :edit }
        format.json { render json: @admin_smedialist.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /admin/smedialists/1
  # DELETE /admin/smedialists/1.json
  def destroy
    @admin_smedialist.destroy
    respond_to do |format|
      format.html { redirect_to admin_smedialists_url, notice: 'Smedialist was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_admin_smedialist
      @admin_smedialist = Admin::Smedialist.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def admin_smedialist_params
      params.require(:admin_smedialist).permit(:id, :title, :description, :service_id)
    end
end
