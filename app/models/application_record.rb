class ApplicationRecord < ActiveRecord::Base
  include UnionScope

  self.abstract_class = true

  def self.cache_key id
    "#{self.cache_prefix}_#{id}"
  end

  def self.cache_prefix
    "#{self.name}"
  end

  def self.fetch id
    Cache.new.fetch(cache_key(id), 3.minutes) {
      record = self.unscope(:where).find_by_id(id)
      record ? record : false # 防止恶意缓存攻击
    }
  end

  def self.pure_attrs # 除主键外的所有属性
    attrs = self.new.attributes
    attrs.delete self.primary_key
    attrs
  end

  def cache_key
    self.class.cache_key(self.id)
  end

  def update_cache
    Cache.new[self.cache_key, 3.minutes] = self if Cache.new[self.cache_key]
  end

  def clear_cache
    Cache.new[self.cache_key] = nil
  end

  # 锁机制
  def redis_lock
    [1, true].include?($redis.set lock_key, 1, nx: true, ex: 60)
  end

  def redis_lock!
    raise 'lock_error' unless redis_lock
    true
  end

  def redis_lock?
    !!($redis.get lock_key)
  end

  def redis_unlock
    $redis.del lock_key
  end

  alias :redis_unlock! :redis_unlock

  def lock_key
    "#{self.class.name}_#{self.id}"
  end
end
