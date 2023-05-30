import client from '../utils/client';
import settings from '../config/settings';
import bountyListing from '../embeds/bountyListing';
import logEvent from '../utils/logEvent';

const openWorkshop = async ({ msg, fields, suffix, i = 0 }) => {
    try {
        const guild = client.guilds.cache.get(settings.server());
        const help_channel = await guild.channels.create('workshop-' + suffix, {
            topic: `Workshop for ${msg.author.username}#${msg.author.discriminator}`,
            parent: settings.channel('workshop_category')[i],
        });
        const starting_msg = await help_channel.send(
            `${msg.author} Your workshop has been created and a tuner will contact you soon. Thanks for using DeckTuner!`,
            {
                embed: bountyListing.create({
                    author: msg.author,
                    fields,
                    channel: help_channel.id,
                    empty_tuners: true,
                }),
            }
        );
        starting_msg.pin();

        logEvent({
            id: 'workshop_open_success',
            details: {
                workshop_tag: suffix,
                workshop_id: help_channel.id,
                msg, // just need msg for the user info
            },
        });

        // setting up roles and permissions for the created channel
        const role = await guild.roles.create({ data: { name: `role-${suffix}` } });

        const pilotRole = guild.roles.cache.find((x) => x.name === 'Pilot');
        const moderatorRole = guild.roles.cache.find((x) => x.name === 'Moderator');
        const adminRole = guild.roles.cache.find((x) => x.name === 'Admin');
        const tunerRole = guild.roles.cache.find((x) => x.name === 'Tuner');
        const proTunerRole = guild.roles.cache.find((x) => x.name === 'Pro Tuner');
        const leadTunerRole = guild.roles.cache.find((x) => x.name === 'Lead Tuner');

        help_channel.updateOverwrite(role, { SEND_MESSAGES: true });
        help_channel.updateOverwrite(pilotRole, { SEND_MESSAGES: false });
        help_channel.updateOverwrite(moderatorRole, { SEND_MESSAGES: true });
        help_channel.updateOverwrite(adminRole, { SEND_MESSAGES: true });
        help_channel.updateOverwrite(tunerRole, { SEND_MESSAGES: true });
        leadTunerRole && help_channel.updateOverwrite(leadTunerRole, { SEND_MESSAGES: true });
        proTunerRole && help_channel.updateOverwrite(proTunerRole, { SEND_MESSAGES: true });
        msg.member.roles.add(role);

        return help_channel;
    } catch (e) {
        if (e.code === 50035 && i !== 2) {
            return await openWorkshop({ msg, fields, suffix, i: i + 1 });
        }
        console.log(e);
    }
};

export default openWorkshop;
