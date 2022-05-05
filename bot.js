// Copyright (c) 2018 Cisco and/or its affiliates.
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//
// ______          ______       _              _   _            _         _              
// |  _  \         | ___ \     | |            | | | |          | |       | |             
// | | | |_____   _| |_/ / ___ | |_   ______  | |_| | __ _  ___| | ____ _| |_ ___  _ __  
// | | | / _ \ \ / / ___ \/ _ \| __| |______| |  _  |/ _` |/ __| |/ / _` | __/ _ \| '_ \ 
// | |/ /  __/\ V /| |_/ / (_) | |_           | | | | (_| | (__|   < (_| | || (_) | | | |
// |___/ \___| \_/ \____/ \___/ \__|          \_| |_/\__,_|\___|_|\_\__,_|\__\___/|_| |_|
                                                                                      
                                                                                      
// The purpose of this bot is to provide a template ready to start using. Where by modifying just a couple of things we can have a working bot. Bot.js is separated into Modules, for better troubleshooting.
// 
//
console.log('* **********************************************************************************************');
console.log('* **********************************************************************************************');
console.log(' **************************Devbot is starting... Please Wait..**********************************'); 
console.log('* **********************************************************************************************');
console.log('* **********************************************************************************************');
// 
// This is the main file for the template bot.
//
//**********************************************************************************************/
// Module 1: Env. values.
//**********************************************************************************************/
console.log('* Module 1 initializing...');
// Load process.env values from .env file (it is wise to load tokens, keys, secrets in there for security reasons)
require('dotenv').config();

if (!process.env.WEBEX_ACCESS_TOKEN) {
    console.log( '\n-->Token missing: please provide a valid Webex Teams user or bot access token in .env or via WEBEX_ACCESS_TOKEN environment variable');
    process.exit(1);
}

// Read public URL from env,
// if not specified, try to infer it from public cloud platforms environments
var public_url = process.env.PUBLIC_URL;

// If you want to host the bot on Heroku or Glitch you need to specify this in the ENV file.
if (!public_url) {
    // Heroku hosting: available if dyno metadata are enabled, https://devcenter.heroku.com/articles/dyno-metadata
    if (process.env.HEROKU_APP_NAME) {
        public_url = 'https://' + process.env.HEROKU_APP_NAME + '.herokuapp.com';
    }

    // Glitch hosting
    if (process.env.PROJECT_DOMAIN) {
        public_url = 'https://' + process.env.PROJECT_DOMAIN + '.glitch.me';
    }
}
console.log('* Done...');
//**********************************************************************************************/
// End module 1.
//**********************************************************************************************/
console.log('* Module 2 initializing...');
//**********************************************************************************************/
//************************** Module 2: Storage (fully optional)*********************************/
//**********************************************************************************************/
var storage;

if (process.env.REDIS_URL) {

    const redis = require('redis');
    const { RedisDbStorage } = require('botbuilder-storage-redis');

    // Initialize redis client
    const redisClient = redis.createClient(process.env.REDIS_URL, { prefix: 'bot-storage:' });
    storage = new RedisDbStorage(redisClient);
}

if (process.env.MONGO_URI) {

    const { MongoDbStorage } = require('botbuilder-storage-mongodb');

    storage = new MongoDbStorage({ url: process.env.MONGO_URI })
}
console.log('* Done...');
//**********************************************************************************************/
// End Module 2.
//**********************************************************************************************/

console.log('* Module 3 initializing...');

//**********************************************************************************************/
//************************** Module 3: Botkit and Webex Adapters********************************/
//**********************************************************************************************/


//
// Create Webex Adapter
const { v4: uuidv4 } = require( 'uuid' );
const { WebexAdapter } = require('botbuilder-adapter-webex');

// If PUBLIC_URL not configured, supply a dummy pulic_address
// If using websockets, don't supply a secret
const adapter = new WebexAdapter({

    access_token: process.env.WEBEX_ACCESS_TOKEN,
    public_address: public_url ? public_url : 'http://127.0.0.1',
    secret: ( process.env.WEBSOCKET_EVENTS == 'True' ) ? null : uuidv4()
});

const { Botkit } = require('botkit');

const controller = new Botkit({

    webhook_uri: '/api/messages',
    adapter: adapter,
    storage
});

// Express response stub to supply to processWebsocketActivity
// Luckily, the Webex adapter doesn't do anything meaningful with it
class responseStub {
    status(){}
    end(){}
}

function processWebsocketActivity( event ) {
    // Express request stub to fool the Activity processor
    let requestStub = {};
    // Event details are expected in a 'body' property
    requestStub.body = event;

    // Hand the event off to the Botkit activity processory
    controller.adapter.processActivity( requestStub, new responseStub, controller.handleTurn.bind( controller ) )
}
console.log('* Done...');
//**********************************************************************************************/
// End Module 3. 
//**********************************************************************************************/

console.log('* Module 4 initializing...');

//**********************************************************************************************/
//************************** Module 4: Doing stuff             *********************************/
//**********************************************************************************************/

// Once the bot has booted up its internal services, you can use them to do stuff
controller.ready( async () => {

    const path = require('path');

    // load developer-created custom feature modules.
    controller.loadModules( path.join( __dirname, 'features' ) );

    if ( ( !public_url ) && ( process.env.WEBSOCKET_EVENTS !== 'True' ) ) {
        console.log( '\n-->No inbound event channel available.  Please configure at least one of PUBLIC_URL and/or WEBSOCKET_EVENTS' );
        process.exit( 1 );
    }

    if ( public_url ) {
        // Make the app public_url available to feature modules, for use in adaptive card content links
        controller.public_url = public_url;
    }
        // This is the process that enables websockets

    if ( process.env.WEBSOCKET_EVENTS == 'True' ) {

        await controller.adapter._api.memberships.listen();
        controller.adapter._api.memberships.on( 'created', ( event ) => processWebsocketActivity( event ) );
        controller.adapter._api.memberships.on( 'updated', ( event ) => processWebsocketActivity( event ) );
        controller.adapter._api.memberships.on( 'deleted', ( event ) => processWebsocketActivity( event ) );

        await controller.adapter._api.messages.listen();
        controller.adapter._api.messages.on('created', ( event ) => processWebsocketActivity( event ) );
        controller.adapter._api.messages.on('deleted', ( event ) => processWebsocketActivity( event ) );

        await controller.adapter._api.attachmentActions.listen();
        controller.adapter._api.attachmentActions.on('created', ( event ) => processWebsocketActivity( event ) );

        // Remove unnecessary auto-created webhook subscription
        await controller.adapter.resetWebhookSubscriptions();

        console.log( 'Using websockets for incoming messages/events');
        // If everything goes as planned, you should see this in the console log.
        console.log('* All modules are up and running!');
    }
    else {
        // Register attachmentActions webhook
        controller.adapter.registerAdaptiveCardWebhookSubscription( controller.getConfig( 'webhook_uri' ) );
    }
} );


//**********************************************************************************************/
//************************** Blocking Users/Domains            *********************************/
//**********************************************************************************************/



// This is piece of code uses middleware to intercept a message and block user interactions by email or domain. For that , you need to specify the email/s or domain/s in the ENV. file

// In this example where are blocking everyone but PERMITED_DOMAIN.
//
//    controller.middleware.ingest.use(async (bot, message, next) => {
//      if (message.type === 'self_message' || message.type === 'attachmentActions' || message.type === 'messages.deleted') {
//        next();
//        return;
//      }
//  
//      const { PERMITTED_DOMAIN } = process.env;
//      const emailDomain = message.personEmail.split('@')[1];
//  
//      if (emailDomain === PERMITTED_DOMAIN) {
//        next();
//        return;
//      }
//  
//      console.log('MESSAGE FROM EXTERNAL USER');
//      message.type = 'external_user_message'; 
//  
//      next();
//    });
//  


// end of example 1


// In this example we are only allowing access to two users by email.

// controller.middleware.ingest.use(async (bot, message, next) => {
//    if (message.type === 'self_message' || message.type === 'attachmentActions' || message.type === 'messages.deleted') {
//      next();
//      return;
//    }
//
//    const { PERMITTED_EMAIL1 } = process.env;
//    const { PERMITTED_EMAIL2 } = process.env;
//    const emailDomain = message.personEmail;

//    if (emailDomain === PERMITTED_EMAIL1  || emailDomain === PERMITTED_EMAIL2){
//      next(); 
//      return;
//    }

//    console.log('MESSAGE FROM EXTERNAL USER');
//    message.type = 'external_user_message'; 

//   next();
//  });

// Returns an access denied
  //controller.on('external_user_message', async (bot, message) => {
  //  const text = 'I am sorry, you do not have access to this resource or you performed an illegal action';
  //  await bot.reply(message, text);
  // });

//**********************************************************************************************/
//End of Blocking Users/Domains                                *********************************/
//**********************************************************************************************/


controller.publicFolder( '/www', __dirname + '/www' );

controller.webserver.get( '/', ( req, res ) => {

    res.send( JSON.stringify( controller.botCommons, null, 4 ) );
} );

let healthCheckUrl = public_url ? public_url : `http://localhost:${ process.env.PORT }`;

console.log( `Health check available at: ${ healthCheckUrl }` );

// This is for the command Help only, if you dont need to use it you can disable this lines.

controller.commandHelp = [];

controller.checkAddMention = function ( roomType, command ) {

    var botName = adapter.identity.displayName;

    if (roomType === 'group') {

        return `\`@${botName} ${command}\``
    }

    return `\`${command}\``
}



