
import prismaDb from "@/lib/prismadb";
import { OrderClient } from "./components/client";
import { OrderColumn } from "./components/columns";

import { format } from 'date-fns';
import { formatter } from "@/lib/utils";

interface OrdersPageProps {
    params: { storeId: string }
}

const OrdersPage: React.FC<OrdersPageProps> = async ({ params }) => {

    const orders = await prismaDb.order.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            orderItems: {
                include: {
                    product: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedOrders: Array<OrderColumn> = orders.map((item) => ({
        id: item.phone,
        phone: item.phone,
        isPaid: item.isPaid,
        address: item.address,
        products: item.orderItems.map((orderItem) => orderItem.product.name).join(', '),
        totalPrice: formatter.format(item.orderItems.reduce((total, item) => {
            return total + Number(item.product.price);
        }, 0)),
        createdAt: format(item.createdAt, 'MMMM do, yyyy')
    }));

    return (
        <div className="flex flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                < OrderClient orders={formattedOrders} />
            </div>
        </div>
    )
}

export default OrdersPage;