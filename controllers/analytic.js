const Order = require('../models/Order');
const errorHandler = require('../utils/errorHandler');
const moment = require('moment');

module.exports.overview = async (req, res) => {
    try {

        const allOrders = await Order.find({user: req.user.id}).sort({date: 1});
        const ordersMap = getOrdersMap(allOrders);
        const yesterdayOrders = ordersMap[moment().add(-1, 'd').format('DD.MM.YYYY')] || [];
        const yesterdayOrdersNumber = yesterdayOrders.length;

        // Quantity of orders
        const totalOrdersNumber = allOrders.length;

        // Quantity of days
        const daysNumber = Object.keys(ordersMap).length;

        //Orders in day
        const ordersPerDay = (totalOrdersNumber / daysNumber).toFixed(0);

        //Percent for orders quantity
        //((yesterday orders / quantity in day) - 1) * 100
        const ordersPercent = (((yesterdayOrdersNumber / ordersPerDay) - 1) * 100).toFixed(2);

        //Total revenue
        const totalRevenue = calculatePrice(allOrders);

        //Day revenue
        const dayRevenue = totalRevenue / daysNumber;

        //Yesterday revenue
        const yesterdayRevenue = calculatePrice(yesterdayOrders);

        //Percent revenue
        const percentRevenue = (((yesterdayRevenue / dayRevenue) - 1) * 100).toFixed(2);

        //Equal revenues
        const compareRevenue = (yesterdayRevenue - dayRevenue).toFixed(2);

        //Equal quantity of orders
        const compareNumber = (yesterdayOrdersNumber - ordersPerDay).toFixed(2);

        res.status(200).json({
            revenue: {
                percent: Math.abs(+percentRevenue),
                compare: Math.abs(+compareRevenue),
                yesterday: +yesterdayRevenue,
                isHigher: +percentRevenue > 0,
            },
            orders: {
                percent: Math.abs(+ordersPercent),
                compare: Math.abs(+compareNumber),
                yesterday: +yesterdayOrdersNumber,
                isHigher: +ordersPercent > 0,
            },
        })
    } catch (e) {
        errorHandler(res, e);
    }
};

module.exports.analytics = (req, res) => {

};

function getOrdersMap(orders = []) {

    const daysOrder = {};

    orders.forEach(order => {
        const date = moment(order.date).format('DD.MM.YYYY');

        if (date === moment().format('DD.MM.YYYY')) {
            return;
        }
        if (!daysOrder[date]) {
            daysOrder[date] = []
        }
        daysOrder[date].push(order);
    });
    return daysOrder;
}

function calculatePrice(orders = []) {
    return orders.reduce((total, order) => {
        const orderPrice = order.list.reduce((orderTotal, item) => {
            return orderTotal += item.cost * item.quantity;
        }, 0);
        return total += orderPrice;
    }, 0)
}