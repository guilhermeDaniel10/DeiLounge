const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        nome: { type: DataTypes.STRING, allowNull: false },
        abreviacao: { type: DataTypes.STRING, allowNull: false},
        curso: { type: DataTypes.INTEGER, allowNull: false, 
        references: {
            model: 'cursos',
            key: 'id'
        }}
    };

    const options = {
        
    };

    return sequelize.define('UnidadesCurriculares', attributes, options);
}