require 'test_helper'

class OrdersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @order = orders(:one)
  end

  test "should get index" do
    get orders_url
    assert_response :success
  end

  test "should get new" do
    get new_order_url
    assert_response :success
  end

  test "should create order" do
    assert_difference('Order.count') do
      post orders_url, params: { order: { car_body_id: @order.car_body_id, car_number: @order.car_number, customer_id: @order.customer_id, destination: @order.destination, distance: @order.distance, driver_id: @order.driver_id, end_time: @order.end_time, goods: @order.goods, oil_consumption: @order.oil_consumption, oil_fee: @order.oil_fee, order_number: @order.order_number, origin: @order.origin, price: @order.price, road_toll: @order.road_toll, sale_name: @order.sale_name, start_time: @order.start_time, state: @order.state, toll_gate: @order.toll_gate, weight: @order.weight } }
    end

    assert_redirected_to order_url(Order.last)
  end

  test "should show order" do
    get order_url(@order)
    assert_response :success
  end

  test "should get edit" do
    get edit_order_url(@order)
    assert_response :success
  end

  test "should update order" do
    patch order_url(@order), params: { order: { car_body_id: @order.car_body_id, car_number: @order.car_number, customer_id: @order.customer_id, destination: @order.destination, distance: @order.distance, driver_id: @order.driver_id, end_time: @order.end_time, goods: @order.goods, oil_consumption: @order.oil_consumption, oil_fee: @order.oil_fee, order_number: @order.order_number, origin: @order.origin, price: @order.price, road_toll: @order.road_toll, sale_name: @order.sale_name, start_time: @order.start_time, state: @order.state, toll_gate: @order.toll_gate, weight: @order.weight } }
    assert_redirected_to order_url(@order)
  end

  test "should destroy order" do
    assert_difference('Order.count', -1) do
      delete order_url(@order)
    end

    assert_redirected_to orders_url
  end
end
