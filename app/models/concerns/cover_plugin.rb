module CoverPlugin
  extend ActiveSupport::Concern
  include ImagePlugin

  included do
  end

  module ClassMethods
    def cover_attr *args, &blk
      image_attr *args, &blk
    end
  end
end
