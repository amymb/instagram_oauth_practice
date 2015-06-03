class User < ActiveRecord::Base
  has_many :albums
  has_many :photos, through: :albums
  def self.create_with_omniauth(auth)
    create! do |user|
      user.provider = auth["provider"]
      user.uid = auth["uid"]
      user.name = auth["info"]["name"]
      user.token = auth["credentials"]["token"]
    end
  end
end
