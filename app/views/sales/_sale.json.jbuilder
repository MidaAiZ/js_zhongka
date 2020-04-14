json.extract! sale, :id, :name, :tel, :gender, :age, :join_time, :info, :remark, :orders_count, :created_at, :updated_at
json.url sale_url(sale, format: :json)
