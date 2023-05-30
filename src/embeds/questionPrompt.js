import settings from '../config/settings';
import getAvatarLink from '../utils/getAvatarLink';

const cbWr = (str) => '```' + str + '```'; // code block wrapper
const cl = (arr) => arr.filter((x) => x); // clean array of undefined items (for fields)

export default {
    create: ({ question, i, questions_length, details, attachment }) => {
        const embed = {
            color: 0x32aaff,
            author: {
                name: 'DeckTuner',
                icon_url: settings.image('bot_logo'),
                url: 'https://decktuner.com',
            },
            fields: cl([
                {
                    name: '\u200b',
                    value: question,
                },
                details &&
                    details.body && {
                        name: details.title,
                        value: details.body,
                    },
            ]),
            timestamp: new Date(),
            footer: {
                text: questions_length ? `Question ${i + 1} / ${questions_length}` : '',
            },
        };

        if (details && details.image) {
            embed.image = {
                url: details.image,
            };
        }

        if (attachment) {
            embed.image = {
                url: 'attachment://commanders.jpg',
            };
        }

        if (details && details.thumbnail) {
            embed.thumbnail = {
                url: details.thumbnail,
            };
        }

        return embed;
    },
};
