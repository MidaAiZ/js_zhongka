class Sale < ApplicationRecord
  has_and_belongs_to_many :orders

  def orders_count
    self.orders.success.count
  end

  def orders_money
    self.orders.success.sum(:price)
  end
end
