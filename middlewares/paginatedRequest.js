module.exports = (Model) => {
    return async (req, res) => {
        let { page = 1, limit = 0 } = req.query;
        let offset, endIndex, results = {}, queryObject = res.queryObject || {};

        if (res.Model) {
            Model = res.Model;
        }
        if (page && limit) {
            page = parseInt(page);
            limit = parseInt(limit);

            offset = (page - 1) * limit;
            endIndex = page * limit;

            queryObject.limit = limit;
            queryObject.offset = offset;
        }

        if (res.findOne) {
            results.data = await Model.findOne(queryObject);
        }
        else {
            results.data = await Model.findAll(queryObject);

            results.count = await Model.count(queryObject);

            if (results.count.length >= 0) {
                results.recordsTotal = results.data.length
                results.recordsFiltered = results.count.length
            }
            else {
                results.recordsTotal = results.data.length;
                results.recordsFiltered = results.count;
            }

            if (endIndex < results.recordsTotal) {
                results.next = {
                    page: page + 1,
                    limit
                }
            }

            if (offset > 0) {
                results.previous = {
                    page: page - 1,
                    limit
                }
            }
        }

        res.json(results);
    }
}