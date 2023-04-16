let API_BASE_URL = "http://localhost:5000"
let BASE_URL_SOCKET_IO = "http://localhost:5006/"

if (window.location.hostname === "localhost") {
    API_BASE_URL = "http://localhost:5000";
    BASE_URL_SOCKET_IO = "http://localhost:5006/";
} else if (window.location.hostname === "dev") {
    API_BASE_URL = "https://api.shopcart.com";
    BASE_URL_SOCKET_IO = "https://socket.shopcart.com/";
} else {
    API_BASE_URL = ""
    BASE_URL_SOCKET_IO = ""
}
module.exports = {
    //Api Base url
    API_BASE_URL: API_BASE_URL,
    BASE_URL_SOCKET_IO: BASE_URL_SOCKET_IO,
    SOCKET_IO_PATH : "/socket/shop_cart",
    //category
    CATEGORY_LIST: '/category',
    ADD_CATEGORY: '/category',
    CATEGORY_DETAILS: '/category',
    UPDATE_CATEGORY: '/category',
    DELETE_CATEGORY: '/category',

    //product
    PRODUCT_CATEGORY_LIST:'/products/category',
    PRODUCT_LIST: '/products',
    ADD_PRODCUT : '/products',
    PRODUCT_DETAILS: '/products',
    UPDATE_PRODUCT: '/products',
    DELETE_PRODUCT: '/products',

    //Dashboard
    VENDOR_DASHBOARD: '/vendor/dashboard',
    ADMIN_DASHBOARD: '/admin/dashboard',
}