module AvatarPlugin
  extend ActiveSupport::Concern
  include ImagePlugin

  included do
    self::DEAULT_URL = 'hema.png'
  end

  module ClassMethods
    def avatar_attr *args, &blk
      image_attr *args, &blk
    end
  end
end
