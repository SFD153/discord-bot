import collectAnswer from '../collectors/collectAnswer';
import interview_questions from '../config/interview_questions';
import ActiveInterviews from '../utils/ActiveInterviews';
import endInterview from './endInterview';
import logEvent from '../utils/logEvent';

const startInterview = async (msg) => {
    try {
        logEvent({
            id: 'workshop_interview_begin',
            details: {
                msg,
            },
        });
        ActiveInterviews.addUser(msg.author.id);
        const intro_msg = await msg.author.send(
            'Please complete a series of questions so that the tuning session can begin.'
        );
        const questions = [...interview_questions];
        let answers = [];
        for (let i = 0; i < questions.length; ) {
            const question = questions[i];

            const { proceed, content, error, cancel, details } = await collectAnswer({
                question,
                channel: intro_msg.channel,
                i,
                questions_length: questions.length,
                user: msg.author // just for event logging
            });

            if (error || cancel) {
                await intro_msg.channel.send(error);
                if (cancel) {
                    break;
                }
                // if not cancelled, will repeat current iteration
            } else {
                answers.push({ key: question.key, content, details });
                i++;
            }
        }

        if (answers.length !== questions.length) {
            return ActiveInterviews.removeUser(msg.author.id);
        }

        endInterview({ intro_msg, answers, msg });
    } catch (err) {
        ActiveInterviews.removeUser(msg.author.id);
        console.log(err);
    }
};

export default startInterview;
