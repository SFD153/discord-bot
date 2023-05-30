import Embed from '../embeds/Embed';
import responses from '../config/responses';
import questionPrompt from '../embeds/questionPrompt';

/** Class representing several chat responses the bot can make. The responses are represented as methods. */
export default class Response {
    static reject({ msg, ref, literal }) {
        try {
            if (!responses[ref] && !literal) throw new Error('Incorrect ref parameter.');

            console.trace('Tracing rejection message - Provided ref: ', ref);
            msg.react('❌');
            if (literal) {
                return msg.reply(literal);
            }
            return msg.reply('❌ ' + responses[ref]);
        } catch (e) {
            console.log(e);
        }
    }

    static reply({ msg, ref, literal, channel }) {
        try {
            if (!responses[ref] && !literal)
                throw new Error('Invalid or missing ref or literal parameter.');

            let source;
            let method;
            if (msg && msg.content) {
                source = msg;
                method = 'reply';
            } else if (channel && channel.messages) {
                source = channel;
                method = 'send';
            } else throw new Error('Invalid or missing msg or channel parameter.');

            if (literal) return source[method](literal);

            return source[method](responses[ref]);
        } catch (e) {
            console.log(e);
        }
    }

    static sendEmbed({ source, ref, details, msg }) {
        try {
            const embed = new Embed({ ref, details });
            msg.channel.send({ embed: embed.return() });
        } catch (e) {
            console.log(e);
        }
    }

    static sendEditableEmbed({ source, ref, details, msg }) {
        try {
            const embed = new Embed({ ref, details });
            return async () => msg.channel.send({ embed: embed.return() });
        } catch (e) {
            console.log(e);
        }
    }
}
