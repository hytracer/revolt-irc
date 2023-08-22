const irc = require('irc');
const { Client } = require('revolt.js');
require('dotenv').config();

const ircConfig = {
    server: 'nuclear.foxwells.garden',
    nick: 'revolt-bridge',
    channels: ['#chat'],
};

const revoltConfig = {
    autoReconnect: true,
    baseURL: 'http://46.101.250.208/api/', // Replace with your custom API URL
    eagerFetching: true,
    partials: true,
    syncUnreads: true,
    channelIsMuted: () => false, // Adjust as needed
    retryDelayFunction: (retryCount) => retryCount * 1000, // Adjust as needed
};

const revoltUserMapping = {
    '01H8ENWTS74V2R5YAY4FF6M4JJ': 'cin' 
    // Add more usernames and user IDs as needed
  };

const ircClient = new irc.Client(ircConfig.server, ircConfig.nick, {
    channels: ircConfig.channels,
});

const revoltClient = new Client(revoltConfig);

ircClient.addListener('message', (from, to, message) => {
    const channel = '01H8F4GXHPYE9DE8C3WRP42B39';
    if (from === "bridge") {
        const revoltMessage = `${message}`;
        const revoltChannel = revoltClient.channels.get(channel);
        if (revoltChannel) {
            revoltChannel.sendMessage(revoltMessage);
        }
    } else {
        const revoltMessage = `<${from}> ${message}`;
        const revoltChannel = revoltClient.channels.get(channel);
        if (revoltChannel) {
            revoltChannel.sendMessage(revoltMessage);
        }
    }
});

revoltClient.on('messageCreate', async (message) => {
    if (
        message.authorId !== "01H8F7J85SPR8N2ZDB6AG85TDV"
    ) {

        const username = revoltUserMapping[message.authorId] || 'unregistered user';
        const ircMessage = `[revolt] <${username}> ${message.content}`

        ircClient.say(ircConfig.channels[0], ircMessage);
    }
});

ircClient.addListener('error', (error) => {
    console.error('IRC Error:', error);
});

revoltClient.on('error', (error) => {
    console.error('Revolt Error:', error);
});

revoltClient.loginBot(process.env.REVOLT_BOT_TOKEN);