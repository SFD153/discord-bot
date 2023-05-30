const { describe } = require('jest-circus');
const { createUser } = require('../src/db/controllers');
const { clearDB } = require('./helpers/clearDB');

describe('user create and read testing', () => {
    beforeAll(() => {
        return clearDB();
    });

    const sampleUsers = ['357490324643512321', '833978121430499328', '439040504118902787'];

    describe('create users', () => {
        test.each(sampleUsers)('%p user created and read', async ([user_id]) => {
            try {
                const [user, isCreated] = await createUser({ user_id });
                const createdID = user.toJSON().user_id;

                expect(isCreated).toEqual(true);
                expect(createdID).toBe(user_id);
            } catch (e) {
                console.log(e);
            }
        });
    });
});
