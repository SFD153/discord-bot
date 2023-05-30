import { actionRow } from '../buttons/row';
import collectClick from '../collectors/collectClick';
import settings from '../config/settings';
import questionPrompt from '../embeds/questionPrompt';
import parseDeckLink from '../utils/parseDeckLink';
import generatePartnerImage from './generatePartnerImage';
import getCommanderData from './getCommanderData';
import logEvent from './logEvent';
import interviewAnswersCharLimit from '../config/interviewAnswersCharLimit';

const interviewAnswerReducer = async ({ content, key, channel }) => {
    try {
        const { max_length } = interviewAnswersCharLimit.find((x) => x.key === key);
        const lengthValid = content.length <= max_length;

        if (lengthValid === false) {
            return {
                content,
                proceed: false,
                error: `❌ Length of answer too long. Please cut down the length. Max char count: ${max_length}`,
            };
        }

        if (key === 'decklist') {
            return parseDeckLink({ content });
        } else if (key !== 'commander') {
            return { content, proceed: true };
        }

        channel.startTyping();

        const please_wait_msg = await channel.send(
            `${settings.emoji(
                'loading'
            )} Fetching commander details. Sometimes this might take a moment.`
        );

        const { fetched_commander_list, error: commander_error } = await getCommanderData({
            content,
        });

        if (commander_error) {
            please_wait_msg.delete();
            return {
                content,
                proceed: false,
                error: commander_error,
            };
        }

        const partner_image = await generatePartnerImage({ fetched_commander_list });

        // create message prompt and wait for click
        const embed = questionPrompt.create({
            question:
                fetched_commander_list.length == 1
                    ? 'Please confirm if this is your commander'
                    : 'Please confirm if these are your commanders',
            details: {
                title: fetched_commander_list.map((x) => x.name).join(' + '),
                image: fetched_commander_list.length == 1 && fetched_commander_list[0].image_normal,
            },
            attachment: !!partner_image,
        });
        const msg_opt_default = { files: partner_image && [partner_image], embed };

        const sent_question = await channel.send(msg_opt_default);
        const edited_question = await sent_question.edit({
            ...msg_opt_default,
            component: actionRow({
                ref: 'confirmation',
                message_id: sent_question.id,
            }),
        });

        please_wait_msg.delete();

        const { choice, timed_out } = await collectClick({
            buttoned_msg: edited_question,
        });

        logEvent({
            id: 'interview_button_click',
            details: {
                expired: timed_out,
                user: channel.recipient,
                choice,
            },
        });

        // error handling and editing the original message to be answered
        edited_question.edit({
            ...msg_opt_default,
            component: actionRow({
                ref: 'confirmation',
                message_id: sent_question.id,
                disabled: true,
            }),
        });

        if (choice === -1) {
            return {
                proceed: false,
                error: '❌ Commander rejected. Try typing in a new commander name. Try to be more specific this time.',
            };
        } else if (timed_out) {
            return {
                proceed: false,
                cancel: true,
                error: `Looks like you didn't confirm in time. Restart the interview process in the server when you're ready.`,
            };
        }

        const getClrIdentity = () => {
            let identity = [...new Set(fetched_commander_list.map((x) => x.color_identity).flat())];
            if (identity.includes('X') && identity.length > 1) {
                identity = identity.filter((x) => x !== 'X');
            }
            if (!identity.length) {
                identity.push('X');
            }

            return identity;
        };

        return {
            content,
            proceed: true,
            details: {
                attachment: !!partner_image,
                name: fetched_commander_list.map((cmdr) => cmdr.name).join(' + '),
                colorIdentity: getClrIdentity(),
                image: partner_image || fetched_commander_list[0].image_normal,
                art_image:
                    fetched_commander_list.length == 1
                        ? fetched_commander_list[0].image_art_crop
                        : 'https://c1.scryfall.com/file/scryfall-cards/art_crop/front/d/e/de4f53fc-69d7-49fb-885b-4cc02bf5facc.jpg?1562594477',
            },
        };
    } catch (e) {
        console.log(e);
    } finally {
        channel.stopTyping();
    }
};

export default interviewAnswerReducer;
