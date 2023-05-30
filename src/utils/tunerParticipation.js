import settings from '../config/settings';
import { addTunerToWorkshop, findWorkshopById, createUser } from '../db/controllers';
import client from './client';
import logEvent from './logEvent';

export default async ({ msg }) => {
    try {
        createUser({ user_id: msg.author.id });

        const added_data = await addTunerToWorkshop({
            channel_id: msg.channel.id,
            user_id: msg.author.id,
        });

        // if tuner is already added, skip next process
        if (!added_data) {
            return;
        }

        logEvent({
            id: 'tuner_participation',
            details: {
                msg,
            },
        });
        
        const [workshop, tuners] = await findWorkshopById({
            channel_id: msg.channel.id,
        });

        // find bounty board message and then append tuner to it (looks messy due to discord API)
        const bounty_board = client.channels.cache.get(settings.channel('bounty_board'));
        const post = await bounty_board.messages.fetch(workshop.toJSON().post_id);
        const tuner_field_index = post.embeds[0].fields.findIndex((x) => x.name === 'Tuners');
        const tuner_field = post.embeds[0].fields[tuner_field_index];
        const tuner_value = '<@' + tuners.map((x) => x.toJSON().user_id).join('>\n<@') + '>';
        let fields_after_edit = [...post.embeds[0].fields];
        fields_after_edit[tuner_field_index] = {
            ...tuner_field,
            value: tuner_value,
        };

        post.edit({
            embed: {
                ...post.embeds[0],
                fields: fields_after_edit,
            },
        });
    } catch (err) {
        console.log(err);
    }
};
