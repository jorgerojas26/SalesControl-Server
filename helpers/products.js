module.exports = {
    roundUpProductPrice(price) {
        var val = 0;
        if (price.toString().length == 4) {
            val = Math.ceil(price / 100) * 100;
        } else if (price.toString().length > 4) {
            val = Math.ceil(price / 1000) * 1000;
        }

        return val;
    },
};
