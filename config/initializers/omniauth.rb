Rails.application.config.middleware.use OmniAuth::Builder do
  provider :instagram, ENV['INSTAGRAM_ID'], ENV['INSTAGRAM_SECRET'], provider_ignores_state: true
end
