class WelcomeController < ApplicationController

  def index
    @user = current_user
    @photo = @user.photos.new
    @album = @photo.build_album
    @albums = Album.all
  end

end
