import settings from '../config/settings';
import client from '../utils/client';
import getAvatarLink from '../utils/getAvatarLink';
import { actionRow } from '../buttons/row';

export default class Embed {
    constructor({ ref, details }) {
        this.embed;
        this.msg;
        this.ref = ref;

        this.#SET_DEFAULTS();

        switch (ref) {
            case 'points':
                return this.#POINTS_EMBED({ details });
            case 'leaderboard':
                return this.#LEADERBOARD_EMBED({ details });
            case 'raffle':
                return this.#RAFFLE_EMBED({ user });
            case 'feedback':
                return this.#FEEDBACK_EMBED({ details });
            case 'confirmation':
                return this.#CONFIRMATION_EMBED({ details });
            case 'confirmation_prompt':
                return this.#CONFIRMATION_PROMPT_EMBED({ details });
            case 'pickwinner':
                return this.#PICKWINNER_EMBED({ details });
            default:
                throw new Error('Invalid or missing ref parameter');
        }
    }

    return() {
        return this.embed;
    }

    async send({ to }) {
        try {
            const msg = await to.send({ embed: this.embed });

            this.msg = msg;

            if (this.ref === 'feedback') {
                await msg.edit({
                    embed: this.embed,
                    components: actionRow({
                        ref: this.ref,
                        message_id: msg.id,
                    }),
                });
            } else if (this.ref === 'confirmation_prompt') {
                this.ref = 'confirmation';
                if (this.attachment) {
                    const test = {
                        files: this.attachment,
                        embed: this.embed,
                        components: actionRow({
                            ref: 'confirmation',
                            message_id: msg.id,
                        }),
                    };
                    console.log(test);
                    await msg.edit(test);
                } else {
                    await msg.edit({
                        embed: this.embed,
                        components: actionRow({
                            ref: 'confirmation',
                            message_id: msg.id,
                        }),
                    });
                }
            }

            return msg;
        } catch (e) {
            console.log(e);
        }
    }

    async edit({ msg }) {
        try {
            await msg.edit('', { embed: this.embed });

            this.msg = msg;

            return msg;
        } catch (e) {
            console.log(e);
        }
    }

    async chooseBtn({ choice }) {
        try {
            // TODO: when expires on a button message like commander prompt, it throws an error, which will delete the button row. this is unintentionally a shortcut but have to come back to fix this eventually
            if (isNaN(choice) || ![-1, 0, 1].includes(choice))
                throw new Error(`Invalid or missing 'choice' parameter.`);

            await this.msg.edit({
                embed: this.embed,
                components: actionRow({
                    ref: this.ref,
                    message_id: this.msg.id,
                    choice,
                    disabled: true,
                }),
            });
        } catch (e) {
            console.log(e);
        }
    }

    // COMMON

    #SET_DEFAULTS() {
        this.embed = {
            color: 0x32aaff,
            author: {
                name: 'DeckTuner',
                icon_url: settings.image('bot_logo'),
                url: 'https://decktuner.com',
            },
            timestamp: new Date(),
        };
    }

    #TIME_PARAMETER_FOOTER({ time_parameter }) {
        const category = {
            week: 'Week',
            month: 'Month',
            cmonth: 'Calendar Month',
            all: 'All Time',
        }[time_parameter];

        this.embed.footer = {
            text: 'Points By ' + category,
        };
    }

    // EMBED TYPES

    #POINTS_EMBED({ details }) {
        const guild = client.guilds.cache.get(settings.server());
        const { user } = guild.members.cache.get(details.user.user_id);

        this.#TIME_PARAMETER_FOOTER({ time_parameter: details.time_parameter });

        this.embed.thumbnail = {
            url: getAvatarLink({ id: user.id, avatar: user.avatar }),
        };

        const ratio =
            +details.user.total_positives /
            (+details.user.total_positives + +details.user.total_negatives);
        const points = details.user.total_score;

        this.embed.fields = [
            {
                name: `${user.tag}`,
                value: `⭐ Points: ${points} (${(ratio * 100).toFixed(2).replace(/[.,]00$/, '')}%)`,
            },
        ];
    }

    #LEADERBOARD_EMBED({ details }) {
        try {
            const { leaderboard, time_parameter, top_user } = details;

            if (!top_user) {
                throw new Error('No top user.');
            }

            const getIndRatio = ({ p, n }) => {
                const ratio = +p / (+p + +n);
                const ratio_as_perc = (ratio * 100).toFixed(2).replace(/[.,]00$/, '');
                return `(${ratio_as_perc}%)`;
            };

            this.#TIME_PARAMETER_FOOTER({ time_parameter });

            this.embed.thumbnail = {
                url: getAvatarLink({
                    id: top_user.user.id,
                    avatar: top_user.user.avatar,
                }),
            };

            this.embed.fields = [
                {
                    name: `⭐ __Leaderboard__ ⭐`,
                    value: leaderboard.map(
                        (x, i) =>
                            `${i + 1}. <@${x.user_id}>: ${x.total_score} ${getIndRatio({
                                p: x.positive_count,
                                n: x.negative_count,
                            })}`
                    ),
                },
            ];
        } catch (e) {
            console.log(e);
        }
    }

    #RAFFLE_EMBED({ user }) {
        this.embed.thumbnail = {
            url: getAvatarLink({
                id: user.id,
                avatar: user.avatar,
            }),
        };

        this.embed.fields = [
            {
                name: `⭐ Winner: ${user.tag}`,
                value: `ID: ${user.id}`,
            },
        ];
    }

    // #FEEDBACK_PROMPT_EMBED({ question, i, questions_length, details, attachment }) {
    #FEEDBACK_EMBED({ details }) {
        const { name, thumbnail } = details;

        if (!details || !name || !thumbnail) {
            throw new Error('Invalid or missing parameters.');
        }

        this.embed.fields = [
            {
                name: '\u200b',
                value: `How did you feel about the help you received from **${name}?**`,
            },
        ];
        this.embed.thumbnail = {
            url: thumbnail,
        };

        // if (details && details.body) {
        //     this.embed.fields.push({
        //         name: details.title,
        //         value: details.body,
        //     });
        // }
        // if (details && details.image) {
        //     this.embed.image = {
        //         url: details.image,
        //     };
        // }

        // if (attachment) {
        //     this.embed.image = {
        //         url: 'attachment://commanders.jpg',
        //     };
        // }

        // footer: {
        //     text: questions_length ? `Question ${i + 1} / ${questions_length}` : '',
        // },
    }

    #CONFIRMATION_EMBED({ details }) {
        const { question, i, attachment } = details;

        this.embed.fields = [
            {
                name: '\u200b',
                value: question.question,
            },
        ];

        if (question.details) {
            this.embed.fields.push({
                name: question.details.title,
                value: question.details.body,
            });
        }

        this.embed.footer = {
            text: `Question ${i + 1} / ${7}`,
        };

        this.embed.image = {
            url: attachment ? 'attachment://commanders.jpg' : details.image,
        };

        // if (details && details.thumbnail) {
        //     embed.thumbnail = {
        //         url: details.thumbnail,
        //     };
        // }

        // return embed;
    }

    #CONFIRMATION_PROMPT_EMBED({ details }) {
        const { question, i, attachment } = details;

        if (attachment) {
            this.attachment = attachment;
        }

        this.embed.fields = [
            {
                name: '\u200b',
                value: question,
            },
        ];

        // if (question.details) {
        //     this.embed.fields.push({
        //         name: question.details.title,
        //         value: question.details.body,
        //     });
        // }

        // this.embed.footer = {
        //     text: `Question ${i + 1} / ${6}`,
        // };

        this.embed.image = {
            url: attachment ? 'attachment://commanders.jpg' : details.image,
        };

        // if (details && details.thumbnail) {
        //     embed.thumbnail = {
        //         url: details.thumbnail,
        //     };
        // }

        // return embed;
    }

    #PICKWINNER_EMBED({ details }) {
        try {
            const { winner } = details;

            this.embed.thumbnail = {
                url: getAvatarLink({ id: winner.id, avatar: winner.avatar }),
            };

            // const ratio =
            //     +details.user.total_positives /
            //     (+details.user.total_positives + +details.user.total_negatives);
            // const points = details.user.total_score;

            this.embed.fields = [
                {
                    name: `\u200b`,
                    value: `⭐ ${winner.username}#${winner.discriminator} has won!`,
                },
            ];
        } catch (e) {
            console.log(e);
        }
    }
}
