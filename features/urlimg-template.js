// Image from the internet.


module.exports = function (controller) {


controller.hears( 'url', 'message,direct_message', async ( bot,message ) => {

    await bot.reply( message, {
        text: 'This is a radar image of my country, showing some weather info.',
        files: [ 'https://climasurgba.com.ar/satelite/goes-east-130.png' ]
    });
    console.log(`User: ${message.personEmail}, Says: ${message.text} \n Date of the event: ${ Date( Date.now) }`);
})
    
    controller.commandHelp.push( { command: 'url', text: 'An image from Internet' } );

}
