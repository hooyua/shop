<template>
    <div class="profile_page">
        <head-top :head-title="profiletitle"></head-top>
        <section>
            <section class="profile-number">
                <router-link :to="userInfo&&userInfo.user_id? '/profile/info' : '/login'" class="profile-link">
                    <img :src="imgBaseUrl + userInfo.avatar" class="privateImage" v-if="userInfo&&userInfo.user_id">
                    <span class="privateImage" v-else>
                        <svg class="privateImage-svg">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#avatar-default"></use>
                        </svg>
                    </span>
                    <div class="user-info">
                        <p>{{username}}</p>
                    </div>
                    <span class="arrow">
                        <svg class="arrow-svg" fill="#fff">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                        </svg>
                    </span>
                </router-link>
            </section>

            <section class="profile-1reTe">
                <section @click="linkshopManage" class="myorder">
                    <aside>
                        <img :src='GLOBAL.defaults.shopmanage' class="icon_style">
                    </aside>
                    <div class="myorder-div">
                        <span>店舗の管理</span>
                        <span class="myorder-divsvg">
                            <svg fill="#bbb">
                                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                            </svg>
                        </span>
                    </div>
                </section>
            </section>

            <section class="profile-1reTe">
                <router-link to='/general' class="myorder">
                    <aside>
                        <img :src='GLOBAL.defaults.general' class="icon_style">
                    </aside>
                    <div class="myorder-div">
                        <span>一般</span>
                        <span class="myorder-divsvg">
                            <svg fill="#bbb">
                                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                            </svg>
                        </span>
                    </div>
                </router-link>
            </section>
        </section>
        <foot-guide :homeStatus="false" :orderStatus="false" :moneyStatus="false" :profileStatus="true"></foot-guide>
        <transition name="loading">
            <loading v-show="showLoading"></loading>
        </transition>
        <transition name="router-slid" mode="out-in">
            <router-view></router-view>
        </transition>
        <alert-tip v-if="showAlert" :showHide="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
    </div>
</template>

<script>
import headTop from 'src/components/header/head'
import footGuide from 'src/components/footer/footGuide'
import {mapState, mapMutations} from 'vuex'
import {imgBaseUrl} from 'src/config/env'
import {getStore} from 'src/config/mUtils'
import {shopDetails, getOpenShop} from 'src/service/getData'
import alertTip from '../../components/common/alertTip'
import loading from 'src/components/common/loading'

export default {
    data(){
        return{
            profiletitle: '本人',
            username: '',           //用户名
            resetname: '',
            avatar: '',             //头像地址
            imgBaseUrl,
            restaurant_id: null, //商店id值
            shopDetailData: null, //商铺详情
            state: null, //商铺状态
            showAlert: false, 
            alertText: null,
            showLoading: true, //显示加载动画
        }
    },
    created(){
        this.user_id = getStore('user_id')
        if(this.user_id == null){
            this.$router.push({path: '/login'});
        }
        this.INIT_USERINFO();
    },
    mounted(){
        this.initData();
    },
    components:{
        headTop,
        footGuide,
        alertTip,
        loading
    },

    computed:{
        ...mapState([
            'userInfo',
        ]),
        //后台会返回两种头像地址格式，分别处理
        imgpath:function () {
            let path;
            if(this.avatar.indexOf('/') !==-1){
                path = imgBaseUrl +　this.avatar;
            }else{
                path = imgBaseUrl +　this.avatar;
            }
            this.SAVE_AVANDER(path);
            return path;
        }
    },

    methods:{
        ...mapMutations([
            'SAVE_AVANDER', 'INIT_USERINFO'
        ]),
        async initData(){
            this.shopOpenList = await getOpenShop(this.user_id);
            if(this.shopOpenList.length > 0){
                this.restaurant_id = getStore('shopid')
                this.shopDetailData = await shopDetails(this.restaurant_id);
                if(this.shopDetailData.switchs == '已停用'){
                    this.state = '止める';
                }else{
                    if(this.shopDetailData.state == '认证中'){
                        this.state = '認証中';
                    }else if(this.shopDetailData.state == '已认证'){
                        this.state = '認証済み';
                    }else if(this.shopDetailData.state == '已关闭'){
                        this.state = '閉鎖';
                    }  
                }
            }else{
                this.state = '未認証';
            }

            if (this.userInfo && this.userInfo.user_id) {
                this.avatar = this.userInfo.avatar;
                this.username = this.userInfo.username;
            }else{
                this.username = 'ログイン';
            }
            this.hideLoading();
        },
        linkshopManage(){
            if(this.state == null){
                return
            }
            if(this.state == '止める'){
                this.showAlert = true;
                this.alertText = '店舗' + this.state;
            }else{
                this.$router.push({path: '/shopManage'});
            }
        },
        //生产环境与发布环境隐藏loading方式不同
        hideLoading(){
            this.showLoading = false;
        },
    },
    watch: {
        userInfo: function (value){
            this.initData()
        }
    }
}

</script>

<style lang="scss" scoped>
   @import 'src/style/mixin';

    .profile_page{
        margin-bottom: 1.95rem;
        p, span{
            font-family: Helvetica Neue,Tahoma,Arial;
        }
    }
   .profile-number{
        padding-top:2.45rem;
        .profile-link{
            display:block;
            display:flex;
            box-align: center;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            background: #fff;
            padding: .666667rem .6rem;
            .privateImage{
                display:inline-block;
                @include wh(2.5rem,2.5rem);
                border-radius:50%;
                vertical-align:middle;
                .privateImage-svg{
                    background: #333;
                    border-radius:50%;
                    @include wh(2.5rem,2.5rem);
                }
            }
            .user-info{
                margin-left:.48rem;
                -webkit-box-flex: 1;
                -ms-flex-positive: 1;
                flex-grow: 1;
                p{
                    font-weight:700;
                    @include sc(.8rem,#333);
                }

            }
            .arrow{
                @include wh(.46667rem,.98rem);
                display:inline-block;
                svg{
                   @include wh(100%,100%);
                }
            }
        }
   }
   .profile-1reTe{
        margin-top:.4rem;
        background:$fc;
        .myorder{
            padding-left:1.6rem;
            display:flex;
            align-items: center;
            aside{
                @include wh(.7rem,.7rem);
                margin-left:-.866667rem;
                margin-right:.266667rem;
                display:flex;
                align-items: center;
            .icon_style{
                    float: left;
                    margin-left: -0.3rem;
                    width: 140%;
		}
            }
            .myorder-div{
                width:100%;
                border-bottom:1px solid #f1f1f1;
                padding:.433333rem .266667rem .433333rem 0;
                @include sc(.7rem,#333);
                display:flex;
                justify-content:space-between;
                span{
                    display:block;
                }
                .myorder-divsvg{
                    @include wh(.46667rem,.466667rem);
                    svg{
                        @include wh(100%,100%);
                    }
                }
            }
        }
        .myorder:nth-of-type(3) .myorder-div{
            border:0;
        }
    }
    .router-slid-enter-active, .router-slid-leave-active {
        transition: all .4s;
    }
    .router-slid-enter, .router-slid-leave-active {
        transform: translate3d(2rem, 0, 0);
        opacity: 0;
    }
</style>
