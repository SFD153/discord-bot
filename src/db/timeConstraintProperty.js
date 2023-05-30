import { Op } from 'sequelize';
import { sub } from 'date-fns';

export default ({ time_parameter = 'all' }) => {
    try {
        switch (time_parameter) {
            case 'week':
                return {
                    [Op.gte]: sub(new Date(), { days: 7 }),
                };
            case 'month':
                return {
                    [Op.gte]: sub(new Date(), { days: 30 }),
                };            
            case 'cmonth':
                let date = new Date();
                date.setDate(1);
                date.setHours(0, 0, 0, 0);

                return {
                    [Op.gte]: date,
                };
            case 'all':
                return {
                    [Op.gte]: new Date('0'),
                };
            case 'arbitrary':
                return {
                    [Op.eq]: new Date('0'),
                };
            default:
                throw new Error(
                    'Invalid time_parameter' + JSON.stringify({ user_id, time_parameter })
                );
        }
    } catch (err) {
        console.log(err);
    }
};
