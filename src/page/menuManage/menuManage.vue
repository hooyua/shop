<template>
    <div class="profile_page">
        <head-top go-back='true' head-title="メニューの管理"></head-top>
        <section>
            <section class="profile-number">
            </section>
            <section class="profile-1reTe">
                <router-link to='/foodDefaultTypeAdd' class="myorder">
                    <aside>
                        <svg fill="#4aa5f0">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#order"></use>
                        </svg>
                    </aside>
                    <div class="myorder-div">
                        <span>デフォルト料理の種類を追加</span>
                        <span class="myorder-divsvg">
                            <svg fill="#bbb">
                                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                            </svg>
                        </span>
                    </div>
                </router-link>
            </section>
            <section class="profile-1reTe">
                <router-link to='/foodTypeAdd' class="myorder">
                    <aside>
                        <svg fill="#4aa5f0">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#order"></use>
                        </svg>
                    </aside>
                    <div class="myorder-div">
                        <span>カスタマイズ料理の種類を追加</span>
                        <span class="myorder-divsvg">
                            <svg fill="#bbb">
                                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                            </svg>
                        </span>
                    </div>
                </router-link>
            </section>
            <section class="profile-1reTe">
                <section @click="linkfoodTypeDel" class="myorder">
                    <aside>
                        <svg fill="#4aa5f0">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#order"></use>
                        </svg>
                    </aside>
                    <div class="myorder-div">
                        <span>料理の種類を削除・更新</span>
                        <span class="myorder-divsvg">
                            <svg fill="#bbb">
                                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                            </svg>
                        </span>
                    </div>
                </section>
            </section>
            <section class="profile-1reTe">
                <router-link to='/foodDefaultAdd' class="myorder">
                    <aside>
                        <svg fill="#4aa5f0">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#order"></use>
                        </svg>
                    </aside>
                    <div class="myorder-div">
                        <span>デフォルトメニューを追加</span>
                        <span class="myorder-divsvg">
                            <svg fill="#bbb">
                                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                            </svg>
                        </span>
                    </div>
                </router-link>
            </section>
            <section class="profile-1reTe">
                <section @click="linkfoodAdd" class="myorder">
                    <aside>
                        <svg fill="#4aa5f0">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#order"></use>
                        </svg>
                    </aside>
                    <div class="myorder-div">
                        <span>カスタマイズメニューを追加</span>
                        <span class="myorder-divsvg">
                            <svg fill="#bbb">
                                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                            </svg>
                        </span>
                    </div>
                </section>
            </section>
            <section class="profile-1reTe">
                <section @click="linkmenuModify" class="myorder">
                    <aside>
                        <svg fill="#4aa5f0">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#order"></use>
                        </svg>
                    </aside>
                    <div class="myorder-div">
                        <span>メニューを削除・更新</span>
                        <span class="myorder-divsvg">
                            <svg fill="#bbb">
                                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                            </svg>
                        </span>
                    </div>
                </section>
            </section>
        </section>
        <foot-guide :homeStatus="true" :orderStatus="false" :moneyStatus="false" :profileStatus="false"></foot-guide>
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
import {getMenu, foodMenu} from 'src/service/getData'
import alertTip from '../../components/common/alertTip'

export default {
    data(){
        return{
            restaurant_id: null,
            menu: null,
            showAlert: false,
            alertText: null,
            menuList: [], //食品列表
            user_id: null,
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
        initData(){
            this.restaurant_id = getStore('shopid');
        },
        async linkfoodAdd(){
            if(this.restaurant_id){
                this.menu = await getMenu({restaurant_id: this.restaurant_id, allMenu: true, time: new Date().getTime()});
                if(this.menu != ''){
                    this.$router.push({path: '/foodAdd'});
                }else{
                    this.showAlert = true;
                    this.alertText = 'まず料理の種類を追加してください';
                }
            }else{
                this.showAlert = true;
                this.alertText = '店舗情報を取得失敗';
            }
        },
        async linkmenuModify(){
            var exist = 0;
            if(this.restaurant_id){
                this.menuList = await foodMenu(this.restaurant_id);
                if(this.menuList != ''){
                    this.$router.push({path: '/menuModify'});
                }else{
                    this.showAlert = true;
                    this.alertText = 'まずメニューを追加してください';
                }
            }else{
                this.showAlert = true;
                this.alertText = '店舗情報を取得失敗';
            }
        },
        async linkfoodTypeDel(){
            if(this.restaurant_id){
                this.menu = await getMenu({restaurant_id: this.restaurant_id, allMenu: true, time: new Date().getTime()});
                if(this.menu != ''){
                    this.$router.push({path: '/foodTypeDel'});
                }else{
                    this.showAlert = true;
                    this.alertText = 'まず料理の種類を追加してください';
                }
            }else{
                this.showAlert = true;
                this.alertText = '店舗情報を取得失敗';
            }
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
        .profile-link{
            display:block;
            display:flex;
            box-align: center;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            background:$blue;
            padding: .666667rem .6rem;
            .privateImage{
                display:inline-block;
                @include wh(2.5rem,2.5rem);
                border-radius:50%;
                vertical-align:middle;
                .privateImage-svg{
                    background:$fc;
                    border-radius:50%;
                    @include wh(2.5rem,2.5rem);
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
                svg{
                    @include wh(100%,100%);
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
