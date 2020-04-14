class CarBodiesController < ApplicationController
  before_action :set_car_body, only: [:show, :edit, :update, :destroy]

  # GET /car_bodies
  # GET /car_bodies.json
  def index
    @car_bodies = CarBody.all
  end

  # GET /car_bodies/1
  # GET /car_bodies/1.json
  def show
  end

  # GET /car_bodies/new
  def new
    @car_body = CarBody.new
  end

  # GET /car_bodies/1/edit
  def edit
  end

  # POST /car_bodies
  # POST /car_bodies.json
  def create
    @car_body = CarBody.new(car_body_params)

    respond_to do |format|
      if @car_body.save
        format.html { redirect_to @car_body, notice: 'Car body was successfully created.' }
        format.json { render :show, status: :created, location: @car_body }
      else
        format.html { render :new }
        format.json { render json: @car_body.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /car_bodies/1
  # PATCH/PUT /car_bodies/1.json
  def update
    respond_to do |format|
      if @car_body.update(car_body_params)
        format.html { redirect_to @car_body, notice: 'Car body was successfully updated.' }
        format.json { render :show, status: :ok, location: @car_body }
      else
        format.html { render :edit }
        format.json { render json: @car_body.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /car_bodies/1
  # DELETE /car_bodies/1.json
  def destroy
    @car_body.destroy
    respond_to do |format|
      format.html { redirect_to car_bodies_url, notice: 'Car body was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_car_body
      @car_body = CarBody.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def car_body_params
      params.require(:car_body).permit(:body_id, :body_type, :max_weight, :brand, :status)
    end
end
