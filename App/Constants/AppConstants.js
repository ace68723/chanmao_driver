const productServer = 'https://www.cmapi.ca/cm_driver/';
const devServer = 'https://www.cmapi.ca/cm_driver/dev/';
const Server = productServer;
const testServer = 'http://127.0.0.1:7001/';
module.exports ={
    ADD_ITEM: 'ADD_ITEM',
    REMOVE_ITEM: 'REMOVE_ITEM',
    INCREASE_ITEM: 'INCREASE_ITEM',
    DECREASE_ITEM: 'DECREASE_ITEM',
    //chanmao login api,{username: , password: }
    API_LOGIN:'http://www.chanmao.ca/index.php?r=MobLogin/login',
    API_AUTH:'http://www.chanmao.ca/index.php?r=MobLogin/loginwc',
    API_HISTORY: Server + 'api/v1/history/',
    API_ORDERS: Server + 'api/v1/orders/',
    API_FINISHED_ORDERS: Server + 'api/v1/finished_orders/',
    API_DRIVER_STATUS: Server + 'api/v1/driver_status/',
    API_GEO_TRACE: Server + 'api/v1/geo_trace/',


    ERROR_PASSWORD:'ERROR_PASSWORD',
    ERROR_PASSWORD_MESSAGE:'密码不正确',
    ERROR_NETWORK:'ERROR_NETWORK',
    ERROR_NETWORK_MESSAGE:'请检查您的网络',
    ERROR_STORE:'请重新登录',
    ERROR_AUTH:'请重新登录',
    SUCCESS_LOGIN:'登录成功',
    //wecaht
    WECHAT_SCOPE: 'snsapi_userinfo',
    WECHAT_STATE: 'wechat_sdk_test',
    WECHAT_APPID: 'wx20fd1aeb9b6fcf82',
    //auth
    SUCCESS: 1,
    FAIL: 0,
    TOKEN: 'userToken',
    UID: 'sv_uid',
    LOGOUT:'LOGOUT',

    // auth
    DO_LOGIN:'DO_LOGIN',
    LOGIN_SUCCESS:'LOGIN_SUCCESS',
    LOGIN_FAIL:'LOGIN_FAIL',
    ERRROR_TITLE:'出错啦',

    // History
    GET_HISTORY_SUCCESS:'GET_HISTORY_SUCCESS',

    //Restaurant
    GET_RESTAURANT_SUCCESS: 'GET_RESTAURANT_SUCCESS',
    GET_MENU_SUCCESS: 'GET_MENU_SUCCESS',

    // address
    PREDICTIONS_SUCCESS:'PREDICTIONS_SUCCESS',
    GET_ADDRESSES:'GET_ADDRESSES',
    FORMAT_ADDRESS: 'FORMAT_ADDRESS',
    SUBMIT_ADDRESS: 'SUBMIT_ADDRESS',

    //alert
    ALERT_TITLE:'馋猫订餐',
    STARTED:'正在执行中',

    // order
    ADD_ITEM: 'ADD_ITEM',
    REMOVE_ITEM: 'REMOVE_ITEM',
    INCREASE_ITEM: 'INCREASE_ITEM',
    DECREASE_ITEM: 'DECREASE_ITEM',
    REORDER: 'REORDER',

    // Checkout
    BEFORE_CHECKOUT :'BEFORE_CHECKOUT',
    CALCULATE_DELIVERY_FEE : 'CALCULATE_DELIVERY_FEE',
    CHECKOUT: 'CHECKOUT',

    // The Six
    GET_ATICLE_LIST:'GET_ATICLE_LIST',
    GET_ARTICLE_AUTHOR:'GET_ARTICLE_AUTHOR',
    GET_BROADCAST_AUTHOR: 'GET_BROADCAST_AUTHOR',
    GET_ACTIVITY_AUTHOR: 'GET_ACTIVITY_AUTHOR',
    SUBMIT_APPLICATION:'SUBMIT_APPLICATION',
    SUBMIT_COMMENT:'SUBMIT_COMMENT',
    GET_COMMENT_AMOUNT:'GET_COMMENT_AMOUNT',
    GET_COMMENT_LIST:'GET_COMMENT_LIST',
    CHECK_UPDATE:'CHECK_UPDATE',


    //Home
    GET_HOME_DATA:'GET_HOME_DATA',

    CMVERSION:'v1.6.8',
}
