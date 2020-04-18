class Order < ApplicationRecord
  before_create :gen_number_series
  before_update do # 记录上一个状态
    self.last_state = self.state_was if self.will_save_change_to_state?
  end

  validates :price, numericality: { greater_than_or_equal_to: 0 }
  # validates :remark, length: { maximum: 1024, too_long: '订单备注最大长度为%{count}' }
  # validates :pay_type, inclusion: { in: %w[ali wx] }, allow_blank: true
  validates :state, presence: true, allow_blank: false

  scope :with_del, -> { unscope(where: :is_deleted) }
  scope :deleted, -> { where(is_deleted: true) }
  scope :undeleted, -> { where(is_deleted: false) }
  scope :success, -> { unscope(where: :state).where(state: [1, 2, 3, 4, 5]) }
  scope :timeout, -> { unscope(where: :state).onpaying.where('created_at < ?', Time.now - 7.days) }
  scope :onprogress, -> { unscope(where: :state).where(state: %i[onpaying1 onloading ondelivering onpaying2]) }
  default_scope { order(created_at: :desc) }

  # 0=>待付首款, 1=>装车中, 2=>运输中, 3=>已送达, 4=>待付尾款, 5=>已完成, 6=>订单取消, 7=>已退款
  enum state: { onpaying1: 0, onloading: 1, ondelivering: 2, arrived: 3, onpaying2: 4, completed: 5, canceled: 6, refunded: 7 }

  has_and_belongs_to_many :drivers
  has_and_belongs_to_many :sales

  belongs_to :car_head,
             foreign_key: :car_number,
             optional: true

  belongs_to :car_body,
             optional: true

  def self.new(attrs = {}, &blk)
    order = super &blk
    order.attributes = attrs
    order.state ||= :completed
    order
  end

  def self.create!(*args, &blk)
    order = new
    order.create! *args, &blk
  end

  def create!(attrs)
    order = self
    order.attributes = attrs
    order.save!
    order
  end

  # 所有订单禁止真删除
  def delete
    delete!
  rescue StandardError
    false
  end

  def delete!
    is_deleted = true
    save!
  end

  def self.destroy
    delete!
  rescue StandardError
    false
  end

  def self.destroyed!
    delete!
  end

  def self.filter(cons = {})
    _self = self
    _self = _self.where(id: (Driver.find_by_id(cons[:driver_id]) || Driver.none).orders) if cons[:driver_id]
    _self = _self.where(id: (Sale.find_by_id(cons[:sale_id]) || Sale.none).orders) if cons[:sale_id]
    if cons[:keywords]
      k = cons[:keywords]
      _self = _self.where('order_number like ?
                           OR origin LIKE ?
                           OR destination LIKE ?
                           OR customer_name LIKE ?
                           OR customer_tel LIKE ?',
                           "%#{k}%", "%#{k}%", "%#{k}%", "%#{k}%", "%#{k}%")
    end
    _self = _self.unscope(where: :states).where(state: cons[:states]) if cons[:states] # 数组
    _self = _self.success if cons[:state_] == "success"
    _self = _self.onprogress if cons[:state_] == "onprogress"
    _self = _self.unscope(where: :states).where(state: cons[:states]) if cons[:states] # 数组

    _self = _self.where('origin LIKE ?', "%#{cons[:origin]}%") if cons[:origin]
    _self = _self.where('destination LIKE ?', "%#{cons[:destination]}%") if cons[:destination]
    _self = _self.where('orders.start_time <= ?', cons[:fache_before]) if cons[:fache_before]
    _self = _self.where('orders.start_time >= ?', cons[:fache_after]) if cons[:fache_after]
    _self = _self.where('price <= ?', cons[:price_ceil]) if cons[:price_ceil]
    _self = _self.where('price >= ?', cons[:price_floor]) if cons[:price_floor]
    _self
  end

  def payed?
    !onpaying? && !canceled?
  end

  def self.STATE_TEXT
    {
      onpaying1: '待付首款',
      onloading: '装车中',
      ondelivering: '运输中',
      arrived: '已送达',
      onpaying2: '待付尾款',
      completed: '已完成',
      canceled: '已取消',
      refunded: '已退款'
    }
  end

  def state_text
    self.class.STATE_TEXT[state.to_sym] || state
  end

  def close! # 关闭订单
    # return refund! if can_refund?
    cancel!
  end

  def pay_type_text
    # return '支付宝' if self.pay_type == 'ali'
    # return '微信' if self.pay_type == 'wx'
    self.pay_type
  end

  def drivers_name
    (drivers.map {|d| d.name}).join(', ')
  end

  def sales_name
    (sales.map {|s| s.name}).join(', ')
  end

  private

  def gen_number_series
    now = Time.now
    series = now.year.to_s + now.month.to_s + now.day.to_s
    series += rand.to_s.gsub!('0.', '')
    self.order_number = series
    series
  end
end
