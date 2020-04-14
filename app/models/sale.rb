class Sale < ApplicationRecord
  has_and_belongs_to_many :orders

  def orders_count
    0
  end
end
