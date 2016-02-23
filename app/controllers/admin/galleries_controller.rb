class Admin::GalleriesController < ApplicationController
  before_action :set_admin_gallery, only: [:show, :edit, :update, :destroy]

  # GET /admin/galleries
  # GET /admin/galleries.json
  def index
    @admin_galleries = Admin::Gallery.all
  end

  # GET /admin/galleries/1
  # GET /admin/galleries/1.json
  def show
  end

  # GET /admin/galleries/new
  def new
    @admin_gallery = Admin::Gallery.new
  end

  # GET /admin/galleries/1/edit
  def edit
  end

  # POST /admin/galleries
  # POST /admin/galleries.json
  def create
    @admin_gallery = Admin::Gallery.new(admin_gallery_params)

    respond_to do |format|
      if @admin_gallery.save
        format.html { redirect_to admin_galleries_url, notice: 'Gallery was successfully created.' }
        format.json { render :show, status: :created, location: @admin_gallery }
      else
        format.html { render :new }
        format.json { render json: @admin_gallery.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /admin/galleries/1
  # PATCH/PUT /admin/galleries/1.json
  def update
    respond_to do |format|
      if @admin_gallery.update(admin_gallery_params)
        format.html { redirect_to admin_galleries_url, notice: 'Gallery was successfully updated.' }
        format.json { render :show, status: :ok, location: @admin_gallery }
      else
        format.html { render :edit }
        format.json { render json: @admin_gallery.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /admin/galleries/1
  # DELETE /admin/galleries/1.json
  def destroy
    @admin_gallery.destroy
    respond_to do |format|
      format.html { redirect_to admin_galleries_url, notice: 'Gallery was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_admin_gallery
      @admin_gallery = Admin::Gallery.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def admin_gallery_params
      params.require(:admin_gallery).permit(:title, :pic)
    end
end
