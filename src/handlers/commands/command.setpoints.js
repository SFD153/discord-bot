import { modifyFeedback } from '../../db/controllers';
import Response from '../../utils/Response';
import Permissions from '../../utils/Permissions';

export default async function setpoints({ msg: command_msg }) {
    try {
        if (!Permissions.checkRole({ user: command_msg.member, roles: ['moderator', 'admin'] })) {
            return Response.reject({
                msg: command_msg,
                reason: 'You do not have permission to set points.',
            });
        }

        // validating parameters of the command

        const receiving_user = command_msg.mentions.users.first();
        if (!receiving_user) {
            return Response.reject({
                msg: command_msg,
                ref: 'setpoints_no_user',
            });
        }

        const [amountAsString] = command_msg.content
            .slice('!setpoints'.length)
            .split(' ')
            .filter((arg) => arg !== '');

        if (isNaN(Number(amountAsString))) {
            return Response.reject({
                msg: command_msg,
                ref: 'setpoints_no_number',
            });
        }

        if (Number(amountAsString) < 0) {
            return Response.reject({
                msg: command_msg,
                ref: 'setpoints_negative_number',
            });
        }

        // executing feedback adjustments
        const { error, total_difference } = await modifyFeedback({
            user_id: receiving_user.id,
            amount: Number(amountAsString),
        });
        if (error)
            return Response.reject({
                msg: command_msg,
                reason: error,
            });

        Response.reply({
            msg: command_msg,
            literal: 'Success - Feedback changed by: ' + total_difference,
        });
    } catch (e) {
        console.log(e);
    }
}
