import getAvatarLink from '../utils/getAvatarLink';
import settings from '../config/settings';

const cl = (arr) => arr.filter((x) => x); // clean array of undefined items (for fields)

export default {
    create: ({ fields, author, channel = 'example', empty_tuners }) => {
        const embed = {
            color: 0x32aaff,
            title: fields.find((x) => x.key == 'commander').details.name,
            url: fields.find((x) => x.key == 'decklist').content,
            author: {
                name: 'DeckTuner',
                icon_url: settings.image('bot_logo'),
                url: 'https://decktuner.com',
            },
            description: fields
                .find((x) => x.key == 'commander')
                .details.colorIdentity.map((x) => settings.emoji("colors")[x])
                .join(' '),
            fields: cl([
                {
                    name: 'Deck Strategy',
                    value:
                        '```' +
                        fields.find((x) => x.key == 'deck_goals').content +
                        '```',
                },
                {
                    name: 'Tuning Goals',
                    value:
                        '```' +
                        fields.find((x) => x.key == 'tuning_goals').content +
                        '```',
                },
                {
                    name: 'Pilot',
                    value: `<@${author.id}>`,
                    inline: true,
                },
                {
                    name: 'Category',
                    value: `${
                        fields.find((x) => x.key == 'desired_experience')
                            .content
                    }`,
                    inline: true,
                },
                {
                    name: 'Budget',
                    value: `${fields.find((x) => x.key == 'budget').content}`,
                    inline: true,
                },
                !empty_tuners && {
                    name: 'Tuners',
                    value: `*none*`,
                    inline: true,
                },
                {
                    name: 'Room',
                    value: `<#${channel}>`,
                    inline: true,
                },
                {
                    name: 'Tip Amount',
                    value: `${fields.find((x) => x.key == 'tip_amount').content}`,
                    inline: true,
                },
            ]),
            thumbnail: {
                url: fields.find((x) => x.key == 'commander').details.art_image,
            },
            timestamp: new Date(),
            footer: {
                text: '\u200b',
                icon_url: getAvatarLink(author),
            },
        };

        const commander_field = fields.find((x) => x.key == 'commander');
        if (commander_field.details.colorIdentity) {
            embed.description = fields
                .find((x) => x.key == 'commander')
                .details.colorIdentity.map((x) => settings.emoji("colors")[x])
                .join(' ');
        }

        return embed;
    },
};

// {
//     name: '\u200b',
//     value: '\u200b',
//     inline: false,
// },
