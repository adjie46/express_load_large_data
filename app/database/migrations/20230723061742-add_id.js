"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		return Promise.all([
			queryInterface.addColumn(
				"mahaka_fatmawatis", // table name
				"id", // new field name
				{
					type: Sequelize.BIGINT,
					allowNull: false,
				}
			),
			queryInterface.addColumn(
				"mahaka_fatmawatis", // table name
				"createdAt", // new field name
				{
					type: "TIMESTAMP",
					defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
					allowNull: false,
				}
			),
			queryInterface.addColumn(
				"mahaka_fatmawatis", // table name
				"updatedAt", // new field name
				{
					type: "TIMESTAMP",
					defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
					allowNull: false,
				}
			),
		]);
	},

	async down(queryInterface, Sequelize) {
		return Promise.all([
			queryInterface.removeColumn("mahaka_fatmawatis", "id"),
			queryInterface.removeColumn("mahaka_fatmawatis", "created_at"),
			queryInterface.removeColumn("mahaka_fatmawatis", "updated_at"),
		]);
	},
};
