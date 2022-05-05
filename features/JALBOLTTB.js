//
// JALBOLTTB - Just A Little Bit Of Life To The Bot
// Just for fun, some responses that the bot can handle to feel more alive
//
module.exports = function(controller) {


  controller.hears(['Whats your name', 'who am I', 'tell me about yourself', 'who are you', 'what are you', 'what is a bot'], 'message,direct_message', async (bot, message) => {
    await bot.reply(message, `¡Hi!: i am ${controller.adapter.identity.displayName}.`);


    console.log(`User: ${message.personEmail}, Says: ${message.text} \n Date of the event: ${ Date( Date.now) }`);
  });

  controller.hears(['Goodbye', 'goodbye', 'bye', 'bye', 'airvouir', 'bye', 'bye-bye', 'goodbye', 'see you', 'see ya'], 'message,direct_message', async (bot, message) => {
    await bot.reply(message, {
      markdown: 'Goodbye, come back soon!'
    });

    console.log(`User: ${message.personEmail}, Says: ${message.text} \n Date of the event: ${ Date( Date.now) }`);
  });

  controller.hears(['year', 'date', 'day', 'time'], 'message,direct_message', async (bot, message) => {

    await bot.reply(message, {
      markdown: `Ok!: ${ Date( Date.now) }`
    });
    console.log(`User: ${message.personEmail}, Says: ${message.text} \n Date of the event: ${ Date( Date.now) }`);
  });

  controller.hears(['hour', 'minute', 'hours', 'seconds', 'minutes', 'hours'], 'message,direct_message', async (bot, message) => {

    await bot.reply(message, {
      markdown: 'It s 5 o clock somewhere on the planet.'
    });
    await bot.reply(message, `System Clock: ${ Date( Date.now) }`);
    console.log(`User: ${message.personEmail}, Says: ${message.text} \n Date of the event: ${ Date( Date.now) }`);
  });

  controller.hears(['how are you', 'how are you feeling', 'what are you doing', 'are you alright', 'everything alright?', 'how are you', 'how are you feeling', 'how are you feeling?'], 'message,direct_message', async (bot, message) => {

    await bot.reply(message, {
      markdown: 'Very well, thanks for asking.'
    });
    console.log(`User: ${message.personEmail}, Says: ${message.text} \n Date of the event: ${ Date( Date.now) }`);
  });

  controller.hears(['how bad you are', 'bad', 'horrible', 'how disastrous', 'dirty', 'stupid', 'idiot'], 'message,direct_message', async (bot, message) => {

    await bot.reply(message, {
      markdown: 'Oh. Too bad you think that :('
    });
    console.log(`User: ${message.personEmail}, Says: ${message.text} \n Date of the event: ${ Date( Date.now) }`);
  });





}