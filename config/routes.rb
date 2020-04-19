Rails.application.routes.draw do
  resources :schedules
  resources :sales
  resources :drivers
  resources :car_bodies
  resources :car_heads
  resources :orders
  resources :admins

  get '' => 'main#index', as: :root

  # session
  get 'login' => 'session#index', as: :login
  post 'login' => 'session#login', as: :do_login
  post 'logout' => 'session#logout', as: :logout

  get 'profile' => 'admins#profile', as: :profile

  # counts
  get 'counts' => 'main#counts'
  get 'products_count' => 'main#products_count'
  get 'viewers_count' => 'main#viewers_count'
  get 'total_count' => 'main#total_count'
  get 'statistic_order_map' => 'main#statistic_order_map'
  post 'upload_token' => 'image_uploader#get_upload_token'
  post 'upload_video_token' => 'image_uploader#upload_video_token'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
