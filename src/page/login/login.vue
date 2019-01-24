<template>
    <div class="loginContainer">
        <router-link to="/register" class="to_register">新規取得</router-link>
        <img :src='GLOBAL.defaults.qmenu'>
        <form class="loginForm">
            <section class="input_container">
                <input type="text" placeholder="メールアドレス" maxlength="64" v-model.lazy="userAccount">
            </section>
            <section class="input_container">
                <input type="password" placeholder="パスワード" maxlength="31" v-model="passWord">
            </section>
        </form>
        <el-checkbox class="login_checkbox" v-model="checked">ログインしたままにする</el-checkbox>
        <p class="login_tips"></p>
        <div class="login_container" @click="login">確認</div>
        <router-link to="/forget" class="to_forget">ログインできない場合</router-link>
        <router-link to="/resend" class="to_registers">も一度送信</router-link>
        
        <alert-tip v-if="showAlert" :showHide="showAlert" @closeTip="closeTip" :alertText="alertText"></alert-tip>
    </div>
</template>

<script>
    import headTop from '../../components/header/head'
    import alertTip from '../../components/common/alertTip'
    import {mapMutations} from 'vuex'
    import {accountLogin, getOpenShop} from '../../service/getData'
    import {setStore, getStore} from 'src/config/mUtils'

    export default {
        data(){
            return {
                userInfo: null,     //获取到的用户信息
                userAccount: null,  //用户名
                passWord: null,     //密码
                showAlert: false,   //显示提示组件
                alertText: null,    //提示的内容
                shopOpenList: [],
                shopid: null,
                checked: false
            }
        },
        created(){
            if(getStore('checked') == 'true'){
                this.checked = true;
            }
            this.userAccount = getStore('userAccount');
            this.passWord = getStore('passWord');
        },
        components: {
            headTop,
            alertTip,
        },
        computed: {
        },
        methods: {
            ...mapMutations([
                'RECORD_USERINFO',
            ]),
            //发送登录信息
            async login(){

                if (!this.userAccount) {
                    this.showAlert = true;
                    this.alertText = 'メールアドレスを入力してください！';
                    return
                }else if(!this.passWord){
                    this.showAlert = true;
                    this.alertText = 'パスワードを入力してください！';
                    return
                }
                //用户名登录
                this.userInfo = await accountLogin(this.userAccount, this.passWord);
            
                //如果返回的值不正确，则弹出提示框，返回的值正确则返回上一页
                if (!this.userInfo.user_id) {
                    this.showAlert = true;
                    this.alertText = this.userInfo.message;
                }else{
                    this.RECORD_USERINFO(this.userInfo);
                    setStore('checked', this.checked);
                    setStore('userAccount',this.userAccount);
                    if(this.checked){
                        setStore('passWord', this.passWord);
                    }else{
                        setStore('passWord', '');
                    }
                    //获取店铺id
                    this.shopOpenList = await getOpenShop(this.userInfo.user_id);
                    if(this.shopOpenList.length > 0){
                        this.shopid = this.shopOpenList[0].id;
                        setStore('shopid',this.shopid);
                    }else{
                        setStore('shopid',null);
                    }

                    //this.$router.go(-1);
                    this.$router.push('/shop');
                }
            },
            closeTip(){
                this.showAlert = false;
            }
        }
    }

</script>

<style lang="scss" scoped>
    @import '../../style/mixin';

    .loginContainer{
        padding-top: 0.2rem;
        text-align: center;
        p, span, input{
            font-family: Helvetica Neue,Tahoma,Arial;
        }
        img{
            margin-top: 4rem;
            @include wh(7rem, 7rem);
        }
    }
    .to_register{
        display: flex;
        @include sc(.8rem, #666);
        margin-left: 12.2rem;
    }
    .loginForm{
        margin-top: 1rem;
        .input_container{
            display: flex;
            justify-content: space-between;
            padding: .6rem .8rem;
            border-bottom: 2px solid rgb(221, 49, 49);
            margin-left: .6rem;
            margin-right: .6rem;
            input{
                @include sc(.7rem, #666);
                width: 15rem;
                background-color: transparent;
                outline:none;
                border:none;
                outline:medium;
                text-align:center;
            }
            button{
                @include sc(.65rem, #fff);
                font-family: Helvetica Neue,Tahoma,Arial;
                padding: .28rem .4rem;
                border: 1px;
                border-radius: 0.15rem;
            }
        }
    }
    .login_checkbox{
        padding-top: .5rem;
        padding-left: .8rem;
        float: left;
    }
    .login_tips{
        padding: 1rem;
    }
    .login_container{
        margin: 0 .6rem 1rem;
        @include sc(.7rem, #fff);
        background-color: rgb(221, 49, 49);
        padding: .5rem 0;
        border: 1px;
        border-radius: 0.15rem;
        text-align: center;
    }
    .to_registers{
        display: flex;
        @include sc(.7rem, #666);
        margin-left: .6rem;
        margin-top: .2rem;
    }
    .to_forget{
        float: right;
        @include sc(.7rem, #666);
        margin-right: .6rem;
    }
</style>
<style>
    .el-checkbox__input.is-focus .el-checkbox__inner {
        border-color: rgb(221, 49, 49);
    }
    .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: rgb(221, 49, 49);
        border-color: rgb(221, 49, 49);
    }
    .el-checkbox__input.is-checked+.el-checkbox__label {
        color: rgb(221, 49, 49);
    }
</style>
