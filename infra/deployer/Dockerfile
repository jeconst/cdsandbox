FROM ruby:2.7.2-buster

WORKDIR /deployer

COPY Gemfile Gemfile.lock ./
RUN bundle install

COPY entrypoint.rb .

ENTRYPOINT ["./entrypoint.rb"]
