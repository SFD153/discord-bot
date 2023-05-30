import collectClick from '../collectors/collectClick';
import settings from '../config/settings';
import { createUser, createWorkshop } from '../db/controllers';
import bountyListing from '../embeds/bountyListing';
import ActiveInterviews from '../utils/ActiveInterviews';
import client from '../utils/client';
import { createConfirmationMsg, editApprovedMsg, editRejectedMsg } from '../utils/confirmationMsg';
import getWorkshopTag from '../utils/getWorkshopTag';
import openWorkshop from './openWorkshop';
import logEvent from '../utils/logEvent';

const endInterview = async ({ intro_msg, answers, msg }) => {
    try {
        const { confirmation_msg, embed } = await createConfirmationMsg({
            intro_msg,
            answers,
            msg,
        });

        const { choice, timed_out } = await collectClick({
            buttoned_msg: confirmation_msg,
        });

        if (timed_out || choice === -1) {
            logEvent({
                id: 'interview_button_click',
                details: {
                    expired: timed_out,
                    rejected: true,
                    user: msg.author,
                },
            });
            editRejectedMsg({ confirmation_msg, embed, verbage: timed_out && 'expired' });
        }
        if (choice === 1) {
            const workshop_suffix = getWorkshopTag();
            msg.author.send(
                `✅ Your workshop has been created and named **#workshop-${workshop_suffix}**. You can go to the #tuning-board channel to see your tuning request which includes a link to your channel. You can also use the ctrl+k command and type in your workshop number to directly search for your designated workshop channel.`
            );

            const created_room = await openWorkshop({
                msg: msg,
                fields: answers,
                suffix: workshop_suffix,
            });
            const bounty_board = client.channels.cache.get(settings.channel('bounty_board'));
            const [[user], bounty_board_post] = await Promise.all([
                createUser({
                    user_id: msg.author.id,
                }),
                bounty_board.send({
                    embed: bountyListing.create({
                        fields: answers,
                        author: msg.author,
                        channel: created_room.id,
                    }),
                }),
            ]);
            createWorkshop({
                channel_id: created_room.id,
                post_id: bounty_board_post.id,
                pilot: user.toJSON().user_id,
            });
            editApprovedMsg({ confirmation_msg, embed });
        }
    } catch (err) {
        console.log(err);
    } finally {
        ActiveInterviews.removeUser(msg.author.id);
    }
};

export default endInterview;
