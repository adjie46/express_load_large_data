const library = require("../core/library");

exports.home_pages = async (req, res) => {
	return res.render("index", {
		csrfToken: req.csrfToken(),
	});
};

exports.get_data = async (req, res) => {
	try {
		await library.formData(req, res);

		let { draw, start, length, search } = req.query;
		let pageNumber = 1;

		let array = [];

		if (draw == 1) {
			pageNumber = 1;
		} else {
			pageNumber = 1;
			pageNumber += start++;
		}

		let countData = await library.model.mahaka_fatmawati.count();

		if (!library.isEmpty(search.value)) {
		} else {
			start = req.query.start;
			let datas = await library.model.mahaka_fatmawati.findAll({
				attributes: ["name", "date", "time", "area"],
				offset: parseInt(start),
				limit: parseInt(length),
			});

			await library.asyncForEach(datas, async (element, index) => {
				await library.waitFor(1);

				array.push([
					`${element.name}`,
					`${element.date}`,
					`${element.time}`,
					`${element.area}`,
				]);
			});

			return res.status(200).json({
				draw: draw,
				recordsTotal: countData,
				recordsFiltered: countData,
				data: array,
			});
		}
	} catch (error) {
		console.log(error);
		return res.status(library.responseStatus.serverError).send({
			success: false,
			code: library.responseStatus.serverError,
			message: error.message,
		});
	}
};
