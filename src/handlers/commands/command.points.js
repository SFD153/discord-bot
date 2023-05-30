import parseTimeParameter from '../../utils/parseTimeParameter';
import { findFeedbackByUserId } from '../../db/controllers';
import logEvent from '../../utils/logEvent';
import Response from '../../utils/Response';

export default async ({ msg }) => {
    try {
        logEvent({ id: 'command_points', details: { msg } });
        msg.channel.startTyping();

        const time_parameter = parseTimeParameter({ content: msg.content });

        const [user] = await findFeedbackByUserId({
            user_id: msg.author.id,
            time_parameter,
        });

        if (!user) {
            return Response.reject({
                msg,
                ref: 'no_score',
            });
        }

        Response.sendEmbed({
            ref: 'points',
            msg,
            details: {
                time_parameter,
                user: user.toJSON(),
            },
        });
    } catch (err) {
        console.log(err);
    } finally {
        msg.channel.stopTyping();
    }
};
