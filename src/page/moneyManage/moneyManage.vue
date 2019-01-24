<template>
    <div class="profile_page">
        <head-top head-title="売り上げの管理"></head-top>
        <section>
            <section class="profile-number">
            </section>
            <section class="profile-1reTe">
                <router-link to='/moneyManage/moneyToday' class="myorder">
                    <aside>
                        <img :src="GLOBAL.defaults.today" class="img_style">
                    </aside>
                    <div class="myorder-div">
                        <span>最近数日の売り上げ</span>
                        <span class="myorder-divsvg">
                            <svg fill="#bbb">
                                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                            </svg>
                        </span>
                    </div>
                </router-link>
            </section>
            <section class="profile-1reTe">
                <router-link to='/moneyManage/moneyWeek' class="myorder">
                    <aside>
                        <img :src="GLOBAL.defaults.week" class="img_style">
                    </aside>
                    <div class="myorder-div">
                        <span>最近数週間の売り上げ</span>
                        <span class="myorder-divsvg">
                            <svg fill="#bbb">
                                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                            </svg>
                        </span>
                    </div>
                </router-link>
            </section>
            <section class="profile-1reTe">
                <router-link to='/moneyManage/moneyMonth' class="myorder">
                    <aside>
                        <img :src="GLOBAL.defaults.Recentmonth" class="img_style"> 
                    </aside>
                    <div class="myorder-div">
                        <span>最近数か月の売り上げ</span>
                        <span class="myorder-divsvg">
                            <svg fill="#bbb">
                                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                            </svg>
                        </span>
                    </div>
                </router-link>
            </section>
            <section class="profile-1reTe">
                <router-link to='/moneyManage/moneyPeriod' class="myorder">
                    <aside>
                        <img :src="GLOBAL.defaults.Customperiod" class="img_style">
                    </aside>
                    <div class="myorder-div">
                        <span>カスタム期間の売り上げ</span>
                        <span class="myorder-divsvg">
                            <svg fill="#bbb">
                                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                            </svg>
                        </span>
                    </div>
                </router-link>
            </section>
        </section>
        <foot-guide :homeStatus="false" :orderStatus="false" :moneyStatus="true" :profileStatus="false"></foot-guide>
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
        .profile-link{
            display:block;
            display:flex;
            box-align: center;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            background:$blue;
            padding: .666667rem .6rem;
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
    .img_style{
        float: left;
        margin-left:-.266667rem;
        width: 150%;
    }
    
</style>
