import ActiveInterviews from '../../utils/ActiveInterviews';
import startInterview from '../../logic/startInterview';
import settings from '../../config/settings';
import { findWorkshopByPilot } from '../../db/controllers';
import Response from '../../utils/Response';

export default async ({ msg }) => {
    try {
        if (settings.channel('get_help') !== msg.channel.id) {
            return;
        }
        if (ActiveInterviews.userExists(msg.author.id)) {
            return Response.reply({ msg, ref: 'currently_interviewing' });
        }
        if (
            (await findWorkshopByPilot({ pilot: msg.author.id })) &&
            process.env.NODE_ENV === 'production'
        ) {
            return Response.reply({ msg, ref: 'one_workshop_rule' });
        }
        Response.reply({ msg, ref: 'tuning_interview_initiated' });
        startInterview(msg);
        return;
    } catch (err) {
        console.log(err);
    }
};
