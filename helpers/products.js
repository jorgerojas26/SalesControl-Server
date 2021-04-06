module.exports = {
    roundUpProductPrice(price) {
        var val = 0;
        if (price < 10000) {
            val = Math.ceil(price / 100) * 100;
        }
        else {
            val = Math.ceil(price / 1000) * 1000;
        }
        return val;
    }
};
