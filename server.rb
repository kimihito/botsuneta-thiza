require 'sinatra'
require 'action_mailer'
 
configure do
  set :root,    File.dirname(__FILE__)
  if production?
    ActionMailer::Base.smtp_settings = {
      :address => "smtp.sendgrid.net",
      :port => '25',
      :authentication => :plain,
      :user_name => ENV['SENDGRID_USERNAME'],
      :password => ENV['SENDGRID_PASSWORD'],
      :domain => ENV['SENDGRID_DOMAIN'],
    }
  else
    ActionMailer::Base.delivery_method = :file
    ActionMailer::Base.file_settings = { :location => File.join(Sinatra::Application.root, 'tmp/emails') }
  end
end
 
post '/send_mail.php' do
  ActionMailer::Base.mail(
    from: 'thiza@foo.herokuapp.com',
    to: 'your-email@example.com',
    subject: 'Botsuneta Email',
    body: "new subscribing email foo bar #{params[:email]}"
  ).deliver
  '1'
end

get '/' do
  send_file 'public/index.html'
end
