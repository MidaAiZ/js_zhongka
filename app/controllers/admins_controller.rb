class AdminsController < ApplicationController
  before_action :check_super, except: [:profile, :update_avatar]
  before_action :set_admin, only: [:update, :destroy]

  # GET /admins
  # GET /admins.json
  def index
    @admins = Admin.un_deleted.all
  end

  def profile
  end

  # POST /admins
  # POST /admins.json
  def create
    @edit_admin = Admin.new(admin_params)
    @edit_admin.role = 'admin'

    respond_to do |format|
      if @edit_admin.save
        format.html { redirect_to @edit_admin }
        format.json { render :show, status: :created, location: @edit_admin }
      else
        format.html { render :new }
        format.json { render json: @edit_admin.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /admins/1
  # PATCH/PUT /admins/1.json
  def update
    prms = admin_params
    (prms.delete :role) if @admin == @edit_admin
    respond_to do |format|
      if @edit_admin.update(prms)
        format.html { redirect_to @edit_admin }
        format.json { render :show, status: :ok, location: @edit_admin }
      else
        format.html { render :edit }
        format.json { render json: @edit_admin.errors, status: :unprocessable_entity }
      end
    end
  end

  def update_avatar
    @edit_admin = @admin
    respond_to do |format|
      if @edit_admin.update(params.require(:admin).permit(:avatar))
        format.html { redirect_to @edit_admin }
        format.json { render :show, status: :ok, location: @edit_admin }
      else
        format.html { render :edit }
        format.json { render json: @edit_admin.errors, status: :unprocessable_entity }
      end
    end
  end


  # DELETE /admins/1
  # DELETE /admins/1.json
  def destroy
    unless @edit_admin.super?
        @code = @edit_admin.update(is_deleted: true)
    end
    respond_to do |format|
      if @code
        format.json { head :no_content }
      else
        format.json { render json: { error: '删除失败,无法删除超级管理员' }, status: 422 }
      end
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_admin
      @edit_admin = Admin.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def admin_params
      params.require(:admin).permit(:number, :password, :name, :avatar, :email, :tel, :role)
    end
end
