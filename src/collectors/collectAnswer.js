import logEvent from '../utils/logEvent';
import questionPrompt from '../embeds/questionPrompt';
import interviewAnswerReducer from '../utils/interviewAnswerReducer';
import Response from '../utils/Response';
import Embed from '../embeds/Embed';
const mergeImages = require('merge-images');
const { Canvas, Image } = require('canvas');

const collectAnswer = async ({ question, channel, i, questions_length, user }) => {
    try {
        // const embed = questionPrompt.create({
        //     question: question.question,
        //     details: question.details,
        //     i,
        //     questions_length,
        // });
        // await channel.send({ embed });

        const prompt = new Embed({ ref: 'confirmation', details: { question, i } });
        const test = await prompt.send({ to: channel });

        const collected = await channel.awaitMessages((response) => response, {
            max: 1,
            time: 3 * 60 * 1000,
        });

        const closing =
            collected.size &&
            ['!cancel', '!close'].some((x) => collected.first().content.startsWith(x));
        
        logEvent({
            id: 'workshop_open_interview_collect_answer',
            details: {
                expired: !collected.size,
                msg: collected.first(),
                closing,
                question_key: question.key,
                user,
            },
        });

        if (!collected.size) {
            return {
                cancel: true,
                proceed: false,
                error: "Time expired. Restart the questionnaire when you're ready.",
            };
        }

        if (closing) {
            collected.first().react('✅');
            return {
                cancel: true,
                proceed: false,
                error: 'Questionnaire cancelled. If you would like to begin again go back to the server and type !tune in the designated channel.',
            };
        }

        const { content, proceed, error, details, cancel } = await interviewAnswerReducer({
            content: collected.first().content,
            key: question.key,
            channel,
        });

        if (proceed) {
            collected.first().react('✅');
        } else {
            collected.first().react('❌');
        }

        return { proceed, error, content, details, cancel };
    } catch (e) {
        console.log(e);
        return {
            cancel: true,
            proceed: false,
            error: 'An unexpected error occurred. An API that the bot utilizes is likely down right now. Please contact an admin so they can look into it.',
        };
    }
};

export default collectAnswer;
