import parseTimeParameter from '../../utils/parseTimeParameter';
import { findHighestFeedback } from '../../db/controllers';
import logEvent from '../../utils/logEvent';
import Response from '../../utils/Response';
import client from '../../utils/client';
import settings from '../../config/settings';

export default async ({ msg }) => {
    try {
        msg.channel.startTyping();
        logEvent({ id: 'command_leaderboard', details: { msg } });

        const time_parameter = parseTimeParameter({ content: msg.content });

        const leaderboard = await findHighestFeedback({
            time_parameter,
        });

        if (!leaderboard.length) {
            return Response.reject({
                msg,
                reason: `No users found in the leaderboard for given time parameter: \`${time_parameter}\`. Try a longer amount of time.`,
            });
        }

        const guild = client.guilds.cache.get(settings.server());
        const top_user_data = await guild.members.fetch(leaderboard[0].user_id);

        Response.sendEmbed({
            ref: 'leaderboard',
            msg,
            details: {
                leaderboard,
                time_parameter,
                top_user: top_user_data,
            },
        });
    } catch (err) {
        console.log(err);
    } finally {
        msg.channel.stopTyping();
    }
};
