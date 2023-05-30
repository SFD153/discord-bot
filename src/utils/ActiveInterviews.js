class ActiveInterviews {
    static people = [];

    static getUsers() {
        return this.people;
    }

    static userExists(user) {
        return this.people.some((x) => x === user);
    }

    static addUser(user) {
        if (this.people.some((x) => x === user)) {
            return { added: false };
        }
        this.people.push(user);
        return this.people;
    }

    static removeUser(user) {
        this.people = this.people.filter((x) => x !== user);
        return this.people;
    }
}

export default ActiveInterviews;
