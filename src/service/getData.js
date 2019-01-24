import fetch from '../config/fetch'

/**
 * 打印
 */

export const printingQR = (url, id, restaurant_id) => fetch('/v2/printing', {
	url:url,
	id:id,
	restaurant_id:restaurant_id
}, 'POST');

/**
 * 更新桌子数量
 */

export const updateshoptablenum = (id, tablecount) => fetch('/shopping/updateshoptablenum', {
	id:id,
	table_num:tablecount,
}, 'POST');

/**
 * 关闭商铺
 */

export const closeshop = (id, state) => fetch('/shopping/closeshop', {
	id:id,
	state:state,
}, 'POST');

/**
 * 更新商铺信息
 */

export const updateshop = (id, name, address, image_path) => fetch('/shopping/updateshop', {
	id:id,
	name:name,
	address:address,
	image_path:image_path,
}, 'POST');

/**
 * 更新主页照片
 */

export const updateHomeImage = (id, imgArray) => fetch('/shopping/updatehomeimage', {
	id:id,
	home_image:imgArray,
}, 'POST');

/**
 * 添加商铺
 */

export const addshop = (name, address, user_id, phone, image_path, license) => fetch('/shopping/addshop', {
	name:name,
	address:address,
	user_id:user_id,
	phone:phone,
	image_path:image_path,
	license:license,
}, 'POST');

/**
 * 更新种类
 */

export const updateCategory = (name, id) => fetch('/shopping/v2/updateCategory', {
	name:name,
	id:id,
}, 'POST');

/**
* 删除种类
*/

export const deleteCategory = (id) => fetch( '/shopping/v2/menu/' + id, {}, 'DELETE')

/**
* 删除多个种类
*/

export const deleteCategorys = (data) => fetch( '/shopping/v2/menus/', data, 'POST')

/**
* 批量删除菜品
*/

export const deleteFoods = (data) => fetch( '/shopping/v2/delfoods/', data, 'POST')

/**
 * 获取menu详情
 */

export const getMenuDetail = (id) => fetch('/shopping/v2/menu/' + id,{
	time: new Date().getTime()
});

/**
 * 获取food列表
 */

export const foodList = restaurant_id => fetch('/shopping/v2/foods', {
	restaurant_id,
	time: new Date().getTime()
});

/**
 * 获取default food列表
 */

export const defaultFoodList = (type, category) => fetch('/shopping/v2/defaultFood', {
	type,
	category,
	time: new Date().getTime()
});

/**
 * 获取default food列表
 */

export const defaultTypeList = (type) => fetch('/shopping/v2/defaultType', {
	type,
	time: new Date().getTime()
});

/**
 * 获取msite商铺列表
 */

export const shopList = (latitude, longitude, offset, restaurant_category_id = '', restaurant_category_ids = '', order_by = '', delivery_mode = '', support_ids = []) => {
	let supportStr = '';
	support_ids.forEach(item => {
		if (item.status) {
			supportStr += '&support_ids[]=' + item.id;
		}
	});
	let data = {
		latitude,
		longitude,
		offset,
		limit: '20',
		//'extras[]': 'activities',
		keyword: '',
		restaurant_category_id,
		'restaurant_category_ids[]': restaurant_category_ids,
		order_by,
		//'delivery_mode[]': delivery_mode + supportStr
	};
	return fetch('/shopping/restaurants', data);
};


/**
 * 获取shop页面商铺详情
 */

export const shopDetails = (restaurant_id) => fetch('/shopping/restaurant/' + restaurant_id, {
	time: new Date().getTime()
});


/**
 * 获取商铺Key值
 */

export const shopKey = (restaurant_id) => fetch('/shopping/shopkey/' + restaurant_id, {
	time: new Date().getTime()
});


/**
 * 获取商铺桌号列表
 */

export const shopTableList = (restaurant_id, table_num) => fetch('/shopping/shoptablelist/' + restaurant_id + '/' + table_num, {
	time: new Date().getTime()
});


/**
 * 获取shop页面菜单列表
 */

export const foodMenu = restaurant_id => fetch('/shopping/v2/menu', {
	restaurant_id,
	time: new Date().getTime()
});


/**
 * 获取图片验证码
 */

export const getcaptchas = () => fetch('/v1/captchas', {},'POST');


/**
 * 获取订单列表
 */

export const getOrderList = (restaurant_id, tmp_datetime, offset, limit, order_id) => fetch('/bos/orders', {
	restaurant_id,
	tmp_datetime,
	offset,
	limit,
	order_id,
	time: new Date().getTime()
});

/**
 * 获取今日订单列表
 */

export const gettodayOrderList = (restaurant_id, tmp_datetime, offset, limit, order_id) => fetch('/bos/orders/getTodayOrders', {
	restaurant_id,
	tmp_datetime,
	offset,
	limit,
	order_id,
	time: new Date().getTime()
});

/**
 * 获取昨日订单列表
 */

export const getyesterdayOrderList = (restaurant_id, tmp_datetime, offset, limit, order_id) => fetch('/bos/orders/getYesterdayOrders', {
	restaurant_id,
	tmp_datetime,
	offset,
	limit,
	order_id,
	time: new Date().getTime()
});

/**
 * 获取指定桌号的今日昨日订单列表
 */

export const getTodayAndYesterdayOrderListByTableId = (restaurant_id, table_id_list, tmp_datetime, offset, limit) => fetch('/bos/orders/getTodayAndYesterdayOrderListByTableId', {
	restaurant_id,
	table_id_list,
	tmp_datetime,
	offset,
	limit,
	time: new Date().getTime()
});

/**
 * 获取区间内订单列表
 */

export const getSectionOrders = (restaurant_id, start_datetime, end_datetime, offset, limit) => fetch('/bos/orders/getSectionOrders', {
	restaurant_id,
	start_datetime,
	end_datetime,
	offset,
	limit,
	time: new Date().getTime()
});


/**
 * 获取订单详情
 */

export const getOrderDetail = (user_id, orderid) => fetch('/bos/v1/users/' + user_id + '/orders/' + orderid + '/snapshot',{
	time: new Date().getTime()
});


/**
 * 账号密码登录
 */
export const accountLogin = (username, password) => fetch('/v2/login', {username, password}, 'POST');


/**
 * 退出登录
 */
export const signout = () => fetch('/v2/signout');


/**
 * 改密码
 */
export const changePassword = (username, oldpassWord, newpassword, confirmpassword) => fetch('/v2/changepassword', {username, oldpassWord, newpassword, confirmpassword}, 'POST');


/**
 * 获取menu列表
 */

export const getMenu = data => fetch('/shopping/v2/menu', data);

/**
 * 添加食品种类
 */

export const addFoodTest = data => fetch('/shopping/addfood', data, 'POST');
export const addFoods = data => fetch('/shopping/addfoods', data, 'POST');
export const addCategory = data => fetch('/shopping/addcategory', data, 'POST');
export const addCategorys = data => fetch('/shopping/addcategorys', data, 'POST');
export const register = (username, newpassword, confirmpassword, captcha_code) => fetch('/v2/register', {username, newpassword, confirmpassword, captcha_code}, 'POST');
export const forget = (username) => fetch('/v2/forget', {username}, 'POST');
export const resend = (username) => fetch('/v2/resend', {username}, 'POST');
export const getOpenShop = (user_id) => fetch('/shopping/restaurants/' + user_id,{time: new Date().getTime()});
export const addAgreement = data => fetch('/v3/agreement', data, 'POST');
export const getAgreement = (offset, limit) => fetch('/v3/agreement/getAgreement', {
	offset,
	limit,
	time: new Date().getTime()
});
export const addFAQ = data => fetch('/v3/faq', data, 'POST');
export const getFAQ = (offset, limit) => fetch('/v3/faq/getFAQ', {
	offset,
	limit,
	time: new Date().getTime()
});
export const addImprove = data => fetch('/v3/improve', data, 'POST');
export const getImprove = (user_id, offset, limit) => fetch('/v3/improve/getImprove', {
	user_id,
	offset,
	limit,
	time: new Date().getTime()
});

export const updateUserName = data => fetch('/eus/users/' + data.user_id + '/name', data, 'POST');

/**
* 批量删除菜品
*/

export const putonFoods = (data) => fetch( '/shopping/v2/putonFoods/', data, 'POST')

/**
* 批量推荐菜品
*/

export const recommendFood = (data) => fetch( '/shopping/v2/recommendFood/', data, 'POST')

/**
* 批量删除菜品
*/

export const updateDiscount = (data) => fetch( '/shopping/v2/updateDiscount/', data, 'POST')

/**
 * 修改订单
 */

export const modifyOrder = data => fetch('/v1/modifyorder/', data, 'POST');

/**
 * 合并订单
 */

export const mergeOrder = data => fetch('/v1/mergeOrder/', data, 'POST');

/**
 * 打印机信息操作
 */

export const editPrinter = data => fetch('/v2/printer/editPrinter', data, 'POST');

/**
 * 通过商户ID获取打印机信息
 */

export const getPrinterByRestaurantId = (restaurant_id) => fetch('/v3/printer/getPrinterByRestaurantId/' + restaurant_id, {time: new Date().getTime()});

/**
 * 添加打印机信息
 */

export const addPrinter = data => fetch('/v3/printer', data, 'POST');

/**
 * 删除打印机信息
 */

export const deletePrinter = (print_id) => fetch('/v3/deletePrinter/' + print_id, {}, 'DELETE');


/**
 * 修改打印机信息
 */

export const modifyPrinter = (data, print_id) => fetch('/v3/modifyPrinter/' + print_id, data, 'POST');

/**
 * 获取打印机模版列表
 */

export const getPrinterTemplateList = () => fetch('/v3/printer/getPrinterTemplateList', {time: new Date().getTime()});


/**
 * 获取选中打印机模版
 */

export const getPrinterTemplateByRestaurantId = template_id => fetch('/v3/printer/getPrinterTemplateByRestaurantId/' + template_id, {time: new Date().getTime()});

/**
 * 设置打印机信息
 */

export const setPrinterAuto = (data, print_id) => fetch('/v3/setPrinterAuto/' + print_id, data, 'POST');

export const testPrinter = machine_code => fetch('/v1/testPrinter/' + machine_code, {time: new Date().getTime()});

/**
 * 更新打印机
 */

export const updateshopprinterid = (id, printer_id) => fetch('/shopping/updateshopprinterid', {
	id:id,
	printer_id:printer_id,
}, 'POST');
