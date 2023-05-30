import { addUserFeedback } from '../../db/controllers';
import Embed from '../../embeds/Embed';
import getAvatarLink from '../../utils/getAvatarLink';

export default async ({ msg }) => {
    try {
        await addUserFeedback({ user_id: msg.author.id, attitude: -1 });
    } catch (err) {
        console.log(err);
    }
};

const feedbackPromptMessageTest = async () => {
    const name = 'Ox#9999';
    const thumbnail = getAvatarLink(msg.author);

    const whatever = new Embed({ ref: 'feedback', details: { name, thumbnail } });
    const test = await whatever.send({ to: msg.channel });
    const test2 = await whatever.chooseBtn({ choice: -1 });
};

