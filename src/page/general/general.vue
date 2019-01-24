<template>
    <div class="profile_page">
        <head-top go-back='true' head-title="一般"></head-top>
        <section class="profile">
            <section class="profile-number">
            </section>
            <section class="profile-1reTe">
                <router-link to='/agreement' class="myorder">
                    <aside>
                        <img :src="GLOBAL.defaults.statute">
                    </aside>
                    <div class="myorder-div">
                        <span>利用規約</span>
                        <span class="myorder-divsvg">
                            <svg fill="#bbb">
                                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                            </svg>
                        </span>
                    </div>
                </router-link>
            </section>
            <section class="profile-1reTe">
                <router-link to='/FAQ' class="myorder">
                    <aside>
                        <img :src="GLOBAL.defaults.faq">
                    </aside>
                    <div class="myorder-div">
                        <span>FAQ</span>
                        <span class="myorder-divsvg">
                            <svg fill="#bbb">
                                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                            </svg>
                        </span>
                    </div>
                </router-link>
            </section>
            <section class="profile-1reTe">
                <router-link to='/improveManage' class="myorder">
                    <aside>
                        <img :src="GLOBAL.defaults.improve">
                    </aside>
                    <div class="myorder-div">
                        <span>改善要望</span>
                        <span class="myorder-divsvg">
                            <svg fill="#bbb">
                                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                            </svg>
                        </span>
                    </div>
                </router-link>
            </section>
            <section class="profile-1reTe">
                <router-link to='/consult' class="myorder">
                    <aside>
                        <img :src="GLOBAL.defaults.consult">
                    </aside>
                    <div class="myorder-div">
                        <span>お問い合わせ</span>
                        <span class="myorder-divsvg">
                            <svg fill="#bbb">
                                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                            </svg>
                        </span>
                    </div>
                </router-link>
            </section>
            <section class="profile-1reTe">
                <router-link to='/about' class="myorder">
                    <aside>
                        <img :src="GLOBAL.defaults.about">
                    </aside>
                    <div class="myorder-div">
                        <span>About</span>
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
        <transition name="router-slid" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
import headTop from 'src/components/header/head'
import footGuide from 'src/components/footer/footGuide'
import {getStore} from 'src/config/mUtils'

export default {
    data(){
        return{
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
        
    },
    components:{
        headTop,
        footGuide,
    },

    computed:{

    },

    methods:{
    },
    watch: {

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
.profile {
    padding-top: 0.3rem;
}
   .profile-1reTe{
        background:$fc;
        .myorder{
            padding-left:1.6rem;
            display:flex;
            align-items: center;
            aside{
            @include wh(1rem, 1rem);
            margin-left: -0.866667rem;
            margin-right: 0.266667rem;
                display:flex;
                align-items: center;
            img {
                    @include wh(100%,100%);
                }
            }
            .myorder-div{
                width:100%;
                border-bottom:1px solid #f1f1f1;
            padding: 0.433333rem 0.266667rem 0.533333rem 0;
            @include sc(0.7rem, #333);
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
