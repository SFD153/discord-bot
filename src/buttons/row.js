const { MessageActionRow, MessageButton } = require('discord-buttons');
// import { confirm_button, neutral_button, reject_button } from './buttons';

const button = {
    create: ({ disabled, message_id, text, prefix = '', ref }) => {
        if (!ref) throw new Error('No ref was passed.');
        const btnRef = {
            get reject() {
                return this.negative;
            },
            get confirm() {
                return this.positive;
            },
            positive: { type: 'positive', style: 'green' },
            neutral: { type: 'neutral', style: 'gray' },
            negative: { type: 'negative', style: 'red' },
        }[ref];

        const btn = new MessageButton();
        btn.setStyle(btnRef.style);
        btn.setLabel(text);
        btn.setID(`click_to_${btnRef.type}_` + message_id);
        if (disabled) {
            btn.setDisabled(true);
            btn.setEmoji(prefix);
        } else {
            btn.setDisabled(false);
        }

        return btn;
    },
};

export const actionRow = ({ ref, message_id, disabled = false, choice } = {}) => {
    try {
        const row = new MessageActionRow();
        const buttonReference = {
            feedback: [
                { text: 'Positive', ref: 'positive', prefix: choice === 1 ? '✅' : '' },
                { text: 'Neutral', ref: 'neutral', prefix: choice === 0 ? '➖' : '' },
                { text: 'Negative', ref: 'negative', prefix: choice === -1 ? '✖️' : '' },
            ],
            confirmation: [
                { text: 'Confirm', ref: 'confirm', prefix: choice === 0 ? '✅' : '' },
                { text: 'Try again', ref: 'negative', prefix: choice === -1 ? '✖️' : '' },
            ],
        };

        buttonReference[ref].forEach((btn) =>
            row.addComponent(
                button.create({
                    ...btn,
                    message_id,
                    disabled,
                })
            )
        );

        return row;
    } catch (e) {
        console.log(e);
    }
};

// export const confirmationRow = ({ message_id, disabled, chosen }) => {
//     try {
//         return new MessageActionRow().addComponent(
//             confirm_button.create({
//                 message_id,
//                 disabled,
//                 text: 'Confirm',
//                 prefix: chosen == 1 ? '✅' : '',
//             })
//         );
//         // .addComponent(
//         //     reject_button.create({
//         //         message_id,
//         //         disabled,
//         //         text: 'Try again',
//         //         prefix: chosen == -1 ? '✖️' : '',
//         //     })
//         // );
//     } catch (e) {
//         console.log(e);
//     }
// };
