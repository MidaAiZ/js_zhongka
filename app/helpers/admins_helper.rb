module AdminsHelper
  def translate_role role
		case role
		when 'super'
			'超级管理员'
		when 'admin'
			'管理员'
		else
			'业务员'
		end
	end
end
