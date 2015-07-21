class WelcomeController < ApplicationController

  def index
    if current_user.present?
      @user = current_user
      @photo = @user.photos.new
      @album = @photo.build_album
      @albums = @user.albums
    end
  end



end
