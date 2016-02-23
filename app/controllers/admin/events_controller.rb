class Admin::EventsController < ApplicationController
  before_action :set_admin_event, only: [:show, :edit, :update, :destroy]

  # GET /admin/events
  # GET /admin/events.json
  def index
    @admin_events = Admin::Event.all
  end

  # GET /admin/events/1
  # GET /admin/events/1.json
  def show
  end

  # GET /admin/events/new
  def new
    @admin_event = Admin::Event.new
    initiate_date_time
  end

  # GET /admin/events/1/edit
  def edit

    @start_date = @admin_event.event_date_from.strftime("%m/%d/%Y") rescue nil
    @end_date = @admin_event.event_date_to.strftime("%m/%d/%Y") rescue nil
    @start_time = @admin_event.start_time.strftime("%H:%M") rescue nil
    @end_time = @admin_event.end_time.strftime("%H:%M") rescue nil 

  end

  # POST /admin/events
  # POST /admin/events.json
  def create
    
    @admin_event = Admin::Event.new(admin_event_params)

    date_time_params
    @admin_event.eventpic = params[:eventpic]

    respond_to do |format|
      if @admin_event.save
        format.html { redirect_to admin_events_path, notice: 'Event was successfully created.' }
        format.json { render :show, status: :created, location: @admin_event }
      else
        format.html { render :new }
        format.json { render json: @admin_event.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /admin/events/1
  # PATCH/PUT /admin/events/1.json
  def update
    date_time_params
    #render :text=>'<pre>'+params.to_yaml and return
    #admin_event.eventpic = params[:eventpic]

    respond_to do |format|
      if @admin_event.update(admin_event_params)
        format.html { redirect_to admin_events_path, notice: 'Event was successfully updated.' }
        format.json { render :show, status: :ok, location: @admin_event }
      else
        format.html { render :edit }
        format.json { render json: @admin_event.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /admin/events/1
  # DELETE /admin/events/1.json
  def destroy
    @admin_event.destroy
    respond_to do |format|
      format.html { redirect_to admin_events_url, notice: 'Event was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def initiate_date_time
    @start_date = ''
    @end_date = ''
    @start_time = ''
    @end_time = ''
  end

  def date_time_params
    params[:admin_event][:event_date_from] = Date.strptime(params[:admin_event][:event_date_from],"%m/%d/%Y").strftime("%Y-%m-%d") if !params[:admin_event][:event_date_from].blank?
    params[:admin_event][:event_date_to] = Date.strptime(params[:admin_event][:event_date_to],"%m/%d/%Y").strftime("%Y-%m-%d") if !params[:admin_event][:event_date_to].blank?
    params[:admin_event][:start_time] = Time.zone.parse(params[:admin_event][:start_time])
    params[:admin_event][:end_time] = Time.zone.parse(params[:admin_event][:end_time])
  end


  private
    # Use callbacks to share common setup or constraints between actions.
    def set_admin_event
      @admin_event = Admin::Event.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def admin_event_params
      params.require(:admin_event).permit(:title, :description, :event_date_from, :event_date_to, :start_time, :end_time, :location, :summery, :eventpic)
    end
end
