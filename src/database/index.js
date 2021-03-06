import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import File from '../app/models/File';
import User from '../app/models/User';
import Appointments from '../app/models/Appointments';

import databaseConfig from '../config/database';

const models = [User, File, Appointments];

class Database {
    constructor(){
        this.init();
        this.mongo();
    }

    init(){
        this.connection = new Sequelize(databaseConfig);

        models
        .map(model => model.init(this.connection))
        .map(model => model.associate && model.associate(this.connection.models));
    }

    mongo(){
        this.mongoConnection = mongoose.connect(
            'mongodb://EmanoelJohannes:gobarber123@ds333248.mlab.com:33248/gobarber',
            { useNewUrlParser: true, useFindAndModify: true, useUnifiedTopology: true }
        );
    }
}

export default new Database();