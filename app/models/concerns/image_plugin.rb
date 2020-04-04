module ImagePlugin
  extend ActiveSupport::Concern

  # OSS 地址
  OSS_URL = '//static.mxjyu.cn/'
  # OSS large view
  LARGE_VIEW = '?imageMogr2/auto-orient/thumbnail/1000x1000</blur/1x0/quality/75|imageslim'
  # OSS medium view
  MEDIUM_VIEW = '?imageMogr2/auto-orient/thumbnail/500x500>/blur/1x0/quality/75|imageslim'
  # OSS mini view
  THUMB_VIEW = '?imageMogr2/auto-orient/thumbnail/200x200>/blur/1x0/quality/75|imageslim'
  # default url
  DEAULT_URL = 'hema.png'

  included do
    include InstanceMethods
  end

  module ClassMethods
    def image_attr attr, default_type=:thumb, default_url=self::DEAULT_URL
      default_type = default_type.blank? ? '' : "#{default_type}_"
      self.instance_eval do
        define_method(attr) {
          image = read_attribute(attr)
          image.blank? ? default_url : image
        }
        define_method("#{attr}_url") {
          self.class.send "parse_#{default_type}image", self.send(attr)
        }
        define_method("#{attr}_origin_url") {
          self.class.send "parse_image", self.send(attr)
        }
        [:large, :medium, :thumb].each do |type|
          define_method("#{attr}_#{type}_url") {
            self.class.send "parse_#{type}_image", self.send(attr)
          }
        end
      end
    end

    # 解析 image，如果 image 是一个 url 则返回 url，否则在 image 上加上 oss 地址返回 url
    def parse_image image=DEAULT_URL
      /^[a-z]+:\/\/\S+/i === image ? image : self::OSS_URL + image
    end

    # 大图
    def parse_large_image image=DEAULT_URL
      parse_image(image) + self::LARGE_VIEW
    end

    # 中图
    def parse_medium_image image=DEAULT_URL
      parse_image(image) + self::MEDIUM_VIEW
    end

    # 略缩图
    def parse_thumb_image image=DEAULT_URL
      parse_image(image) + self::THUMB_VIEW
    end
  end

  module InstanceMethods
  end
end
