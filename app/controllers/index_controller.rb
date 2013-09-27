class IndexController < ApplicationController

  def send_mail
    unless Subscriber.where(email: params[:email]).exists?
      Subscriber.create email: params[:email]
      ActionMailer::Base.mail(
        from: 'thiza@foo.herokuapp.com',
        to: 'your-email@example.com',
        subject: 'Botsuneta Email',
        body: "new subscribing email foo bar #{params[:email]}"
      ).deliver
    end
    render text: '1'
  end

  before_filter only: :show_all do
    authenticate_or_request_with_http_basic do |user,pass|
      [user, pass] == ['foo', 'bar']
    end
  end

  def show_all
    @subscribers = Subscriber.all
  end

  def index
    render layout: false
  end

end