// HTML - In this example we can see how to share an html file and pass it as a message in a space.
// You may notice that there are some colors in the blockquote, the colors are primary(blue),secondary(gray),success(green),danger(red),warning(yellow)
// 

var fs = require('fs');

module.exports = function (controller) {

    controller.hears( 'html', 'message,direct_message', async ( bot, message ) => {

        let normalizedPath = require( 'path' ).join( __dirname,'html/html.html' , );
        let markDown = '\n';
        markDown += fs.readFileSync( normalizedPath ).toString();
        markDown += '\n';

        await bot.reply( message, { markdown : markDown } );
        console.log(`User: ${message.personEmail}, Says: ${message.text} \n Date of the event: ${ Date( Date.now) }`);
    });

    controller.commandHelp.push( { command: 'html', text: 'Shows an html file as a message' } );

}


