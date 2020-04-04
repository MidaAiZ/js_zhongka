class SessionController < ApplicationController
  layout false
  skip_before_action :check_permission

  def index; end

  def login
    prms = params[:admin]
    set_code! !!(@admin = Admin.do_login(prms[:number], prms[:password], request, session))
    @code ||= 'Fail'
    respond_to do |fomat|
      fomat.json { render json: { code: @code } }
      fomat.html { redirect_to root_path }
    end
  end

  def logout
    Admin.do_logout session
    respond_to do |fomat|
      fomat.json { render json: { code: 'Success' } }
      fomat.html { redirect_to login_path }
    end
  end
end
