class CarHeadsController < ApplicationController
  before_action :set_car_head, only: [:show, :edit, :update, :destroy]

  # GET /car_heads
  # GET /car_heads.json
  def index
    @car_heads = CarHead.all
  end

  # GET /car_heads/1
  # GET /car_heads/1.json
  def show
    @orders = @car_head.orders.includes(:drivers, :sales, :car_head, :car_body)
  end

  # GET /car_heads/new
  def new
    @car_head = CarHead.new
  end

  # GET /car_heads/1/edit
  def edit
  end

  # POST /car_heads
  # POST /car_heads.json
  def create
    @car_head = CarHead.new(car_head_params)

    respond_to do |format|
      if @car_head.save
        format.html { redirect_to @car_head, notice: 'Car head was successfully created.' }
        format.json { render :show, status: :created, location: @car_head }
      else
        format.html { render :new }
        format.json { render json: @car_head.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /car_heads/1
  # PATCH/PUT /car_heads/1.json
  def update
    respond_to do |format|
      if @car_head.update(car_head_params)
        format.html { redirect_to @car_head, notice: 'Car head was successfully updated.' }
        format.json { render :show, status: :ok, location: @car_head }
      else
        format.html { render :edit }
        format.json { render json: @car_head.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /car_heads/1
  # DELETE /car_heads/1.json
  def destroy
    @car_head.destroy
    respond_to do |format|
      format.html { redirect_to car_heads_url, notice: 'Car head was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_car_head
      @car_head = CarHead.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def car_head_params
      params.require(:car_head).permit(:car_number, :head_type, :fuel_type, :brand, :status)
    end
end
