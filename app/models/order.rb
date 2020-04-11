class Order < ApplicationRecord
  before_create :gen_number_series
  before_update do # 记录上一个状态
    self.last_state = self.state_was if self.will_save_change_to_state?
  end

  validates :price, numericality: { greater_than_or_equal_to: 0 }
  validates :remark, length: { maximum: 1024, too_long: '订单备注最大长度为%{count}' }
  # validates :pay_type, inclusion: { in: %w[ali wx] }, allow_blank: true
  validates :state, presence: true, allow_blank: false

  scope :with_del, -> { unscope(where: :is_deleted) }
  scope :deleted, -> { where(is_deleted: true) }
  scope :undeleted, -> { where(is_deleted: false) }
  scope :success, -> { unscope(where: :state).where(state: [1, 2, 3, 4, 5]) }
  scope :timeout, -> { unscope(where: :state).onpaying.where('created_at < ?', Time.now - 7.days) }
  scope :onprogress, -> { unscope(where: :state).where(state: %i[onpaying ondelivering onreceiving oncommenting]) }
  default_scope { order(created_at: :desc) }

  # 0=>待付款, 1=>待发货, 2=>待签收, 3=>待评论, 4=>已完成, 5=>退款中, 6=>已退款, 7=>已取消, 8=>已删除
  enum state: { onpaying: 0, ondelivering: 1, onreceiving: 2, oncommenting: 3, completed: 4, onrefunding: 5, refunded: 6, canceled: 7 }

  def self.new(attrs = {}, &blk)
    order = super &blk
    order.attributes = attrs
    order.state = :completed
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

  def pay!(payinfo = {})
    ondelivering! # 保存并设置下一状态
  end

  def delivery!
      onreceiving!
  end

  def receive!
    completed!
  end

  def cancel!
    canceled!
  end

  def refund! reason=''
    refunded!
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
    if cons[:keywords]
      ids = _self.joins(:shipping_addr).where(order_shipping_addrs: { phone: cons[:keywords] }).ids
      ids = ids.concat _self.joins(:user).where(users: { number: cons[:keywords] }).ids
      _self = _self.where('id in (?) or number like ?', ids, "%#{cons[:keywords]}%")
    end
    _self = _self.unscope(where: :states).where(state: cons[:states]) if cons[:states] # 数组
    _self = _self.where('number LIKE ?', "%#{cons[:number]}%") if cons[:number]
    _self = _self.where('orders.start_time <= ?', cons[:created_before]) if cons[:created_before]
    _self = _self.where('orders.start_time >= ?', cons[:created_after]) if cons[:created_after]
    _self = _self.where('price <= ?', cons[:price_ceil]) if cons[:price_ceil]
    _self = _self.where('price >= ?', cons[:price_floor]) if cons[:price_floor]
    _self
  end

  def payed?
    !onpaying? && !canceled?
  end

  def self.STATE_TEXT
    {
      onpaying: '待付款',
      ondelivering: '待配送',
      onreceiving: '待收货',
      completed: '已完成',
      canceled: '已取消',
      onrefunding: '退款中',
      refunded: '已退款'
    }
  end

  def state_text
    self.class.STATE_TEXT[state.to_sym] || state
  end

  # 修改订单附属参数的函数
  def address=(attrs)
    shipping_addr.update! attrs
  end

  def can_refund? # 判断订单能否退款
    # return false if receive_time && (Time.now - receive_time > 30.days)
    # payed? && !onrefunding? && !refunded?
    true
  end

  def can_shipping? # 判断订单能否配送
    # ondelivering?
    true
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

  private

  def gen_number_series
    now = Time.now
    series = now.year.to_s + now.month.to_s + now.day.to_s
    series += rand.to_s.gsub!('0.', '')
    series
  end
end
