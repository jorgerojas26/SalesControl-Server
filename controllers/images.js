module.exports = {
    create: function (req, res) {
        if (!req.file) {
            console.log('No file received');
            return res.send({
                success: false,
            });
        } else {
            console.log('file received');
            console.log(filePath);
            return res.send({
                success: true,
            });
        }
    },
};

