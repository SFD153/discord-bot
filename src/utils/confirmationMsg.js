import { actionRow } from '../buttons/row';
import bountyListing from '../embeds/bountyListing';

const confirmation_msg_text =
    'This is a preview of what the tuning board post will look like. Is this ok?';

export const createConfirmationMsg = async ({ intro_msg, answers, msg }) => {
    try {
        const embed = bountyListing.create({
            fields: answers,
            author: msg.author,
        });

        const preview_msg = await intro_msg.channel.send(confirmation_msg_text, {
            embed: embed,
        });
        const edited_msg = await preview_msg.edit(confirmation_msg_text, {
            component: actionRow({
                ref: "confirmation",
                message_id: preview_msg.id,
            }),
            embed: embed,
        });

        return { confirmation_msg: edited_msg, embed };
    } catch (e) {
        console.log(e);
    }
};

export const editRejectedMsg = async ({ embed, confirmation_msg, verbage = 'cancelled' }) => {
    try {
        confirmation_msg.channel.send(
            `❌ Tuning initiation ${verbage}. You can start the process again by typing !tune in the #get-help channel on the server.`
        );

        confirmation_msg.edit(confirmation_msg_text, {
            component: actionRow({
                ref: "confirmation",
                message_id: confirmation_msg.id,
                disabled: true,
            }),
            embed: embed,
        });
    } catch (e) {
        console.log(e);
    }
};

export const editApprovedMsg = async ({ embed, confirmation_msg }) => {
    try {
        return confirmation_msg.edit(confirmation_msg_text, {
            component: actionRow({
                ref: "confirmation",
                message_id: confirmation_msg.id,
                disabled: true,
            }),
            embed: embed,
        });
    } catch (e) {
        console.log(e);
    }
};
