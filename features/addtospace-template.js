//
// This is an example taken from the botkit templates.
// Add the bot to a group space with the user.
//

module.exports = function( controller ) {

  controller.hears('addtospace','message,direct_message', async (bot, message) => {

    // create a room
    let room = await bot.api.rooms.create({title: `Space created by ${ controller.adapter.identity.displayName }` });

    // add user as member (bot is automatically added)
    let membership2 = await bot.api.memberships.create({
        roomId: room.id,
        personId: message.user,
    });

    await bot.startConversationInRoom(room.id, message.user);

});

controller.on('memberships.created', async (bot, message) => {
    console.log('membership created: ', message);
    console.log(`Date of the event: ${ Date( Date.now) }`);
});

controller.commandHelp.push( { command: 'addtospace', text: 'Adds the user to a group space created by the bot' } );

}