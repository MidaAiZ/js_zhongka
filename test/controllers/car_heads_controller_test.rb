require 'test_helper'

class CarHeadsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @car_head = car_heads(:one)
  end

  test "should get index" do
    get car_heads_url
    assert_response :success
  end

  test "should get new" do
    get new_car_head_url
    assert_response :success
  end

  test "should create car_head" do
    assert_difference('CarHead.count') do
      post car_heads_url, params: { car_head: { brand: @car_head.brand, car_number: @car_head.car_number, head_type: @car_head.head_type, status: @car_head.status } }
    end

    assert_redirected_to car_head_url(CarHead.last)
  end

  test "should show car_head" do
    get car_head_url(@car_head)
    assert_response :success
  end

  test "should get edit" do
    get edit_car_head_url(@car_head)
    assert_response :success
  end

  test "should update car_head" do
    patch car_head_url(@car_head), params: { car_head: { brand: @car_head.brand, car_number: @car_head.car_number, head_type: @car_head.head_type, status: @car_head.status } }
    assert_redirected_to car_head_url(@car_head)
  end

  test "should destroy car_head" do
    assert_difference('CarHead.count', -1) do
      delete car_head_url(@car_head)
    end

    assert_redirected_to car_heads_url
  end
end
