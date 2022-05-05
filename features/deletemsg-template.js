//
// This is an example taken from the botkit templates.
// 
//

module.exports = function( controller ) {

controller.hears('delete','message,direct_message', async (bot, message) => {

  let reply = await bot.reply(message,'This message will be deleted in 5 seconds ');
  setTimeout(async () => {
      let res = await bot.deleteMessage(reply);
  }, 5000);

});


controller.commandHelp.push( { command: 'delete', text: 'Delete a message' } );

}