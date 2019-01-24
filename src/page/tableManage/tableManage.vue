<template>
    <div class="profile_page">
        <head-top go-back='true' head-title="テーブルの管理"></head-top>
        <section>
            <section class="profile-number">
            </section>
            <section class="profile-1reTe">
                <router-link to='/tablecount' class="myorder">
                    <aside>
                        <img :src='GLOBAL.defaults.tablemanage' class="icon_style">
                    </aside>
                    <div class="myorder-div">
                        <span>テーブル数の設定</span>
                        <span>{{shopDetailData.table_num}}</span>
                        <span class="myorder-divsvg">
                            <svg fill="#bbb">
                                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                            </svg>
                        </span>
                    </div>
                </router-link>
            </section>
            <section class="profile-1reTe">
                <router-link to='/tableQR' class="myorder">
                    <aside>
                        <img :src='GLOBAL.defaults.qrprinter' class="icon_style">
                    </aside>
                    <div class="myorder-div">
                        <span>QRコードの印刷</span>
                        <span class="myorder-divsvg">
                            <svg fill="#bbb">
                                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                            </svg>
                        </span>
                    </div>
                </router-link>
            </section>
            <section class="profile-1reTe">
                <router-link to='/QRPrinter' class="myorder">
                    <aside>
                        <img :src='GLOBAL.defaults.printer' class="icon_style">
                    </aside>
                    <div class="myorder-div">
                        <span>QRコード印刷プリンターの設定</span>
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
    </div>
</template>

<script>
import headTop from 'src/components/header/head'
import footGuide from 'src/components/footer/footGuide'
import {mapState, mapMutations} from 'vuex'
import {getStore} from 'src/config/mUtils'
import {shopDetails} from 'src/service/getData'
import loading from 'src/components/common/loading'

export default {
    data(){
        return{
            shopDetailData: {
                table_num: null
            },
            restaurant_id: null,
            user_id: null,
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
        loading,
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
            this.restaurant_id = getStore('shopid');
            this.shopDetailData = await shopDetails(this.restaurant_id);
            this.hideLoading();
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
                    margin-left:-6rem;
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
