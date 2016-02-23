class FrontendController < ApplicationController
  skip_before_filter :authenticate_user!
  before_action :redirect_to_loggedin_page
  before_action :footer_data
  
  def index 
    @events = Admin::Event.where('event_date_from >= (?)', Date.new(Time.now.year,1).beginning_of_month).limit(3)
    @prev_events = Admin::Event.where('event_date_from < (?)', Date.new(Time.now.year,1).beginning_of_month).limit(3)    

    @clients = Admin::Client.all
    @articlecount = 0
    @clients.count.times do |i|
      if i%3 == 0
        @articlecount = @articlecount+1
      end
    end

    @admin_welcomedata = Admin::Welcomedatum.all
    
    @admin_sharevideos = Admin::Sharevideo.all

  end
  
  def about_us
    @about_mes = Admin::AboutMe.all
    @clients = Admin::Client.all
  end
  
  def contact_us
    @admin_contact_infos = Admin::ContactInfo.all
  end
  
  def services
    @services = Admin::Service.all
  end
  
  def events
    if params[:filter] == 'current'
      @events = Admin::Event.where('event_date_from = (?) or event_date_from <= (?) and event_date_to >= (?)', Date.today, Date.today, Date.today).order(:event_date_from)
      @title = 'current'
    elsif params[:filter] == 'upcoming'
      @events = Admin::Event.where('event_date_from > (?)', Date.today).order(:event_date_from)
      @title = 'upcoming'
    elsif params[:filter] == 'past'
      @events = Admin::Event.where('event_date_to < (?)', Date.today).order(:event_date_to)
      @title = 'past'
    else
      @events = Admin::Event.all
      @title = 'all'
    end
  end

  def event_detail
    @event = Admin::Event.find(params[:id])
  end
  
  def gallery
    @admin_galleries = Admin::Gallery.all
  end
  
end
