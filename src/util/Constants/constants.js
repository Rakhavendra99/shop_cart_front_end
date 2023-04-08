let API_BASE_URL = "http://localhost:5000"

if (window.location.hostname === "localhost") {
    API_BASE_URL = "http://localhost:5000"
} else if (window.location.hostname === "dev") {
    API_BASE_URL = "https://api.shopcart.com"
} else {
    API_BASE_URL = ""
}
module.exports = {
    //Api Base url
    API_BASE_URL: API_BASE_URL,
    
    //category
    CATEGORY_LIST: '/category',
    ADD_CATEGORY: '/category',
    CATEGORY_DETAILS: '/category',
    UPDATE_CATEGORY: '/category',
    DELETE_CATEGORY: '/category',

}