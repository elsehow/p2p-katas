var $ = require('jquery')

var setup = function (cb) {
  document.write(
   '<button id = "send">Send</button>' +
   '<button id = "receive">Receive</button>' )
  $('#send').on('click', function () {
    cb('send')
  })
  $('#receive').on('click', function () {
    cb('receive')
  })
}

module.exports = setup
