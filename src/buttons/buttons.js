const { MessageButton } = require('discord-buttons');


// TODO: delete this file if after testing everything works

// export const confirm_button = {
//     create: ({ message_id, disabled, text, prefix = '' }) => {
//         if (disabled) {
//             return new MessageButton()
//                 .setStyle('green')
//                 .setLabel(text)
//                 .setID('click_to_confirm_' + message_id)
//                 .setDisabled(disabled)
//                 .setEmoji(prefix);
//         } else {
//             return new MessageButton()
//                 .setStyle('green')
//                 .setLabel(text)
//                 .setID('click_to_confirm_' + message_id)
//         }
//     },
// };

// export const reject_button = {
//     create: ({message_id, disabled, text, prefix = ''}) => {
//         if (disabled) {
//             return new MessageButton()
//                 .setStyle('red')
//                 .setLabel(text)
//                 .setID('click_to_reject_' + message_id)
//                 .setDisabled(disabled)
//                 .setEmoji(prefix);
//         } else {
//             return new MessageButton()
//                 .setStyle('red')
//                 .setLabel(text)
//                 .setID('click_to_reject_' + message_id)
//         }
//     }
// };


// export const neutral_button = {
//     create: ({message_id, disabled, text, prefix = ''}) => {
//         const btn = new MessageButton();

//         if (disabled) {
//             return new MessageButton()
//                 .setStyle('gray')
//                 .setLabel(text)
//                 .setID('click_to_neutralize_' + message_id)
//                 .setDisabled(disabled)
//                 .setEmoji(prefix);
//         } else {
//             return new MessageButton()
//                 .setStyle('gray')
//                 .setLabel(text)
//                 .setID('click_to_neutralize_' + message_id)
//         }
//     }
// }

// note: at the time of making this, setDisabled does not accept any arguments to control the disabled state.
// therefore the conditional must exist to determine if the button should be disabled or not
