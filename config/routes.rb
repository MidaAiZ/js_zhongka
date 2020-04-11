Rails.application.routes.draw do
  resources :orders
  get '' => 'main#index', as: :root

  # session
  get 'login' => 'session#index', as: :login
  post 'login' => 'session#login', as: :do_login
  post 'logout' => 'session#logout', as: :logout

  resources :admins
  get 'profile' => 'admins#profile', as: :profile

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
