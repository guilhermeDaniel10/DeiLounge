const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        nome: { type: DataTypes.STRING, allowNull: false },
        abreviacao: { type: DataTypes.STRING, allowNull: false},
    };

    const options = {
        
    };

    return sequelize.define('Curso', attributes, options);
}