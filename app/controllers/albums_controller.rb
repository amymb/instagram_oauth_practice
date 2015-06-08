class AlbumsController < ApplicationController

  def index
    @user = current_user
    @albums = @user.albums
  end

  def show
    @user = current_user
    @album = @user.albums.find(params[:id])
    @photos = @album.photos
  end



  private
    def album_params
      parmas.require(:album).permit(:name, :user_id)
    end
end
