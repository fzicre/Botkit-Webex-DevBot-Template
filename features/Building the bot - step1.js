// HTML - In this example we can see how to share an html file and pass it as a message in a space.
// You may notice that there are some colours in the blockquote, the colours are primary(blue),secondary(grey),success(green),danger(red),warning(yellow)
// 

var fs = require('fs');

module.exports = function (controller) {

    controller.hears( [ 'step1','step 1'], 'message,direct_message', async ( bot, message ) => {

        let normalizedPath = require( 'path' ).join( __dirname,'guide/step1.html' , );
        let markDown = '\n';
        markDown += fs.readFileSync( normalizedPath ).toString();
        markDown += '\n';

        await bot.reply( message, { markdown : markDown } );
        await bot.reply( message, { markdown: 'This command will install the Node.Js dependencies.',
            files: [ fs.createReadStream( './assets/images/cmd.gif' ) ]
        })
        console.log(`User: ${message.personEmail}, Says: ${message.text} \n Date of the event: ${ Date( Date.now) }`);
    });

    controller.commandHelp.push( { command: 'step1', text: 'Step 1 - What do i need to build a bot?' } );

}

