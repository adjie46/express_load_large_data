'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class mahaka_fatmawati extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  mahaka_fatmawati.init({
    frameid: DataTypes.STRING,
    area: DataTypes.STRING,
    name: DataTypes.STRING,
    dataid: DataTypes.STRING,
    bearing: DataTypes.STRING,
    countingdirection: DataTypes.STRING,
    anglewithcountingline: DataTypes.STRING,
    lastrecid: DataTypes.STRING,
    date: DataTypes.DATEONLY,
    time: DataTypes.TIME,
    timestamp: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'mahaka_fatmawati',
  });
  return mahaka_fatmawati;
};