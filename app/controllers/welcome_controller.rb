class WelcomeController < ApplicationController

  def index
    if current_user.present?
      @user = current_user
      @photo = @user.photos.new
      @album = @photo.build_album
      @albums = Album.all
    end
  end



end
