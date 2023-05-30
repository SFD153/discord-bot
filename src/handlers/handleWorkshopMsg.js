import closeWorkshop from '../logic/closeWorkshop';
import logEvent from '../utils/logEvent';
import Response from '../utils/Response';
import Permissions from '../utils/Permissions';
import tunerParticipation from '../utils/tunerParticipation';

const handleWorkshopMsg = async ({ msg }) => {
    try {
        if (msg.type === 'PINS_ADD' || msg.author.bot || !msg.channel.parent) return;
        const channelTag = msg.channel.name.slice('workshop-'.length);
        const isPilotOfChannel = Permissions.checkRole({
            user: msg.author.id,
            roles: [`role-${channelTag}`],
        });

        if (!isPilotOfChannel && Permissions.checkRole({ user: msg.author.id, roles: ['tuner'] })) {
            tunerParticipation({ msg });
        }

        if (msg.content.trim() !== '!close' && msg.content.trim() !== '!forceclose') return;

        const users_roles = msg.member.roles.cache.map((role) => role.name.toLowerCase().trim());
        // .filter((role) => ['moderator', 'admin', 'tuner', 'pilot'].includes(role));

        if (msg.content.trim() === '!close' && isPilotOfChannel) {
            return await closeWorkshop({ msg });
        } else if (msg.content.trim() === '!forceclose') {
            if (!Permissions.checkRole({ user: msg.author.id, roles: ['moderator', 'admin'] })) {
                logEvent({
                    id: 'command_close_force_bad_permissions',
                    details: {
                        msg,
                        roles: users_roles,
                    },
                });
                return Response.reject({ msg, ref: 'force_close' });
            }
            return closeWorkshop({ msg, force: true });
        }

        return Response.reply({ channel: msg.channel, ref: 'close_bad_permission' });
    } catch (e) {
        console.log(e);
    }
};

export default handleWorkshopMsg;
