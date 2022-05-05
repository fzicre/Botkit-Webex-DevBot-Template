
//
// Fallback Command 
// Every command that doesn't match a command found in the Features, comes here.
// It adds some console.log usefull info for training your bot.
//

module.exports = function (controller) {

    controller.on( 'message,direct_message', async ( bot, message ) => {

        let markDown = `Start again please.  \nTry with: ${ controller.checkAddMention( message.roomType, 'help' ) }`;
            
        await bot.reply( message, { markdown: markDown } );

        console.log(`User: ${message.personEmail}, Says this: ${message.text} : and ended up in the fallback. \n Date of the event: ${ Date( Date.now) }`);
    });
}



                        