class ApplicationController < ActionController::Base
  before_action :setup_res_elements
  before_action :check_login, :check_permission

  def setup_res_elements
    @code
    @errors = []
  end

  def set_code!(code = nil)
    # 判断 code 是否是字符串，如是则赋值，否则将 code 转 bool 并赋值:Success或:Fail
    @code = /./ === code ? code : (code ? :Success : :Fail)
  end

  def ensure_code(code = nil)
    @code ||= /./ === code ? code : (code ? :Success : :Fail)
  end

  def success?
    @code == :Success
  end

  def fail? # 规定!success即是fail
    !success?
  end

  def success!
    set_code! :Success
  end

  def fail!
    set_code! :Fail
  end

  def error!(message)
    message.instance_of?(Array) ? @errors.concat(message) : @errors << message
  end

  def render_default(res = {})
    set_code! res[:code] if res[:code]
    error! res[:error] if res[:error]
    @res_json = res[:json] if res[:json]
    render '/default', status: res[:status] || :ok
    nil
  end

  def check_login
    # 严格验证的安全模式，不允许IP地址变化，防止跨站点脚本攻击
    @admin = Admin.fetch_login_admin request, session
  end

  def require_login
    redirect_to(login_path) && return unless @admin || check_login
  end

  def can?(role)
    role.include? @admin.role.to_sym
  end

  def check_super
    unless @admin.super?
      respond_to do |fomat|
        fomat.json { render json: { count: :NoPermission } }
        fomat.html { redirect_to root_path, notice: :NoPermission }
      end
      nil
    end
  end

  def cache_key
    "#{params[:controller]}_#{params[:action]}"
  end

  def self.cache_key
    "#{params[:controller]}_#{params[:action]}"
  end

  def check_permission
    redirect_to(login_path) && return unless @admin && @admin.can?(self.class, action_name)
  end
end
