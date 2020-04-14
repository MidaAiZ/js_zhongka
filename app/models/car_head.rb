class CarHead < ApplicationRecord
  enum status: { 正常: 0, 维修中: 1, 调离: 2, 报废: 3 }
end
