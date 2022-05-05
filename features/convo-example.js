// This example is taken from the Botkit Templates.
// Example of a conversation with a menu that loops until explicitly stopped
//

const { BotkitConversation } = require( 'botkit' );

module.exports = function (controller) {

    const convo = new BotkitConversation( 'loop_chat', controller );

    let question = 'Select a topic:\n';
    question += '  1. Star Wars: Episode IV A New Hope   \n';
    question += '  2. Star Wars: Episode V The Empire Strikes Back  \n';
    question += '  3. Star Wars: Episode VI Return of the Jedi   \n';
    question += '\nIf you want to cancel, tell me "stop" . )';

    convo.ask( question, [
        {
            pattern: '1|Episode IV|A New Hope|Star Wars IV',
            handler: async (response, convo, bot) => {
                return await convo.gotoThread( 'menu_1' );
            }
        },
        {
            pattern: '2|Episode V|The Empire Strikes Back |Star Wars V',
            handler: async (response, convo, bot) => {
                return await convo.gotoThread( 'menu_2' );
            }
        },
        {
            pattern: '3|Episode VI|Return of the Jedi|Star Wars VI',
            handler: async (response, convo, bot) => {
                return await convo.gotoThread( 'menu_3' );
            }
        },
        {
            pattern: 'cancel|stop',
            handler: async (response, convo, bot) => {
                return await convo.gotoThread( 'action_cancel' );
            }
        },
        {
            default: true,
            handler: async (response, convo, bot) => {
                await bot.say( 'Please choose a number from the list  \n or tell me to "stop" to quit.' );
                return await convo.repeat();
            },
        }  
    ]);

    // Menu option 1)
    convo.addMessage({
        text: 'Star Wars (retroactively titled Star Wars: Episode IV A New Hope) is a 1977 American epic space opera film written and directed by George Lucas, produced by Lucasfilm and distributed by 20th Century Fox.' + '\n' +
            'Source: ' + '\n' +  'Wikipedia: https://en.wikipedia.org/wiki/Star_Wars_(film)',
        action: 'cancel'
    }, 'menu_1');

    // Menu option 2)
    convo.addMessage({
        text: 'The Empire Strikes Back (also known as Star Wars: Episode V The Empire Strikes Back) is a 1980 American epic space opera film directed by Irvin Kershner, with a screenplay by Leigh Brackett and Lawrence Kasdan, based on a story by George Lucas.' + '\n' +
            'Source: ' + '\n' +  'Wikipedia: https://en.wikipedia.org/wiki/The_Empire_Strikes_Back',
        action: 'cancel'
    }, 'menu_2');

    // Menu option 3)
    convo.addMessage({
        text: 'Return of the Jedi (also known as Star Wars: Episode VI Return of the Jedi) is a 1983 American epic space opera film directed by Richard Marquand. The screenplay is by Lawrence Kasdan and George Lucas from a story by Lucas, who was also the executive producer.' + '\n' +
            'Source: ' + '\n' +  'Wikipedia: https://en.wikipedia.org/wiki/Return_of_the_Jedi',
    }, 'menu_3');


    // Cancel
    convo.addMessage({
        text: 'Ok, stopping...',
        action: 'complete',
    }, 'action_cancel');


    controller.addDialog( convo );

    controller.hears( 'convo', 'message,direct_message', async ( bot, message ) => {

        await bot.beginDialog( 'loop_chat' );
        
        console.log(`User: ${message.personEmail}, Says: ${message.text} \n Date of the event: ${ Date( Date.now) }`);

    });

    controller.commandHelp.push( { command: 'convo', text: 'Example of a convo.' } );

    

};

