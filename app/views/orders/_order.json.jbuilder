json.extract! order, :id, :order_number, :price, :driver_id, :car_number, :car_body_id, :goods, :weight, :origin, :destination, :distance, :start_time, :end_time, :oil_consumption, :oil_fee, :toll_gate, :road_toll, :state, :customer_id, :sale_name, :created_at, :updated_at
json.url order_url(order, format: :json)
