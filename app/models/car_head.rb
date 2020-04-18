class CarHead < ApplicationRecord
  has_many :orders,
           foreign_key: :car_number

  enum status: { 正常: 0, 维修中: 1, 调离: 2, 报废: 3 }
end
