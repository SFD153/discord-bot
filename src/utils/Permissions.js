import client from './client';
import settings from '../config/settings';

/** Class representing several permission related actions. The actions are represented as methods. */
export default class Permissions {
    /**
     * Evaluates a user's roles against the roles passed to the object parameter.
     * @param {string|object} parameter - Preferably pass member object, but can also pass discord id of user.
     * @param {string|string[]} parameter.roles - If the user has any of these rules, will return true.
     * @returns {boolean}
     */
    static checkRole({ user: userArg, roles }) {
        try {
            const guild = client.guilds.cache.get(settings.server());
            const user_id = typeof userArg === 'string' ? userArg : userArg.id;

            if (!user_id) throw new Error('Invalid user passed.');

            const user = guild.members.cache.get(user_id);

            const usersRoles = user.roles.cache.map((role) => role.name.toLowerCase().trim());

            const rolesToCheck = typeof roles === "string" ? [roles] : roles;
            const hasAnyRole = rolesToCheck.some((role) => usersRoles.includes(role.toLowerCase()));

            return hasAnyRole;
        } catch (e) {
            console.log(e);
        }
    }

    static #ADD_OR_REMOVE_ROLE({ user: userArg, role: roleToGrant, action }) {
        try {
            if (!['add', 'remove'].includes(action)) throw new Error(`Invalid action property. Should be "add" or "remove"`);

            const guild = client.guilds.cache.get(settings.server());
            const user_id = typeof userArg === 'string' ? userArg : userArg.id;

            if (!user_id) throw new Error('Invalid user passed.');

            const user = guild.members.cache.get(user_id);

            const role = guild.roles.cache.find(
                (role) => role.name.toLowerCase() === roleToGrant.toLowerCase()
            );

            user.roles[action](role);
        } catch (e) {
            console.log(e);
        }
    }
    static grantRole(arg) {
        this.#ADD_OR_REMOVE_ROLE({
            ...arg,
            action: "add"
        })
    }
    static removeRole(arg) {
        this.#ADD_OR_REMOVE_ROLE({
            ...arg,
            action: "remove"
        })
    }
}
