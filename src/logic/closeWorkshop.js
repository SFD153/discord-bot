import { actionRow } from '../buttons/row';
import collectClick from '../collectors/collectClick';
import settings from '../config/settings';
import {
    addUserFeedback,
    deleteWorkshop,
    findFeedbackByUserId,
    findWorkshopById,
} from '../db/controllers';
import questionPrompt from '../embeds/questionPrompt';
import client from '../utils/client';
import getAvatarLink from '../utils/getAvatarLink';
import { logClosedWorkshop, logFeedback } from '../utils/logHistory';
import logEvent from '../utils/logEvent';
import Response from '../utils/Response';
import Embed from '../embeds/Embed';

export default async ({ msg, force }) => {
    try {
        const [workshop, tuners] = await findWorkshopById({
            channel_id: msg.channel.id,
        });

        if (!workshop) {
            return Response.reject({ msg, ref: 'workshop_db_error' });
        }

        if (!force) {
            logEvent({
                id: 'command_close_self',
                details: {
                    msg,
                },
            });
        }

        if (!force) {
            const pilot = await msg.guild.members.fetch(workshop.toJSON().pilot);
            msg.channel.send({
                embed: questionPrompt.create({
                    question: [
                        'Looks like the tuning is complete!',
                        'We ask that pilots leave feedback for the tuners whether it be positive, neutral, or negative.',
                        'Please check your inbox to complete the feedback process.',
                    ].join('\n'),
                }),
            });

            const tuner_user_data = await getTunerUserData({ msg, tuners });
            let feedbackLeftForTuners = [];

            for (let i = 0; i < tuner_user_data.length; i++) {
                if (tuner_user_data[i].id !== workshop.toJSON().pilot) {
                    const { attitude, tuner_id, timed_out } = await processFeedbackQuestion({
                        tuner: tuner_user_data[i],
                        pilot,
                    });

                    if (timed_out) {
                        return Response.reply({ msg, ref: 'expired_feedback_prompt' });
                    }

                    feedbackLeftForTuners.push({ attitude, tuner_id });
                }
            }

            for (let i = 0; i < feedbackLeftForTuners.length; i++) {
                const tuner = feedbackLeftForTuners[i];
                const user = await addUserFeedback({
                    user_id: tuner.tuner_id,
                    attitude: tuner.attitude,
                });

                if (!user) throw new Error('Something went wrong when trying to leave feedback.');

                const [userFeedbackRecord] = await findFeedbackByUserId({
                    user_id: user.toJSON().user_id,
                });
                // const { total_positives } = userFeedbackRecord.toJSON();

                // if (total_positives >= 1) {
                //     await promoteTuner({ user_id: tuner.tuner_id, members: msg.guild.members });
                // }
            }

            pilot.send(
                '✅ The workshop has been successfully closed and your feedback has been submitted. Thanks for using DeckTuner!'
            );
        }

        const pinned_messages = await msg.channel.messages.fetchPinned();
        const { embeds } = pinned_messages.find((pin) => pin.author.id == client.user.id);

        const deleted = await deleteWorkshop({ channel_id: msg.channel.id });

        if (deleted == 0) {
            throw new Error(`Something went wrong. Channel couldn't be deleted.`, msg);
        }

        const bounty_board = client.channels.cache.get(settings.channel('bounty_board'));
        const post = await bounty_board.messages.fetch(workshop.toJSON().post_id);

        const channel_name = msg.channel.name;
        const channel_tag = channel_name.slice(channel_name.length - 3);

        const designated_pilot_role = msg.guild.roles.cache.find(
            (role) => role.name === `role-${channel_tag}`
        );
        if (designated_pilot_role) {
            designated_pilot_role.delete();
        }

        //finish

        logEvent({
            id: 'workshop_close_success',
            details: {
                msg,
                force,
            },
        });

        await msg.channel.delete();
        await Promise.all([logClosedWorkshop({ msg, force, embed: embeds[0] }), post.delete()]);
    } catch (e) {
        console.log(e);
    }
};

const processFeedbackQuestion = async ({ tuner, pilot }) => {
    try {
        // send feedback prompt
        // const embed = questionPrompt.create({
        //     question: `How did you feel about the help you received from ${tuner.name}?`,
        //     details: {
        //         thumbnail: tuner.pfp,
        //     },
        // });
        // const feedback_question_first = await pilot.send({
        //     embed,
        // });

        const prompt = new Embed({
            ref: 'feedback',
            details: { name: tuner.name, thumbnail: tuner.pfp },
        });
        const promptMsg = await prompt.send({ to: pilot });

        // const feedback_question_edited = await feedback_question_first.edit({
        //     embed,
        //     component: actionRow({ ref: 'feedback', message_id: feedback_question_first.id }),
        // });

        // await response and then process response
        const {choice, timed_out, error} = await collectClick({
            buttoned_msg: promptMsg,
        });

        if (timed_out) {
            promptMsg.edit('*This message was a feedback question prompt that has now expired.*');

            logEvent({
                id: 'feedback_button_click',
                details: {
                    expired: true,
                    tuner,
                    pilot,
                },
            });

            return {
                timed_out: true,
                error: error,
            };
        }

        logEvent({
            id: 'feedback_button_click',
            details: {
                choice,
                tuner,
                pilot,
            },
        });

        // finish
        // feedback_question_first.edit({
        //     embed,
        //     component: actionRow({
        //         ref: 'feedback',
        //         disabled: true,
        //         message_id: feedback_question_first.id,
        //         chosen: change,
        //     }),
        // });

        await prompt.chooseBtn({ choice });
        logFeedback({
            pilot: pilot.id,
            tuner: tuner.id,
            choice,
        });

        return { attitude: choice, tuner_id: tuner.id };
    } catch (e) {
        console.log(e);
    }
};

const getTunerUserData = async ({ msg, tuners }) => {
    const tuner_user_data = [];
    for (let i = 0; i < tuners.length; i++) {
        const { user } = await msg.guild.members.fetch(tuners[i].toJSON().user_id);
        tuner_user_data.push({
            name: user.username + '#' + user.discriminator,
            id: user.id,
            pfp: getAvatarLink(user),
        });
    }

    return tuner_user_data;
};
