import { createWebHistory, createRouter } from "vue-router";
import Home from '@/components/ComHome.vue';
import ThucDon from '@/components/ComThucDon.vue';
import GioiThieu from '@/components/ComGioiTh.vue';
import productDetail from '@/components/ComProductDetail.vue';
import Cart from '@/components/ComCart.vue';
import ThanhToan from '@/components/ComThanhToan.vue';
import Login from '@/components/ComLogin.vue';
import Register from '@/components/ComRegister.vue';
import Profile from '@/components/ComProfile.vue';
import OrderHistory from '@/components/ComOrderHistory.vue';

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home
    },
    {
        path: "/thucdon",
        name: "ThucDon",
        component: ThucDon
    },
    {
        path: "/gioithieu",
        name: "GioiThieu",
        component: GioiThieu
    },
    {
        path: "/product/:id",
        name: "ProductDetail",
        component: productDetail
    },
    {
        path: "/cart",
        name: "Cart",
        component: Cart
    },
    {
        path: "/thanhtoan",
        name: "ThanhToan",
        component: ThanhToan
    },
    {
        path: "/login",
        name: "Login",
        component: Login
    },
    {
        path: "/register",
        name: "Register",
        component: Register
    },
    {
        path: '/profile',
        name: 'Profile',
        component: Profile
    },
    {
        path: '/orders',
        name: 'Orders',
        component: OrderHistory
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
