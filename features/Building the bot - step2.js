// HTML - In this example we can see how to share an html file and pass it as a message in a space.
// You may notice that there are some colours in the blockquote, the colours are primary(blue),secondary(grey),success(green),danger(red),warning(yellow)
// 

var fs = require('fs');

module.exports = function (controller) {

    controller.hears( [ 'step2','step 2'], 'message,direct_message', async ( bot, message ) => {

        let normalizedPath = require( 'path' ).join( __dirname,'guide/step2.html' , );
        let markDown = '\n';
        markDown += fs.readFileSync( normalizedPath ).toString();
        markDown += '\n';

        await bot.reply( message, { markdown : markDown } );
        await bot.reply( message, { markdown: 'The developer portal.\nClick to enlarge.',
        files: [ fs.createReadStream( './assets/images/access1.gif' ) ]
    })
    await bot.reply( message, { markdown: 'Getting the access token.\nClick to enlarge.',
    files: [ fs.createReadStream( './assets/images/access2.gif' ) ]
})
        console.log(`User: ${message.personEmail}, Says: ${message.text} \n Date of the event: ${ Date( Date.now) }`);
    });

    controller.commandHelp.push( { command: 'step2', text: 'Step 2 - Getting an access token' } );

}


