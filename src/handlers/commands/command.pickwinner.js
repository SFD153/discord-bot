import logEvent from '../../../src/utils/logEvent';
import settings from '../../config/settings';
import { randomFeedback } from '../../db/controllers';
import Permissions from '../../utils/Permissions';
// import feedbackEmbed from '../../embeds/feedback';
import Embed from '../../embeds/Embed';
import Response from '../../utils/Response';

export default async ({ commandMsg }) => {
    try {
        if (!Permissions.checkRole({ user: commandMsg.member, roles: 'admin' })) return;

        logEvent({ id: 'command_pickwinner', details: { msg: commandMsg } });

        const pleaseWaitMsg = await Response.reply({
            channel: commandMsg.channel,
            ref: 'pickwinner_please_wait',
        });

        const [feedback] = await randomFeedback();

        const { user: winner } = await commandMsg.guild.members.fetch(feedback.toJSON().user_id);

        const embed = new Embed({ ref: 'pickwinner', details: { winner } });
        await embed.edit({ msg: pleaseWaitMsg });
    } catch (e) {
        console.log(e);
    }
};
