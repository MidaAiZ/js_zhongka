module ApplicationHelper
  def check_cur_ctrl(ctrl)
	  if ctrl.include? params[:controller]
		'nav-active'
	  else
		''
	  end
	end

	def check_cur_act(action)
	  if action.include? params[:action]
		'active'
	  else
		''
	  end
	end

	def format_time time
		inteval = Time.now.midnight - time
		return "今天#{time.strftime('%H:%M')}" if inteval < 0
		return "昨天#{time.strftime('%H:%M')}" if inteval < 1.day
		return "前天#{time.strftime('%H:%M')}" if inteval < 2.day
		return time.strftime("%m-%d %H:%M") if (Time.now.at_beginning_of_year - time) < 0
		time.strftime("%y-%m-%d %H:%M")
	end
end
