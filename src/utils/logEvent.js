import chalk from 'chalk';

export default async ({ id, details }) => {
    try {
        if (process.env.NODE_ENV === 'development') {
            return;
        }
        const possible_ids = [
            'workshop_interview_begin',
            'update_card_api',
            'command_points',
            'command_leaderboard',
            'command_close_self',
            'command_close_force_bad_permissions',
            'command_pickwinner',
            'tuner_participation',
            'workshop_open_interview_collect_answer',
            'workshop_open_success',
            'feedback_button_click',
            'workshop_close_success',
            'interview_button_click',
        ];

        if (!possible_ids.includes(id)) {
            throw new Error('logEvent was called, but a valid id value wasnt passed.\nid: ' + id);
        }

        return constructLogMsg({ details, id });
    } catch (e) {
        console.log(e);
    }
};

const constructLogMsg = ({
    id,
    details: {
        msg,
        roles,
        expired,
        closing,
        question_key,
        workshop_tag,
        workshop_id,
        user,
        tuner,
        pilot,
        change,
        force,
        choice
    },
}) => {
    const id_key = chalk.cyan('id:');
    const id_value = chalk.greenBright(id);

    const date_field = chalk.cyan(new Date().toString());

    const user_key = chalk.cyan('User:');
    const user_value = user
        ? chalk.greenBright(user.username + '#' + user.discriminator)
        : msg && chalk.greenBright(msg.author.username + '#' + msg.author.discriminator);

    const user_id_key = chalk.cyan('User ID:');
    const user_id_value = user
        ? chalk.greenBright(user.id)
        : msg && chalk.greenBright(msg.author.id);

    const pilot_id_key = chalk.cyan('Pilot ID:');
    const pilot_id_value = pilot && chalk.greenBright(pilot.id);

    const tuner_id_key = chalk.cyan('Tuner ID:');
    const tuner_id_value = tuner && chalk.greenBright(tuner.id);

    const content_key = chalk.cyan('Content:');
    const content_value = msg && chalk.greenBright(msg.content);

    const channel_name_key = chalk.cyan('Channel Name:');
    const channel_name_value = msg && chalk.greenBright(msg.channel.name);

    const channel_id_key = chalk.cyan('Channel ID:');
    const channel_id_value = msg && chalk.greenBright(msg.channel.id);

    const roles_key = chalk.cyan('Roles:');
    const roles_value = roles && chalk.greenBright(roles.join(', '));

    const closing_key = chalk.cyan('Closing:');
    const closing_value = closing && chalk.greenBright(closing);

    const expired_key = chalk.cyan('Expired:');
    const expired_value = expired && chalk.greenBright(expired);

    const question_key_key = chalk.cyan('Question:');
    const question_key_value = question_key && chalk.greenBright(question_key);

    const workshop_tag_key = chalk.cyan('Workshop Tag:');
    const workshop_tag_value = workshop_tag && chalk.greenBright(workshop_tag);

    const workshop_id_key = chalk.cyan('Workshop ID:');
    const workshop_id_value = workshop_id && chalk.greenBright(workshop_id);

    const change_key = chalk.cyan('Change:');
    const change_value = change && chalk.greenBright(change);

    const force_key = chalk.cyan('Forced:');
    const force_value = force && chalk.greenBright(force);

    const choice_key = chalk.cyan('Choice:');
    const choice_value = choice && chalk.greenBright(choice);

    const output = [`${id_key} ${id_value} --- ${date_field}`];

    if (
        [
            'update_card_api',
            'workshop_interview_begin',
            'command_points',
            'command_leaderboard',
            'command_pickwinner',
        ].includes(id)
    ) {
        output.push(
            `---- ${user_key} ${user_value}`,
            `---- ${user_id_key} ${user_id_value}`,
            `---- ${content_key} ${content_value}`
        );
    } else if (id === 'command_close_self' || id === 'workshop_close_success') {
        output.push(
            `---- ${user_key} ${user_value}`,
            `---- ${user_id_key} ${user_id_value}`,
            `---- ${channel_id_key} ${channel_id_value}`,
            force && `---- ${force_key} ${force_value}`
        );
    } else if (id === 'command_close_force_bad_permissions') {
        output.push(
            `---- ${user_key} ${user_value}`,
            `---- ${content_key} ${content_value}`,
            `---- ${roles_key} ${roles_value}`
        );
    } else if (id === 'tuner_participation') {
        output.push(
            `---- ${user_key} ${user_value}`,
            `---- ${channel_name_key} ${channel_name_value}`,
            `---- ${channel_id_key} ${channel_id_value}`
        );
    } else if (id === 'workshop_open_interview_collect_answer') {
        output.push(
            `---- ${user_key} ${user_value}`,
            `---- ${question_key_key} ${question_key_value}`,
            msg && `---- ${content_key} ${content_value}`,
            closing && `---- ${closing_key} ${closing_value}`,
            expired && `---- ${expired_key} ${expired_value}`
        );
    } else if (id === 'workshop_open_success') {
        output.push(
            `---- ${user_key} ${user_value}`,
            `---- ${workshop_tag_key} ${workshop_tag_value}`,
            `---- ${workshop_id_key} ${workshop_id_value}`
        );
    } else if (id === 'feedback_button_click') {
        output.push(
            `---- ${pilot_id_key} ${pilot_id_value}`,
            `---- ${tuner_id_key} ${tuner_id_value}`,
            change && change !== 0 && `---- ${change_key} ${change_value}`,
            expired && `---- ${expired_key} ${expired_value}`
        );
    } else if (id === 'interview_button_click') {
        output.push(
            `---- ${user_key} ${user_value}`,
            expired && `---- ${expired_key} ${expired_value}`,
            choice && `---- ${choice_key} ${choice_value}`
        );
    }

    console.log(output.filter((x) => x).join('\n') + '\n');
};
