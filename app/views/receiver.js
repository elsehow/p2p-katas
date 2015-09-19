var $ = require('jquery')

var setup = function (cb) {
   document.write('<input id = "keyInput"></input><button id = "submitKey">connect to key</button>')
  $('#submitKey').on('click', function (_) {
    var k = $('#keyInput').val()
    if (k) {
     document.write('connecting to your peer......'+k)
     cb(k) 
   }
 })
}

module.exports = setup
