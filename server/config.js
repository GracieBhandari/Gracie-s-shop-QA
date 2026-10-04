// Business rules shared across the server. Kept in one place so they can't drift apart.

// A customer can have at most this many of one product in their cart (and never more than the stock)
const MAX_QUANTITY_PER_PRODUCT = 10;

module.exports = { MAX_QUANTITY_PER_PRODUCT };
