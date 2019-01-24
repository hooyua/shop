<template>
    <div class="profile_page">
        <head-top go-back='true' head-title="店舗の管理"></head-top>
        <section>
            <section class="profile-number">
            </section>
            <section class="profile-1reTe">
                <section @click="linkshopAdd" class="myorder">
                    <aside>
                        <img :src='GLOBAL.defaults.shopmanage' class="icon_style">
                    </aside>
                    <div class="myorder-div">
                        <span>新規店舗お申し込み</span>
                        <span class="myorder-divsvg-1">{{state}}</span>
                        <span class="myorder-divsvg">
                            <svg fill="#bbb">
                                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                            </svg>
                        </span>
                    </div>
                </section>
            </section>
            <section class="profile-1reTe">
                <section @click="linkshopUpdate" class="myorder">
                    <aside>
                        <img :src='GLOBAL.defaults.update' class="icon_style">
                    </aside>
                    <div class="myorder-div">
                        <span>店舗の情報を変更</span>
                        <span class="myorder-divsvg">
                            <svg fill="#bbb">
                                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                            </svg>
                        </span>
                    </div>
                </section>
            </section>
            <section class="profile-1reTe">
                <section @click="linktableManage" class="myorder">
                    <aside>
                        <img :src='GLOBAL.defaults.tablemanage' class="icon_style">
                    </aside>
                    <div class="myorder-div">
                        <span>テーブルの管理</span>
                        <span class="myorder-divsvg">
                            <svg fill="#bbb">
                                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                            </svg>
                        </span>
                    </div>
                </section>
            </section>
            <section class="profile-1reTe">
                <section @click="linkprinterManage" class="myorder">
                    <aside>
                        <img :src='GLOBAL.defaults.printer' class="icon_style">
                    </aside>
                    <div class="myorder-div">
                        <span>プリンターの管理</span>
                        <span class="myorder-divsvg">
                            <svg fill="#bbb">
                                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                            </svg>
                        </span>
                    </div>
                </section>
            </section>
            <section class="profile-1reTe">
                <section @click="linkshopClose" class="myorder">
                    <aside>
                        <img :src='GLOBAL.defaults.closeshop' class="icon_style">
                    </aside>
                    <div class="myorder-div">
                        <span>閉店・休業</span>
                        <span class="myorder-divsvg">
                            <svg fill="#bbb">
                                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                            </svg>
                        </span>
                    </div>
                </section>
            </section>
        </section>
        <section class="profile-1reTe">
            <section @click="linkshopOpen" class="myorder">
                <aside>
                    <img :src='GLOBAL.defaults.business' class="icon_style">
                </aside>
                <div class="myorder-div">
                    <span>営業</span>
                    <span class="myorder-divsvg">
                        <svg fill="#bbb">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                        </svg>
                    </span>
                </div>
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
import {getStore} from 'src/config/mUtils'
import {shopDetails, getOpenShop} from 'src/service/getData'
import alertTip from '../../components/common/alertTip'
import loading from 'src/components/common/loading'

export default {
    data(){
        return{
            user_id: null,
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
    },

    methods:{
        ...mapMutations([
            'SAVE_AVANDER'
        ]),
        async initData(){
            this.user_id = getStore('user_id')
            this.shopOpenList = await getOpenShop(this.user_id);
            if(this.shopOpenList.length > 0){
                this.restaurant_id = getStore('shopid');
                this.shopDetailData = await shopDetails(this.restaurant_id);
                if(this.shopDetailData.switchs == '已停用') {
                    this.state = '止める'
                }else{
                    if(this.shopDetailData.state == '认证中') {
                        this.state = '認証中'
                    }else if(this.shopDetailData.state == '已认证') {
                        this.state = '認証済み'
                    }else if(this.shopDetailData.state == '已关闭') {
                        this.state = '閉鎖'
                    }
                }
            } else {
                this.state = '未認証';
            }
            this.hideLoading();
        },
        linkCheck(path){
            if(this.state == null){
                return
            }
            if(this.state == '止める' | this.state == '認証中' | this.state == '未認証'){
                this.showAlert = true;
                this.alertText = '店舗' + this.state;
            }else{
                this.$router.push({path: path});
            }
        },
        linkCheckExt(state, path){
            if(this.state == null){
                return
            }
            if(this.state == state){
                this.$router.push({path: path});
            }else{
                this.showAlert = true;
                this.alertText = '店舗' + this.state;
            }
        },
        linkshopAdd(){
            this.linkCheckExt('未認証', '/shopAdd')
        },
        linkshopUpdate(){
            this.linkCheck('/shopUpdate')
        },
        linktableManage(){
            this.linkCheck('/tableManage')
        },
        linkprinterManage(){
            this.linkCheck('/printerManage')
        },
        linkshopClose(){
            this.linkCheckExt('認証済み', '/shopClose')
        },
        linkshopOpen(){
            this.linkCheckExt('閉鎖', '/shopOpen')
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
        padding-top:1.95rem;
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
                    margin-left:-4rem;
                    @include wh(.46667rem,.466667rem);
                    svg{
                        @include wh(100%,100%);
                    }
                }
                .myorder-divsvg-1{
                    color:Lime;
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
