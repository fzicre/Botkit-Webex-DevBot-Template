//
// This is the Hello Feature.
// Enable this var if you want for example, send and image with the response for the Hello:
//var fs = require('fs');

module.exports = function( controller ) {

    controller.hears( [ 'hi','hello','howdy','hey','aloha','hola','bonjour','oi','hola','buenos dias','buenas tardes','buenas','alo' ], 'message,direct_message', async ( bot,message ) => {

        await bot.reply( message, `Hello there! I am ${ controller.adapter.identity.displayName }` );
        await bot.reply( message, { markdown: 'Try `help` to see the commands' } );
        // This console log is usefull to catch the responses on the console.
        console.log(`User: ${message.personEmail}, Says: ${message.text} \n Date of the event: ${ Date( Date.now) }`);
      });
}

