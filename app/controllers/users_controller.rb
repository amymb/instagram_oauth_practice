class UsersController < ApplicationController
  def show
    @user = User.find(params[:user_id])
  end

  def album
    redirect_to user_album_path(current_user, params[:album][:id])
  end
end
