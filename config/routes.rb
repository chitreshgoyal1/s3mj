Rails.application.routes.draw do
  
  root 'frontend#index'

  namespace :admin do
    resources :welcomedata
    resources :sharevideos
    resources :snotices
    resources :scustservices
    resources :sthirdparties
    resources :smedialists
    resources :galleries
    resources :services
    resources :clients
    resources :about_mes
    resources :events
    resources :contact_infos
    resources :users
  end

  #resources :frontend, only: :index

  devise_for :users
  
  devise_scope :user do
    get "/login" => "devise/sessions#new"
    get "/logout" => "devise/sessions#destroy"
  end
     
  get '/about_us' => 'frontend#about_us', as: 'about_us'
  get '/gallery' => 'frontend#gallery', as: 'gallery'
  
  get '/events' => 'frontend#events', as: 'events'
  get '/events/:filter' => 'frontend#events', as: 'filter_events'
  get '/event_detail/:id' => 'frontend#event_detail', as: 'event_detail'

  get '/services' => 'frontend#services', as: 'services'
  get '/contact_us' => 'frontend#contact_us', as: 'contact_us'
  
  get '/index' => 'frontend#index', as: 'index'
  # If invalid path entered, automatically user will be redirected to home page
  get '*path' => redirect('/')
  
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
