const { dropTable, createUser } = require('../../src/db/controllers');
const db = require('../../src/db/init').default;
const models = require('../../src/db/models').default;

const clearDB = async () => {
    const sequelize = db.use();
    const { AllModels } = await models();

    for (let i = 0; i < AllModels.length; i++) {
        await AllModels[i].drop({ cascade: true });
    }
    await sequelize.sync({ force: true });
};

module.exports = { clearDB };
