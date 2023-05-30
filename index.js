require('dotenv').config();
import commandReducer from './src/handlers/commandReducer';
import client from './src/utils/client';
import settings from './src/config/settings';

client.on('ready', async () => {
    try {
        console.log(`Logged in as ${client.user.tag}!`);
        // const guild = client.guilds.cache.get(settings.server());
        // for (let i = 20; i < 50; i++) {
        //     await guild.channels.create('workshop-' + i, {
        //         parent: settings.channel('workshop_category')[0],
        //     });
        // }
    } catch (e) {
        console.log(e);
    }
});

client.on('message', commandReducer);

client.login(process.env.DISCORD_TOKEN);
