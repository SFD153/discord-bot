import axios from 'axios';
import settings from '../config/settings';
import { addCard } from '../db/controllers';
import logEvent from '../utils/logEvent';
import Permissions from '../utils/Permissions';

const updateCardAPI = async ({ msg }) => {
    try {
        if (!Permissions.checkRole({ user: msg.member, roles: 'admin' })) return;
        logEvent({
            id: 'update_card_api',
            details: {
                msg,
            },
        });
        const { data: bulk_data_dir } = await axios.get('https://api.scryfall.com/bulk-data');

        msg.channel.send(`${settings.emoji('loading')} Starting... This may take a few moments.`);
        const { download_uri } = bulk_data_dir.data.find((ref) => ref.type === 'unique_artwork');
        const { data } = await axios.get(download_uri);

        // get rid of unnecessary cards
        const legends = data.filter((x) => {
            if (!x.type_line) return;
            const type_line = x.type_line.toLowerCase();
            const real_card = Object.entries(x.legalities).some(
                ([format, legality]) => legality === 'legal' && format !== 'future'
            );
            // if (x.name.includes('Aminatou, the Fateshifter')) {
            //     console.log(x);
            //     console.log(type_line.includes('legend'));
            //     console.log(type_line.includes('creature'));
            //     console.log(real_card);
            //     console.log((x.image_uris || x.card_faces));
            // }
            return (
                type_line.includes('legend') &&
                (type_line.includes('creature') || type_line.includes('planeswalker')) &&
                real_card &&
                (x.image_uris || x.card_faces)
            );
        });
        msg.channel.send(
            `${settings.emoji(
                'loading'
            )} Finished fetch from Scryfall API, now submitting data to database.`
        );

        // filter out unnecessary data for each card
        const formatted_legends = legends.map((x) => ({
            name: x.name,
            image_normal: x.image_uris ? x.image_uris.normal : x.card_faces[0].image_uris.normal,
            image_art_crop: x.image_uris
                ? x.image_uris.art_crop
                : x.card_faces[0].image_uris.art_crop,
            color_identity: x.color_identity,
            is_edh_legal: x.legalities.commander === 'legal',
            is_partner: x.keywords.some((keyword) => keyword.toLowerCase() === 'partner'),
            scryfall_id: x.id,
        }));

        // process submission to the database
        const submission = await addCard({ cards: formatted_legends });
        const total_additions = submission.reduce((acc, item) => (item[1] ? acc + 1 : acc), 0);
        const total_count = submission.length;
        msg.channel.send(
            `✅ Finished submitting to the database. There were ${total_additions} new additions, resulting in ${total_count} total valid commanders available.`
        );
    } catch (e) {        
        msg.channel.send(`Something went wrong.`);
        console.log(e);
    }
};

export default updateCardAPI;
