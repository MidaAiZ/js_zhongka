class MainController < ApplicationController
  def index
    @schedules = Schedule.limit(3)
    @orders = Order.limit(10)
  end

  def counts
    info = Rails.cache.fetch(cache_key.to_s, expires_in: 5.minutes) do
      set_counts
    end

    render json: info.to_json
  end

  def products_count
    info = Rails.cache.fetch(cache_key.to_s, expires_in: 10.minutes) do
      cates = Category.limit(5)
      counts = {}
      cates.each do |c|
        counts[c.name] = c.products.count
      end
      counts['其它'] = (counts['其它'] || 0) +
                     Product.where.not(category_id: cates.map(&:id)).count +
                     Product.where(category_id: nil).count
      counts
    end

    render json: info.to_json
  end

  def statistic_order_map
    render json: Order.statistics_map(10.days.ago.midnight, Time.now)
  end

  def total_count
    info = Rails.cache.fetch(cache_key.to_s, expires_in: 10.minutes) do
      set_m_p_v_info
    end

    render json: info.to_json
  end

  def viewers_count
    info = Rails.cache.fetch(cache_key.to_s, expires_in: 10.minutes) do
      set_v_info
    end

    # 每新的一天清除旧缓存
    interval = Time.now - Time.now.midnight
    if (interval < 10.minutes) && (interval < Time.now - info[:time])
      Rails.cache.delete cache_key
      info = set_v_info
      info_0 = set_v_info_0
    else
      info_0 = Rails.cache.fetch("#{cache_key}_0", expires_in: 1.minutes) do
        set_v_info_0
      end
    end

    render json: info.merge(info_0).to_json
  end

  private

  def set_counts
    {
      o_count: Order.unscope(:where).count, # 订单总数
      c_count: CarHead.unscope(:where).count, # 车辆总数
      s_count: Schedule.unscope(:where).count, # 计划总数
      total_money: Order.success.sum(:price), # 总成交金额
      t_o_count: Order.where(created_at: Time.now.midnight..Time.now).count, # 今日订单
      t_s_count: Schedule.where("begin_time <= ? and end_time >= ?", 1.days.after.midnight, Time.now.midnight).count, # 今日计划
      today_money: Order.where(created_at: Time.now.midnight..Time.now).success.sum(:price) # 今日成交额
    }
  end

  def set_v_info
    {
      # 营收
      m_1_count: Order.success.where(created_at: 1.day.ago.midnight..Time.now.midnight).sum(:price), # 昨天收益
      m_2_count: Order.success.where(created_at: 2.days.ago.midnight..1.day.ago.midnight).sum(:price), # 前天收益
      m_3_count: Order.success.where(created_at: 3.days.ago.midnight..2.days.ago.midnight).sum(:price), # 大前天收益
      m_4_count: Order.success.where(created_at: 4.days.ago.midnight..3.days.ago.midnight).sum(:price), # 前四天收益
      m_5_count: Order.success.where(created_at: 5.days.ago.midnight..4.days.ago.midnight).sum(:price), # 前五天收益
      m_6_count: Order.success.where(created_at: 6.days.ago.midnight..5.days.ago.midnight).sum(:price), # 前六天收益
      m_7_count: Order.success.where(created_at: 7.days.ago.midnight..6.days.ago.midnight).sum(:price), # 前七天收益

      c_1_count: Order.where(created_at: 1.day.ago.midnight..Time.now.midnight).sum(:total_fee), # 昨天运营成本
      c_2_count: Order.where(created_at: 2.days.ago.midnight..1.day.ago.midnight).sum(:total_fee), # 前天运营成本
      c_3_count: Order.where(created_at: 3.days.ago.midnight..2.days.ago.midnight).sum(:total_fee), # 大前天运营成本
      c_4_count: Order.where(created_at: 4.days.ago.midnight..3.days.ago.midnight).sum(:total_fee), # 前四天运营成本
      c_5_count: Order.where(created_at: 5.days.ago.midnight..4.days.ago.midnight).sum(:total_fee), # 前五天运营成本
      c_6_count: Order.where(created_at: 6.days.ago.midnight..5.days.ago.midnight).sum(:total_fee), # 前六天运营成本
      c_7_count: Order.where(created_at: 7.days.ago.midnight..6.days.ago.midnight).sum(:total_fee), # 前七天运营成本

      # 订单交易量
      o_1_count: Order.where(created_at: 1.day.ago.midnight..Time.now.midnight).count, # 昨天交易量
      o_2_count: Order.where(created_at: 2.days.ago.midnight..1.day.ago.midnight).count, # 前天交易量
      o_3_count: Order.where(created_at: 3.days.ago.midnight..2.days.ago.midnight).count, # 大前天交易量
      o_4_count: Order.where(created_at: 4.days.ago.midnight..3.days.ago.midnight).count, # 前四天交易量
      o_5_count: Order.where(created_at: 5.days.ago.midnight..4.days.ago.midnight).count, # 前五天交易量
      o_6_count: Order.where(created_at: 6.days.ago.midnight..5.days.ago.midnight).count, # 前六天交易量
      o_7_count: Order.where(created_at: 7.days.ago.midnight..6.days.ago.midnight).count, # 前七天交易量

      # 记录缓存时间
      time: Time.now
    }
  end

  def set_v_info_0
    {
      c_1_count: Order.where(created_at: Time.now.midnight..Time.now).sum(:total_fee), # 昨天交易量
      m_0_count: Order.success.where(created_at: Time.now.midnight..Time.now).sum(:price), # 今日收入
      o_0_count: Order.where(created_at: Time.now.midnight..Time.now).count # 商品今天购买量
    }
  end

  def set_m_p_v_info
    {
      p_t_v_count: Order.where(updated_at: Time.now.midnight..Time.now).count, # 商品今天访客量
      p_v_count: Order.count, # 商品总访客量
      total_viewers_count: LoginRecord.count # 本站总访客量
    }
  end
end
