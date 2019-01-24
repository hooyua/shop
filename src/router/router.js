import App from '../App'

const shop = r => require.ensure([], () => r(require('../page/shop/shop')), 'shop')
const login = r => require.ensure([], () => r(require('../page/login/login')), 'login')
const profile = r => require.ensure([], () => r(require('../page/profile/profile')), 'profile')
const menuManage = r => require.ensure([], () => r(require('../page/menuManage/menuManage')), 'menuManage')
const tableManage = r => require.ensure([], () => r(require('../page/tableManage/tableManage')), 'tableManage')
const tablecount = r => require.ensure([], () => r(require('../page/tableManage/children/tablecount')), 'tablecount')
const tableQR = r => require.ensure([], () => r(require('../page/tableManage/children/tableQR')), 'tableQR')
const QRPrinter = r => require.ensure([], () => r(require('../page/tableManage/children/QRPrinter')), 'QRPrinter')
const printerManage = r => require.ensure([], () => r(require('../page/printerManage/printerManage')), 'printerManage')
const addPrinter = r => require.ensure([], () => r(require('../page/printerManage/children/addPrinter')), 'addPrinter')
const moneyManage = r => require.ensure([], () => r(require('../page/moneyManage/moneyManage')), 'moneyManage')
const moneyToday = r => require.ensure([], () => r(require('../page/moneyManage/children/moneyToday')), 'moneyToday')
const moneyWeek = r => require.ensure([], () => r(require('../page/moneyManage/children/moneyWeek')), 'moneyWeek')
const moneyMonth = r => require.ensure([], () => r(require('../page/moneyManage/children/moneyMonth')), 'moneyMonth')
const moneyPeriod = r => require.ensure([], () => r(require('../page/moneyManage/children/moneyPeriod')), 'moneyPeriod')
const menuModify = r => require.ensure([], () => r(require('../page/menuModify/menuModify')), 'menuModify')
const shopManage = r => require.ensure([], () => r(require('../page/shopManage/shopManage')), 'shopManage')
const shopAdd = r => require.ensure([], () => r(require('../page/shopManage/children/shopAdd')), 'shopAdd')
const shopUpdate = r => require.ensure([], () => r(require('../page/shopManage/children/shopUpdate')), 'shopUpdate')
const homeImageUpdate = r => require.ensure([], () => r(require('../page/shopManage/children/homeImageUpdate')), 'homeImageUpdate')
const shopClose = r => require.ensure([], () => r(require('../page/shopManage/children/shopClose')), 'shopClose')
const shopOpen = r => require.ensure([], () => r(require('../page/shopManage/children/shopOpen')), 'shopOpen')
const general = r => require.ensure([], () => r(require('../page/general/general')), 'general')
const about = r => require.ensure([], () => r(require('../page/general/about')), 'about')
const FAQ = r => require.ensure([], () => r(require('../page/general/FAQ')), 'FAQ')
const agreement = r => require.ensure([], () => r(require('../page/general/agreement')), 'agreement')
const improveManage = r => require.ensure([], () => r(require('../page/general/improveManage')), 'improveManage')
const improve = r => require.ensure([], () => r(require('../page/general/improve')), 'improve')
const improveList = r => require.ensure([], () => r(require('../page/general/improveList')), 'improveList')
const improveDetail = r => require.ensure([], () => r(require('../page/general/improveDetail')), 'improveDetail')
const consult = r => require.ensure([], () => r(require('../page/general/consult')), 'consult')
const forget = r => require.ensure([], () => r(require('../page/forget/forget')), 'forget')
const reset = r => require.ensure([], () => r(require('../page/reset/reset')), 'reset')
const register = r => require.ensure([], () => r(require('../page/register/register')), 'register')
const resend = r => require.ensure([], () => r(require('../page/resend/resend')), 'resend')
const order = r => require.ensure([], () => r(require('../page/order/order')), 'order')
const today = r => require.ensure([], () => r(require('../page/order/today')), 'today')
const yesterday = r => require.ensure([], () => r(require('../page/order/yesterday')), 'yesterday')
const orderMain = r => require.ensure([], () => r(require('../page/order/orderMain')), 'orderMain')
const orderTable = r => require.ensure([], () => r(require('../page/order/orderTable')), 'orderTable')
const orderMerge = r => require.ensure([], () => r(require('../page/order/orderMerge')), 'orderMerge')
const orderDetail = r => require.ensure([], () => r(require('../page/order/children/orderDetail')), 'orderDetail')
const foodDetail = r => require.ensure([], () => r(require('../page/menuModify/foodDetail')), 'foodDetail')
const foodDetailWatch = r => require.ensure([], () => r(require('../page/shop/children/foodDetailWatch')), 'foodDetailWatch')
const foodAdd = r => require.ensure([], () => r(require('../page/menuModify/foodAdd')), 'foodAdd')
const foodShortCutAdd = r => require.ensure([], () => r(require('../page/menuModify/foodShortCutAdd')), 'foodShortCutAdd')
const lotOperation = r => require.ensure([], () => r(require('../page/menuModify/lotOperation')), 'lotOperation')
const foodTypeShortCutAdd = r => require.ensure([], () => r(require('../page/menuModify/foodTypeShortCutAdd')), 'foodTypeShortCutAdd')
const foodAddByType = r => require.ensure([], () => r(require('../page/menuModify/foodAddByType')), 'foodAddByType')
const foodDefaultAdd = r => require.ensure([], () => r(require('../page/menuModify/foodDefaultAdd')), 'foodDefaultAdd')
const foodTypeDefaultAdd = r => require.ensure([], () => r(require('../page/menuModify/foodTypeDefaultAdd')), 'foodTypeDefaultAdd')
const japaneseFoodAdd = r => require.ensure([], () => r(require('../page/menuModify/japaneseFoodAdd')), 'japaneseFoodAdd')
const japaneseFoodTypeAdd = r => require.ensure([], () => r(require('../page/menuModify/japaneseFoodTypeAdd')), 'japaneseFoodTypeAdd')
const obentou = r => require.ensure([], () => r(require('../page/menuModify/japanese/obentou')), 'obentou')
const osusi = r => require.ensure([], () => r(require('../page/menuModify/japanese/osusi')), 'osusi')
const oden = r => require.ensure([], () => r(require('../page/menuModify/japanese/oden')), 'oden')
const westernFoodAdd = r => require.ensure([], () => r(require('../page/menuModify/westernFoodAdd')), 'westernFoodAdd')
const westernFoodTypeAdd = r => require.ensure([], () => r(require('../page/menuModify/westernFoodTypeAdd')), 'westernFoodTypeAdd')
const pasuta = r => require.ensure([], () => r(require('../page/menuModify/western/pasuta')), 'pasuta')
const chineseFoodAdd = r => require.ensure([], () => r(require('../page/menuModify/chineseFoodAdd')), 'chineseFoodAdd')
const chineseFoodTypeAdd = r => require.ensure([], () => r(require('../page/menuModify/chineseFoodTypeAdd')), 'chineseFoodTypeAdd')
const okayu = r => require.ensure([], () => r(require('../page/menuModify/chinese/okayu')), 'okayu')
const foodTypeAdd = r => require.ensure([], () => r(require('../page/menuModify/foodTypeAdd')), 'foodTypeAdd')
const foodDefaultTypeAdd = r => require.ensure([], () => r(require('../page/menuModify/foodDefaultTypeAdd')), 'foodDefaultTypeAdd')
const foodTypeDel = r => require.ensure([], () => r(require('../page/menuModify/foodTypeDel')), 'foodTypeDel')
const foodTypeDelList = r => require.ensure([], () => r(require('../page/menuModify/foodTypeDelList')), 'foodTypeDelList')
const foodTypeDelete = r => require.ensure([], () => r(require('../page/menuModify/foodTypeDelete')), 'foodTypeDelete')
const foodTypeModify = r => require.ensure([], () => r(require('../page/menuModify/foodTypeModify')), 'foodTypeModify')
const foodListByType = r => require.ensure([], () => r(require('../page/menuModify/foodListByType')), 'foodListByType')
const foodPuton = r => require.ensure([], () => r(require('../page/menuModify/foodPuton')), 'foodPuton')
const foodPutoff = r => require.ensure([], () => r(require('../page/menuModify/foodPutoff')), 'foodPutoff')
const foodDelete = r => require.ensure([], () => r(require('../page/menuModify/foodDelete')), 'foodDelete')
const foodRecommend = r => require.ensure([], () => r(require('../page/menuModify/foodRecommend')), 'foodRecommend')
const foodNoRecommend = r => require.ensure([], () => r(require('../page/menuModify/foodNoRecommend')), 'foodNoRecommend')
const foodListByDiscount = r => require.ensure([], () => r(require('../page/menuModify/foodListByDiscount')), 'foodListByDiscount')
const info = r => require.ensure([], () => r(require('../page/profile/children/info')), 'info')
const setusername = r => require.ensure([], () => r(require('../page/profile/children/children/setusername')), 'setusername')
const error = r => require.ensure([], () => r(require('../page/error/error')), 'error')

export default [{
    path: '/',
    component: App, //顶层路由，对应index.html
    children: [ //二级路由。对应App.vue
        //地址为空时跳转home页面
        {
            path: '',
            redirect: '/login'
        },
        //商铺详情页
        {
            path: '/shop',
            component: shop,
            children: [{
                path: 'foodDetailWatch', //食品详情页
                component: foodDetailWatch,
            }]
        },
        //商铺详情页
        {
            path: '/menuModify',
            component: menuModify,
        },
        //搜索页
        {
            path: '/foodDetail',
            component: foodDetail
        },
        //搜索页
        {
            path: '/foodAdd',
            component: foodAdd
        },
        //菜品添加页
        {
            path: '/foodShortCutAdd',
            component: foodShortCutAdd
        },
        //菜品添加页
        {
            path: '/lotOperation',
            component: lotOperation
        },
        //菜品添加页
        {
            path: '/foodTypeShortCutAdd',
            component: foodTypeShortCutAdd
        },
        //菜品添加页
        {
            path: '/foodAddByType',
            component: foodAddByType
        },
        //搜索页
        {
            path: '/foodDefaultAdd',
            component: foodDefaultAdd
        },
        //搜索页
        {
            path: '/foodTypeDefaultAdd',
            component: foodTypeDefaultAdd
        },
        //和食
        {
            path: '/japaneseFoodAdd',
            component: japaneseFoodAdd
        },
        //和食・種類
        {
            path: '/japaneseFoodTypeAdd',
            component: japaneseFoodTypeAdd
        },
        //和食・お弁当
        {
            path: '/obentou',
            component: obentou
        },
        //和食・お寿司
        {
            path: '/osusi',
            component: osusi
        },
        //和食・おでん
        {
            path: '/oden',
            component: oden
        },
        //搜索页
        {
            path: '/westernFoodAdd',
            component: westernFoodAdd
        },
        //搜索页
        {
            path: '/westernFoodTypeAdd',
            component: westernFoodTypeAdd
        },
        //洋食・パスタ
        {
            path: '/pasuta',
            component: pasuta
        },
        //搜索页
        {
            path: '/chineseFoodAdd',
            component: chineseFoodAdd
        },
        //搜索页
        {
            path: '/chineseFoodTypeAdd',
            component: chineseFoodTypeAdd
        },
        //中華料理・お粥
        {
            path: '/okayu',
            component: okayu
        },
        //搜索页
        {
            path: '/foodTypeAdd',
            component: foodTypeAdd
        },
        //搜索页
        {
            path: '/foodDefaultTypeAdd',
            component: foodDefaultTypeAdd
        },
        //搜索页
        {
            path: '/foodTypeDel',
            component: foodTypeDel
        },
        //种类删除批量处理页
        {
            path: '/foodTypeDelList',
            component: foodTypeDelList
        },
        //搜索页
        {
            path: '/foodTypeDelete',
            component: foodTypeDelete
        },
        //搜索页
        {
            path: '/foodTypeModify',
            component: foodTypeModify
        },
        //删除，上架，下架批处理页面
        {
            path: '/foodListByType',
            component: foodListByType
        },
        //上架
        {
            path: '/foodPuton',
            component: foodPuton
        },
        //下架
        {
            path: '/foodPutoff',
            component: foodPutoff
        },
        //删除
        {
            path: '/foodDelete',
            component: foodDelete
        },
        //推荐批处理页面
        {
            path: '/foodRecommend',
            component: foodRecommend
        },
        //推荐批处理页面
        {
            path: '/foodNoRecommend',
            component: foodNoRecommend
        },
        //打折批处理页面
        {
            path: '/foodListByDiscount',
            component: foodListByDiscount
        },
        //登录注册页
        {
            path: '/login',
            component: login
        },
        //店铺管理页
        {
            path: '/shopManage',
            component: shopManage
        },
        //新建店铺
        {
            path: '/shopAdd',
            component: shopAdd
        },
        //更新店铺
        {
            path: '/shopUpdate',
            component: shopUpdate
        },
        //更新主页照片
        {
            path: '/homeImageUpdate',
            component: homeImageUpdate
        },
        //关闭店铺
        {
            path: '/shopClose',
            component: shopClose
        },
        //店铺营业
        {
            path: '/shopOpen',
            component: shopOpen
        },
        //菜单管理页
        {
            path: '/menuManage',
            component: menuManage
        },
        {
            path: '/QRPrinter',
            component: QRPrinter
        },
        //餐桌二维码列表页
        {
            path: '/tableQR',
            component: tableQR
        },
        //餐桌总数页
        {
            path: '/tablecount',
            component: tablecount
        },
        //餐桌管理页
        {
            path: '/tableManage',
            component: tableManage
        },
        //打印机管理页
        {
            path: '/printerManage',
            component: printerManage
        },
        //菜单管理页
        {
            path: '/moneyManage',
            component: moneyManage,
            children: [{
                path: 'moneyToday', //今日
                component: moneyToday,
            },{
                path: 'moneyWeek', //本周
                component: moneyWeek,
            },{
                path: 'moneyMonth', //本月
                component: moneyMonth,
            },{
                path: 'moneyPeriod', //期间
                component: moneyPeriod,
            },]
        },
        //通用页
        {
            path: '/general',
            component: general
        },
        //about
        {
            path: '/about',
            component: about
        },
        //FAQ
        {
            path: '/FAQ',
            component: FAQ
        },
        //agreement
        {
            path: '/agreement',
            component: agreement
        },
        //improveManage
        {
            path: '/improveManage',
            component: improveManage
        },
        //improve
        {
            path: '/improve',
            component: improve
        },
        //improveList
        {
            path: '/improveList',
            component: improveList
        },
        //improveDetail
        {
            path: '/improveDetail',
            component: improveDetail
        },
        //consult
        {
            path: '/consult',
            component: consult
        },
        //个人信息页
        {
            path: '/profile',
            component: profile,
            children: [{
                path: 'info', //个人信息详情页
                component: info,
                children: [{
                    path: 'setusername',
                    component: setusername,
                }]
            }]
        },
        //忘记密码页
        {
            path: '/forget',
            component: forget
        },
        //修改密码页
        {
            path: '/reset',
            component: reset
        },
        //注册页
        {
            path: '/register',
            component: register
        },
        //再次发送注册邮件
        {
            path: '/resend',
            component: resend
        },
        //注册页
        {
            path: '/orderDetail',
            component: orderDetail
        },
        //订单列表页
        {
            path: '/order',
            component: order
        },
        //今日订单列表页
        {
            path: '/today',
            component: today
        },
        //昨日订单列表页
        {
            path: '/yesterday',
            component: yesterday
        },
        //订单首页
        {
            path: '/orderMain',
            component: orderMain
        },
        //订单首页
        {
            path: '/orderTable',
            component: orderTable
        },
        //订单首页
        {
            path: '/orderMerge',
            component: orderMerge
        },
        //错误页
        {
            path: '/error',
            component: error
        },
        //添加打印机
        {
            path: '/addPrinter',
            component: addPrinter
        },
    ]
},//未定义地址跳转error页面
{
    path: '*',
    component: error
},]
