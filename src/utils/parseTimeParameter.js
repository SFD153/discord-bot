export default ({ content }) => {
    const msg_array = content.toLowerCase().split(' ');

    if (msg_array[1]) {
        if (msg_array[1].includes('week')) {
            return 'week';
        } else if (msg_array[1].includes('cmonth')) {
            return 'cmonth';
        } else if (msg_array[1].includes('month')) {
            return 'month';
        }
    };

    return 'all';
};
