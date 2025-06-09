import {
    IconCustomer,
    IconDashboard,
    IconManage,
    IconOrder,
    IconProduct,
    IconRole,
    IconUser,
    IconWallet,
} from '../components/icons'
import { HomePage } from '../pages'
import RoleManagement from '../pages/Role/role-management'
import InventoryManagement from '../pages/inventory/inventory-management'
import OrderManagement from '../pages/orders/order-management'
import { User } from 'lucide-react'
import UserManagement from '../pages/UserManegerment/user-management'
import TransactionManagement from '../pages/Transaction/transaction-management'
import ProductManagement from '../pages/products/product-management'
import CategoryManagement from '../pages/products/category-management'
export const ROUTES = {
    HomePage: '',
    SignUp: '/signup',
    Login: '/login',
    Inventory: 'inventory',
    Products: 'products',
    Orders: 'orders',
    Customers: 'customers',
    Transaction: 'transactions',
    Role: 'role',
    User: 'user',
    Category: 'categories',
}

const routerList = [
    {
        title: 'Dashboard',
        href: ROUTES.HomePage,
        component: HomePage,
        icon: IconDashboard,
    },
    {
        title: 'Inventory',
        href: ROUTES.Inventory,
        component: InventoryManagement,
        icon: IconManage,
    },
    {
        title: 'Products',
        href: ROUTES.Products,
        component: ProductManagement,
        icon: IconProduct,
    },
    {
        title: 'Orders',
        href: ROUTES.Orders,
        component: OrderManagement,
        icon: IconOrder,
    },

    {
        title: 'Transaction',
        href: ROUTES.Transaction,
        component: TransactionManagement,
        icon: IconWallet,
    },
    {
        title: 'Role',
        href: ROUTES.Role,
        component: RoleManagement,
        icon: IconRole,
    },
    {
        title: 'Users',
        href: ROUTES.User,
        component: UserManagement,
        icon: IconUser,
    },
    {
        title: 'Category',
        href: ROUTES.Category,
        component: CategoryManagement,
        icon: IconProduct,
    },
]

// export const defaultTitle = 'Default'

// export const routeTitleMapper = {
//     [ROUTES.HomePage]: 'HomePage',
//     [ROUTES.SignUp]: 'SignUp',
//     [ROUTES.Login]: 'Login',
// }

// export const getRouteTitle = (route) => {
//     return routeTitleMapper[route] ?? defaultTitle
// }

export default routerList
