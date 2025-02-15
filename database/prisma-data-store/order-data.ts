import {PrismaClient} from '@prisma/client';
import {Order} from "../../models/Order";

const prisma = new PrismaClient();


// save order
export async function OrderAdd(order: Order) {
    try {
        const newOrder = await prisma.order.create({
            data: {
                customer_email: order.customer_email,
                order_date: order.order_date,
                wrapping_charges: order.wrapping_charges,
                decoration_charges: order.decoration_charges,
                sub_total: order.sub_total,
                discount: order.discount,
                total_amount: order.total_amount,
                paid_amount: order.paid_amount,
                balance: order.balance,
            },
        });

        let savedOrderDetails = await prisma.orderDetail.createMany({
            data: order.order_items.map((item) => ({
                order_id: newOrder.order_id,
                item: item.item,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                total: item.total,
            })),
        });

        console.log("Order Added : ", newOrder);
        return newOrder;
    } catch (error) {
        console.error("Error adding order : ", error);
        throw error;
    }
}


// get all orders
export async function getAllOrders() {
    try {
        const orders = await prisma.order.findMany();
        return await Promise.all(
            orders.map(async (order) => {
                const orderDetails = await prisma.orderDetail.findMany({
                    where: {order_id: order.order_id},
                });
                return {...order, order_items: orderDetails};
            })
        );
    } catch (err) {
        console.error("Error getting orders:", err);
        throw err;
    }
}
