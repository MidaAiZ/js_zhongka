class OrdersController < ApplicationController
  before_action :filter_cons, only: [:index, :onprogress, :completed, :onrefunding, :refunded, :export_xlsx]
  before_action :set_order, only: [:show, :edit, :update, :delivery, :refund, :cancel]


  # GET /orders
  # GET /orders.json
  def index
   nonpaged_orders = Order.filter(@cons)
   @orders = nonpaged_orders.page(@page).per(@count)
  end

  # GET /orders/1
  # GET /orders/1.json
  def show
  end

  # GET /orders/new
  def new
    @order = Order.new
  end

  # GET /orders/1/edit
  def edit
  end

  # POST /orders
  # POST /orders.json
  def create
    @order = Order.new(order_params)
    respond_to do |format|
      if @order.save
        format.html { redirect_to @order, notice: '订单已创建.' }
        format.json { render :show, status: :created, location: @order }
      else
        format.html { render :new }
        format.json { render json: @order.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /orders/1
  # PATCH/PUT /orders/1.json
  def update
    respond_to do |format|
      if @order.update(order_params)
        format.html { redirect_to @order, notice: '订单已更新.' }
        format.json { render :show, status: :ok, location: @order }
      else
        format.html { render :edit }
        format.json { render json: @order.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /orders/1
  # DELETE /orders/1.json
  def destroy
    @order.destroy
    respond_to do |format|
      format.html { redirect_to orders_url, notice: '订单已删除.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_order
      @order = Order.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def order_params
      params.require(:order).permit(:price, :driver_id, :car_number, :car_body_id, :goods, :weight, :origin, :destination, :distance, :start_time, :end_time, :oil_consumption, :oil_fee, :toll_gate, :road_toll, :state, :customer_id, :sale_name, :pay_type, :pay_time, :remark)
    end

    def filter_cons
		@count = params[:count] || 20
		@page = params[:page] || 1
		@cons = params.slice(:keywords, :states, :pay_types, :number, :created_before, :created_after, :pay_before, :pay_after, :price_ceil, :price_floor)
	end
end
