<template>
    <header id='head_top'>
        <slot name='logo'></slot>
        <slot name='search'></slot>
        <section class="head_goback" v-if="goBack" @click="$router.go(-1)">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" version="1.1">
                <polyline points="12,18 4,9 12,0" style="fill:none;stroke:rgb(0,0,0);stroke-width:2"/>
            </svg>
        </section>
        <section v-if="printerDel && printerid" class="head_login">
            <span class="login_span" @click="delPrinter(printerid)">削除</span>
        </section>
        <section class="title_head ellipsis" v-if="headTitle">
            <span class="title_text">{{headTitle}}</span>
        </section>
        <slot name="edit"></slot>
        <slot name="msite-title"></slot>
        <slot name="changecity"></slot>
        <slot name="changeLogin"></slot>
    </header>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    export default {
    	data(){
            return{
            }
        },
        mounted(){
        },
        props: ['signinUp', 'headTitle', 'goBack', "printerDel", "printerid"],
        computed: {
            ...mapState([
                'userInfo'
            ]),
        },
        methods: {
            ...mapActions([
                'getUserInfo'
            ]),
	        //删除打印机
	        async delPrinter(id) {
	            this.$emit("delPrinter", id);
	        },
        },

    }

</script>

<style lang="scss" scoped>
    @import '../../style/mixin';

    #head_top{
        background-color:rgb(255, 255, 255);
        position: fixed;
        z-index: 100;
        left: 0;
        top: 0;
        @include wh(100%, 1.95rem);
    }
    .head_goback{
        color: #000;
        left: 0.4rem;
        @include wh(0.6rem, 1rem);
        line-height: 2.2rem;
        margin-left: .4rem;
    }
    .head_login{
        right: 0.55rem;
        @include sc(0.65rem, black);
        @include ct;
        .login_span{
            color: black;
        }
        .user_avatar{
            fill: black;
            @include wh(.8rem, .8rem);
        }
    }
    .title_head{
        @include center;
        width: 55%;
        color: rgb(0, 0, 0);
        text-align: center;
        .title_text{
            @include sc(0.8rem, rgb(0, 0, 0));
            text-align: center;
            font-weight: bold;
        }
    }
</style>
