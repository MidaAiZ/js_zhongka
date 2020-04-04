json.extract! admin, :id, :number, :name, :avatar
json.created_at admin.created_at.strftime('%Y-%m-%d %H:%M:%S')
json.role translate_role admin.role
json.password "********"
