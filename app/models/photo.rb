class Photo < ActiveRecord::Base

  belongs_to :album
  has_one :user, through: :album

  accepts_nested_attributes_for :album
end
