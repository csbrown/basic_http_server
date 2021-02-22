FROM python:latest

ENV HOME=/var/www

ADD ./my_app $HOME
WORKDIR $HOME

RUN pip3 install -r $HOME/requirements.txt
