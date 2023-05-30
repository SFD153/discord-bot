import { findCardByName } from '../db/controllers';

export default async ({ content }) => {
    try {
        const lcContent = content.toLowerCase();
        let commander_list = lcContent.includes('+')
            ? lcContent.split('+').map((x) => x.trim())
            : lcContent
                  .split('\n')
                  .filter((x) => x)
                  .map((x) => x.trim());

        let fetched_commander_list = [];
        for (let i = 0; i < commander_list.length; i++) {
            const requested_commander = commander_list[i];

            const found_commander = await findCardByName({ search: requested_commander });

            if (!found_commander) {
                return {
                    error: `❌ ${requested_commander} not found in database.`,
                };
            }

            if (commander_list.length > 1 && !found_commander.is_partner) {
                return {
                    error: "❌ You chose two commanders and one or more of the commanders you selected aren't partners. Please try again.",
                };
            }

            fetched_commander_list.push(found_commander);
        }
        return { fetched_commander_list };
    } catch (e) {
        console.log(e);
    }
};
