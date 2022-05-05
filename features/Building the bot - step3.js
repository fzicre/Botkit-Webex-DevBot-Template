// HTML - In this example we can see how to share an html file and pass it as a message in a space.
// You may notice that there are some colours in the blockquote, the colours are primary(blue),secondary(grey),success(green),danger(red),warning(yellow)
// 

var fs = require('fs');

module.exports = function (controller) {

    controller.hears( [ 'step3','step 3'], 'message,direct_message', async ( bot, message ) => {

        let normalizedPath = require( 'path' ).join( __dirname,'guide/step3.html' , );
        let markDown = '\n';
        markDown += fs.readFileSync( normalizedPath ).toString();
        markDown += '\n';

        await bot.reply( message, { markdown : markDown } );
        console.log(`User: ${message.personEmail}, Says: ${message.text} \n Date of the event: ${ Date( Date.now) }`);
    });

    controller.commandHelp.push( { command: 'step3', text: 'Step 3 - Working on the template' } );

}


