import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router/router'
import store from './store/'
import {routerMode} from './config/env'
import './config/rem'
import FastClick from 'fastclick'
import VueQriously from 'vue-qriously'
import VueLoading from 'vue-loading-template'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import imgrouter from 'src/router/img-router'

if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}

Vue.prototype.GLOBAL = imgrouter
Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(VueQriously)
Vue.use(VueLoading, /** options **/)
Vue.use(ElementUI)

const router = new VueRouter({
	routes,
	mode: routerMode,
	strict: process.env.NODE_ENV !== 'production',
	scrollBehavior (to, from, savedPosition) {
	    if (savedPosition) {
		    return savedPosition
		} else {
			if (from.meta.keepAlive) {
				from.meta.savedPosition = document.body.scrollTop;
			}
		    return { x: 0, y: to.meta.savedPosition || 0 }
		}
	}
})

new Vue({
	router,
	store,
}).$mount('#app')

