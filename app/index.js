var Peer   = require('simple-peer')
var socket = require('socket.io-client')('http://indra.webfactional.com/')
var uuid = require('uuid')
var $      = require('jquery')
var post_json  = require('post-json-nicely')
var post = function (d) {
  post_json($, 'http://indra.webfactional.com', d)
}

var sendOrReceiveView = require('./views/sendAndReceive.js')
var receiveView = require('./views/receiver.js')

var offer_event = function (key) { 
  return "peerscp-offer-"+key 
}
var answer_event = function (key) { 
  return "peerscp-answer-"+key 
}

// make a simple-peer 
var makePeer = function (isInitiator) {
  return new Peer({
      initiator: isInitiator,
      trickle: false,  // no idea what trickle means
  })
}

// signal to a peer p some introduction signal s
var signal = function (p, s) {
  p.signal(JSON.stringify(s))
}

var handshake = function (signal, type) {
  return {
    signal: signal,
    type: type,
  }
}

var sender = function (key, connectCb) {
  // setup a listener for receiver's answer event
  socket.on(answer_event(key), function (answer) {
console.log('got peer answer')
    // on peer's answer, we mirror their signal back to connect
    signal(peer, answer.signal)
    socket.disconnect()
  })
  // initiate an offer introduction to receiver
  var peer = makePeer(true)
  peer.once('signal', function (offer) {
console.log('making offer')
    post(handshake(offer, offer_event(key)))
  })
  // on connect to peer
  peer.on('connect', function () {
    connectCb(peer)
  })
}

var receiver = function (key, connectCb) {
  socket.on(offer_event(key), function (offer) {
console.log('got offer..')
    socket.disconnect()
    var peer = makePeer(false)
    signal(peer, offer.signal)
    peer.once('signal', function (answer) {
console.log('sending answer..')
      post(handshake(answer, answer_event(key)))
    })
    peer.on('connect', function () {
      connectCb(peer)
    })
  })
}

var sendMousemoves = function (peer) {
 document.write('CONNECTED SENDER!!!!!!')
}

var receiveMousemoves = function (peer) {
 document.write('CONNECTED RECEIVER!!!!!!')
}

var setup = function () {
  sendOrReceiveView(function (selection) {
    if (selection === 'receive') {
      var k = uuid.v1()
      document.write('share this key with your friend: ' + k)
      receiver(k, receiveMousemoves)
    } else {
      receiveView(function (key) {
        sender(key, sendMousemoves)
      })
    }
  })
}

$(document).on('ready', setup)
