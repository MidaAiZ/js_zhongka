require_relative 'boot'

require "rails"
# Pick the frameworks you want:
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_view/railtie"
require "action_cable/engine"
require "sprockets/railtie"
require "rails/test_unit/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module JsZongka
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 5.1

    config.cache_store = :dalli_store

    config.active_record.schema_format = :sql

    config.active_record.default_timezone = :local
    config.time_zone = 'Beijing'
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # 定时任务
    config.active_job.queue_adapter = :sidekiq
    config.eager_load_paths += %W( #{config.root}/app/jobs )

    # 配置跨域
    # Avoid CORS issues when API is called from the frontend app.
    # Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin AJAX requests.
    # Read more: https://github.com/cyu/rack-cors
    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins 'http://127.0.0.1:8081', 'http://192.168.2.149:8081', 'http://localhost:8081'
        resource '*', :headers => :any, :credentials => true, :methods => [:get, :post, :put, :patch, :delete, :options]
      end
    end
    ENV["ZHONGKA_DB_USER"] = 'mida'
    ENV["ZHONGKA_DATABASE_PASSWORD"] = '112420'
    ENV["SECRET_KEY_BASE"] = 'f13760bb00730dca6334207b7339526310205d1891f3007c9c81052e67c241c87e249874f136c3522a8ab8b30398e8ea18ef78ef7c88541a3f44e3da6966bf69'
  end
end
