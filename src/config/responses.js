import settings from '../config/settings';

const examples = {
    set_points: 'Follow this syntax to set points: `!setpoints 50 @DeckTuner`',
};

export default {
    force_close: 'You do not have permissions to force close this channel.',
    close_bad_permission: "Only the pilot who created the workshop may close the channel. An admin can also !forceclose the channel.",
    no_score: 'No score found for the given time parameter.',
    currently_interviewing:
        'Looks like you are already in the process of a tuning interview. If you want to exit the interview, message !cancel in private messages to me.',
    one_workshop_rule: `Looks like you already have an active workshop. If you're finished with your current workshop, enter !close in the workshop channel and then follow the prompt to leave feedback for the tuners that helped you. Then you will be able to open a new workshop.`,
    tuning_interview_initiated:
        'Deck Tuning process initiated!\nCheck your messages to answer some questions to get started.',
    workshop_db_error: `Database error. Expected Workshop to exist in database, but it didn't.`,
    expired_feedback_prompt:
        "Looks like feedback question prompt expired. Restart the feedback process when you're ready.",
    fetching_commander: `${settings.emoji(
        'loading'
    )} Fetching commander details. Sometimes this might take a moment.`,
    setpoints_no_number: 'Amount given was not a number. ' + examples.set_points,
    setpoints_negative_number: 'Amount given must be 0 or higher. ' + examples.set_points,
    setpoints_no_user: 'No user provided. ' + examples.set_points,
    pickwinner_please_wait: `${settings.emoji('loading')} Picking a winner... This may take a few moments.`
};
