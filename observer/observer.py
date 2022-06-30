#!/usr/bin/env python
# coding: utf-8

import socketio


client = socketio.Client()


@client.event(namespace='/mapleinfo')
def connect():
    print("I'm connected!")

@client.event(namespace='/mapleinfo')
def connect_error(data):
    print("The connection failed!")

@client.event(namespace='/mapleinfo')
def disconnect():
    print("I'm disconnected!")


@client.on('healthCheckRes', namespace='/mapleinfo')
def health_check(data):
  print(data)


client.connect('http://localhost:4004', namespaces=['/mapleinfo'])


client.emit('healthCheck', namespace='/mapleinfo')


client.emit('changeChar', data={ 'char' : '프레아루쥬' }, namespace='/mapleinfo')


client.disconnect()

