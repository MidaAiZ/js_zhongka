class Schedule < ApplicationRecord
  enum state: { 排期中: 0, 执行中: 1, 已执行: 2, 已超期: 3 }

  belongs_to :car_head,
             optional: true

  belongs_to :car_body,
             optional: true

   def self.filter(cons = {})
     _self = self
     if cons[:keywords]
       k = cons[:keywords]
       _self = _self.where('name like ? OR executor like ?', "%#{k}%", "%#{k}%")
     end
     _self = _self.unscope(where: :states).where(state: cons[:states]) if cons[:states] # 数组
     _self = _self.where('orders.end_time <= ?', cons[:fache_before]) if cons[:begin_before]
     _self = _self.where('orders.begin_time >= ?', cons[:fache_after]) if cons[:begin_after]
     _self
   end
end
