require 'test_helper'

class CarBodiesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @car_body = car_bodies(:one)
  end

  test "should get index" do
    get car_bodies_url
    assert_response :success
  end

  test "should get new" do
    get new_car_body_url
    assert_response :success
  end

  test "should create car_body" do
    assert_difference('CarBody.count') do
      post car_bodies_url, params: { car_body: { body_id: @car_body.body_id, body_type: @car_body.body_type, brand: @car_body.brand, status: @car_body.status } }
    end

    assert_redirected_to car_body_url(CarBody.last)
  end

  test "should show car_body" do
    get car_body_url(@car_body)
    assert_response :success
  end

  test "should get edit" do
    get edit_car_body_url(@car_body)
    assert_response :success
  end

  test "should update car_body" do
    patch car_body_url(@car_body), params: { car_body: { body_id: @car_body.body_id, body_type: @car_body.body_type, brand: @car_body.brand, status: @car_body.status } }
    assert_redirected_to car_body_url(@car_body)
  end

  test "should destroy car_body" do
    assert_difference('CarBody.count', -1) do
      delete car_body_url(@car_body)
    end

    assert_redirected_to car_bodies_url
  end
end
