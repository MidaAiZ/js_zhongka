class Admin < ApplicationRecord
  include AvatarPlugin
  # 头像管理
  avatar_attr :avatar, :thumb

  # 使用插件建立用户密码验证体系
  has_secure_password

  validates :number, presence: true, uniqueness: { message: '该帐号已被注册' },
                      length: { minimum: 2, maximum: 16 },
                      format: { with: Validate::VALID_ACCOUNT_REGEX },
                      allow_blank: false
  validates :role, presence: true,
                length: { minimum: 1, too_short: "管理员角色不能为空",
                          maximum: 32, too_long: '角色名%{count}个字符' }

  validates :password, presence: true, length: { minimum: 6, maximum: 20 },
                        format: { with: Validate::VALID_PASSWORD_REGEX },
                        allow_blank: false, on: [:create   ]
  validates :password_digest, presence: true, allow_blank: false, on: [:update]

  # validates :number, uniqueness: true
  # validates :password_digest, allow_blank: false

  enum role: { super: 'super', admin: 'admin', common: 'common' }

  scope :un_deleted, ->() { where(is_deleted: false) }
  scope :with_del, -> { unscope(where: :is_deleted) }

  def has_role? role
    self.role.to_sym == role.to_sym
  end

  def self.do_login number, password, request, session
    admin = self.find_by_number(number).try(:authenticate, password)
    if admin
      session[:admin_id] = admin.id
      session[:ip] = request.remote_ip
    end
    admin
  end

  def self.do_logout session
    session[:admin_id] = nil
    session[:ip] = nil
  end

  def self.fetch_login_admin request, session
    # 严格验证的安全模式，不允许IP地址变化，防止跨站点脚本攻击
    return nil if request.remote_ip != session[:ip]
    self.find_by_id session[:admin_id]
  end

  def roles
    case role.to_sym
    when :super
    when :common
    when :delivery
    else
    end
  end

  def can? controller, action
    return true
  end
end
