import settings from '../config/settings';
import updateCardAPI from '../logic/updateCardAPI';
import leaderboard from './commands/command.leaderboard';
import pickwinner from './commands/command.pickwinner';
import points from './commands/command.points';
import setpoints from './commands/command.setpoints';
import tune from './commands/command.tune';
import test from './commands/command.temp';
import handleWorkshopMsg from './handleWorkshopMsg';
import client from '../utils/client';
require('discord-buttons')(client);

const commandReducer = async (msg) => {
    try {
        const [command] = msg.content
            .toLowerCase()
            .split(' ')
            .filter((x) => x !== '');

        const commands = {
            '!test': () => test({ msg }),
            '!api': () => updateCardAPI({ msg }),
            '!pickwinner': () => pickwinner({ commandMsg: msg }),
            '!points': () => points({ msg }),
            '!leaderboard': () => leaderboard({ msg }),
            '!tune': () => tune({ msg }),
            '!setpoints': () => setpoints({ msg }),
        };

        const isWorkshopMessage = settings
            .channel('workshop_category')
            .includes(msg.channel.parent.id);

        if (!commands[command] && !isWorkshopMessage) return;

        if (isWorkshopMessage) return handleWorkshopMsg({ msg });

        return commands[command]();
    } catch (e) {}
};

export default commandReducer;
