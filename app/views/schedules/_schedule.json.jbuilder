json.extract! schedule, :id, :name, :begin_time, :end_time, :car_head_id, :car_body_id, :executor, :desc, :created_at, :updated_at
json.url schedule_url(schedule, format: :json)
