FROM ruby:3.0.0-buster

WORKDIR /deployer

COPY Gemfile Gemfile.lock ./
RUN bundle install

COPY entrypoint.rb .

ENTRYPOINT ["./entrypoint.rb"]
