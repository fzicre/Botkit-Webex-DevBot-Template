//
// Health check info
//
module.exports = function (controller) {

    controller.botCommons = {

        healthCheck: process.env.PUBLIC_ADDRESS,
        upSince: new Date( Date.now() ).toGMTString(),
        botName: controller.adapter.identity.displayName,
        botVersion: 'v' + require( '../package.json' ).version,
        owner: process.env.OWNER,
        support: process.env.SUPPORT,
        botkitVersion: controller.version,
        platform: process.env.PLATFORM,
        code: process.env.CODE
    }

    controller.hears( 'healthcheck', 'message,direct_message', async ( bot, message ) => {

        let markDown = '```json\n';
        markDown += JSON.stringify( controller.botCommons, null, 4 );
        markDown += '\n```'
        await bot.reply( message, { markdown: markDown } );

        console.log(`User: ${message.personEmail}, Says: ${message.text} \n Date of the event: ${ Date( Date.now) }`);
    });

    
    
     controller.commandHelp.push( { command: 'healthcheck', text: 'Health Check and info about the bot' } );

}