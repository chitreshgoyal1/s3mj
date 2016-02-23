class Admin::SharevideosController < ApplicationController
  before_action :set_admin_sharevideo, only: [:show, :edit, :update, :destroy]

  # GET /admin/sharevideos
  # GET /admin/sharevideos.json
  def index
    @admin_sharevideos = Admin::Sharevideo.all
  end

  # GET /admin/sharevideos/1
  # GET /admin/sharevideos/1.json
  def show
  end

  # GET /admin/sharevideos/new
  def new
    @admin_sharevideo = Admin::Sharevideo.new
  end

  # GET /admin/sharevideos/1/edit
  def edit
  end

  # POST /admin/sharevideos
  # POST /admin/sharevideos.json
  def create
    @admin_sharevideo = Admin::Sharevideo.new(admin_sharevideo_params)

    respond_to do |format|
      if @admin_sharevideo.save
        format.html { redirect_to admin_sharevideos_url, notice: 'Sharevideo was successfully created.' }
        format.json { render :show, status: :created, location: @admin_sharevideo }
      else
        format.html { render :new }
        format.json { render json: @admin_sharevideo.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /admin/sharevideos/1
  # PATCH/PUT /admin/sharevideos/1.json
  def update
    respond_to do |format|
      if @admin_sharevideo.update(admin_sharevideo_params)
        format.html { redirect_to admin_sharevideos_url, notice: 'Sharevideo was successfully updated.' }
        format.json { render :show, status: :ok, location: @admin_sharevideo }
      else
        format.html { render :edit }
        format.json { render json: @admin_sharevideo.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /admin/sharevideos/1
  # DELETE /admin/sharevideos/1.json
  def destroy
    @admin_sharevideo.destroy
    respond_to do |format|
      format.html { redirect_to admin_sharevideos_url, notice: 'Sharevideo was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_admin_sharevideo
      @admin_sharevideo = Admin::Sharevideo.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def admin_sharevideo_params
      params.require(:admin_sharevideo).permit(:embed)
    end
end
