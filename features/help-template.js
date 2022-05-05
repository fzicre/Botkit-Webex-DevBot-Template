//
// Command: help
//
module.exports = function (controller) {

    controller.hears( [ 'help','ayuda','command','commands'], 'message,direct_message', async ( bot, message ) => {

        let markDown = '**commands:**  \n';

        controller.commandHelp.sort( ( a,b ) => {

            return ( ( a.command < b.command ) ? -1 : ( ( a.command > b.command ) ? 1 : 0 ));
        });

        controller.commandHelp.forEach( element => {
            
            markDown += `**${ controller.checkAddMention( message.roomType, element.command ) }**: ${ element.text }  \n`
        });

        await bot.reply( message, { markdown: markDown } );
        
        console.log(`User: ${message.personEmail}, Says: ${message.text} \n Date of the event: ${ Date( Date.now) }`);

    });

    

    controller.commandHelp.push( { command: 'help', text: 'Show available commands' } );
}

