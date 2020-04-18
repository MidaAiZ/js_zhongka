source 'https://gems.ruby-china.com'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 5.1.7'
# Use postgresql as the database for Active Record
gem 'pg', '>= 0.18', '< 2.0'
# Use Puma as the app server
gem 'puma', '~> 3.7'
# Use SCSS for stylesheets
gem 'sass-rails', '~> 5.0'

# bootstrap 3
gem 'bootstrap-sass'

#日期选择插件
gem 'bootstrap-datepicker-rails'
gem 'bootstrap3-datetimepicker-rails'
gem "momentjs-rails"

# 分页插件
gem 'kaminari'

# 前端图片上传裁剪jQuery插件
gem 'cropper-rails'

#froalaEditor 编辑器
gem "wysiwyg-rails"

# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'
# See https://github.com/rails/execjs#readme for more supported runtimes
# gem 'therubyracer', platforms: :ruby

# Use jquery as the JavaScript library
gem 'jquery-rails'

# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.5'
# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 4.0'
# Use ActiveModel has_secure_password

# 七牛云存储
gem 'qiniu'

#Use ActiveModel has_secure_password
gem 'bcrypt', '~> 3.1.7'

# 验证码插件
gem 'rucaptcha'

# memcache插件，用于缓存
gem 'dalli'

# 生成xlsx
gem 'rubyzip', '>= 1.2.1'
gem 'axlsx', git: 'https://github.com/randym/axlsx.git', ref: 'c8ac844'
gem 'axlsx_rails'

# 定时器
gem 'sidekiq'
gem 'sidetiq'
gem 'sidekiq-scheduler'
gem 'sinatra' # 用于使用自带的监控页面

# 解决前后端分离跨域问题
gem 'rack-cors', :require => 'rack/cors'

# 缓存以及定时器依赖
gem "redis"
gem "redis-rails"
gem 'redis-namespace'
gem 'redis-rack-cache'

# Use Capistrano for deployment
gem 'capistrano-rails', group: :development

# Use Unicorn as the app server
gem 'unicorn'

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
  # Adds support for Capybara system testing and selenium driver
  gem 'capybara', '>= 2.15'
  gem 'selenium-webdriver'
end

group :development do
  # Access an IRB console on exception pages or by using <%= console %> anywhere in the code.
  gem 'web-console', '>= 3.3.0'
  gem 'listen', '>= 3.0.5', '< 3.2'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
