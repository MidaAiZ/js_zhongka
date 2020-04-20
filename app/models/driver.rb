class Driver < ApplicationRecord
  has_and_belongs_to_many :orders
  has_and_belongs_to_many :cur_orders, -> { where('start_time <= ? and end_time >= ?', Time.now, Time.now).limit(1)},
                          class_name: 'Order'

  def orders_count
    self.orders.success.count
  end

  def orders_money
    self.orders.success.sum(:price)
  end
end
