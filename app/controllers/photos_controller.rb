class PhotosController < ApplicationController

  def index
    @album = Album.find(params(:album_id))
    @photo = @album.photos
  end


  def create
    @user = current_user
    @photo = @user.photos.new(filter_params(photo_params))
    respond_to do |format|
      if @photo.save
        format.json { render json: @photo.to_json }
      else
        format.json { render json: @photo.errors, status: :unprocessable_entity }
      end
    end
  end

  private
  def photo_params
    params.require(:photo).permit(:album_id, :url, :name, :album_attributes => [:title, :user_id])
  end

  def filter_params(photo_params)
    new_params = photo_params.dup
    if new_params[:album_id].present?
      new_params.delete(:album_attributes)
    end
    new_params
  end

end
