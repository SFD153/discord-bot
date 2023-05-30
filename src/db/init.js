require('dotenv').config();
const { Sequelize } = require('sequelize');

class db {
    static sequelize;

    static use() {
        if (!this.sequelize) {
            this.sequelize = new Sequelize({
                database: process.env.DB_DATABASE,
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                dialect: 'postgres',
                logging: false,
                dialectOptions: {
                    ssl: {
                        require: true,
                        rejectUnauthorized: false,
                    },
                },
            });
        }

        return this.sequelize;
    }
}
export default db;
