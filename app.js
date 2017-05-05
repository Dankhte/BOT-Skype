var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
// Bot Setup
//=========================================================

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

// Setup Restify Server
var server = restify.createServer();
server.listen(server_port, server_ip_address, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//Bot on
bot.on('contactRelationUpdate', function (message) {
    if (message.action === 'add') {
        var name = message.user ? message.user.name : null;
        var reply = new builder.Message()
                .address(message.address)
                .text("Hello %s... Thanks for adding me. Say 'hello' to see some great demos.", name || 'everyone');
        bot.send(reply);
    } else {
        // delete their data
    }
});
bot.on('typing', function (message) {
  // User is typing
});
bot.on('deleteUserData', function (message) {
    // User asked to delete their data
});
//=========================================================
// Bots Dialogs
//=========================================================
String.prototype.contains = function(content){
  return this.indexOf(content) !== -1;
}
var reiniciando = false;
bot.dialog('/', function (session) {
	var name = session.message.user ? session.message.user.name : null;
	var message = session.message.text.toLowerCase();
    if(message.contains('reinicio') || message.contains('reiniciamos') || message.contains('reiniciar') || message.contains('reiniciaremos')){
      session.send('%s, avisanos cuando esté levantado por favor.', name || 'Tú, el del reinicio');
      reiniciando = true;
	  }
	  if(reiniciando && (message.contains('ya esta') || message.contains('ya está') || message.contains('listo') || message.contains('reiniciado'))){
      session.send('Seguro %s?, muchas gracias.', name || 'seguro');
      reiniciando = false;
	  }
	});