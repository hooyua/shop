<template>
    <div class="restContainer">
        <head-top head-title="ログインできない" goBack="true"></head-top>
        <form class="restForm">
            <section class="input_container phone_number">
                <input type="text" placeholder="メールアドレスを入力" name="phone" maxlength="64" v-model="userAccount">
            </section>
        </form>
        <section class="login_container">
            <p @click="resetButton">送信</p>
        </section>
        <alert-tip v-if="showAlert" :showHide="showAlert" @closeTip="closeTip" :alertText="alertText"></alert-tip>
    </div>
</template>

<script>
    import headTop from 'src/components/header/head'
    import alertTip from 'src/components/common/alertTip'
    import {forget} from 'src/service/getData'

    export default {
        data(){
            return {
                userAccount: null, //邮箱
                showAlert: false, //显示提示组件
                alertText: null, //提示的内容
            }
        },
        components: {
            headTop,
            alertTip,
        },
        computed: {
            //判断邮箱
            rightUserAccount: function (){
                return /^[0-9A-Za-zd]+([-_.][0-9A-Za-zd]+)*@([0-9A-Za-zd]+[-.])+[0-9A-Za-zd]{2,5}$/gi.test(this.userAccount)
            }
        },
        methods: {
            //重置密码
            async resetButton(){
                if (!this.userAccount) {
                    this.showAlert = true;
                    this.alertText = 'メールアドレスを入力してください！';
                    return
                } else if (!this.rightUserAccount) {
                    this.showAlert = true;
                    this.alertText = '正しいメールアドレスを入力してください！';
                    return
                }
                
                let res = await forget(this.userAccount, this.passWord, this.confirmPassWord, this.codeNumber);
                if (res.message) {
                    if(res.message == 'アクティブ NG'){
                        this.showAlert = true;
                        this.alertText = 'ユーザーが存在しません！';
                        return
                    }
                    this.showAlert = true;
                    this.alertText = res.message;
                    return
                } else if (res.status == 1) {
                    this.showAlert = true;
                    this.alertText = 'メールに記載されているリンクをクリックするとパスワードをリセットできます。';
                    return
                }

            },
            closeTip(){
                this.showAlert = false;
                if (this.alertText === 'メールに記載されているリンクをクリックするとパスワードをリセットできます。') {
                    this.$router.go(-1);
                }
            }   
        }
    }

</script>

<style lang="scss" scoped>
    @import 'src/style/mixin';

    .restContainer{
        padding-top: 1.95rem;
    }
    .restForm{
        background-color: #fff;
        margin-top: .5rem;
        .input_container{
            display: flex;
            height: 2rem;
            justify-content: space-between;
            padding: .6rem .8rem;
            border-bottom: 1px solid #f1f1f1;
            input{
                @include sc(.7rem, #666);
            }
            button{
                @include sc(.65rem, #fff);
                font-family: Helvetica Neue,Tahoma,Arial;
                padding: .28rem .4rem;
                border: 1px;
                border-radius: 0.15rem;
            }
            .right_phone_number{
                background-color: #4cd964;
            }
        }
        .phone_number{
            padding: .3rem .8rem;
        }
        .captcha_code_container{
            height: 2.2rem;
            .img_change_img{
                display: flex;
                align-items: center;
                img{
                    @include wh(3.5rem, 1.5rem);
                    margin-right: .2rem;
                }
                .change_img{
                    display: flex;
                    flex-direction: 'column';
                    flex-wrap: wrap;
                    width: 2rem;
                    justify-content: center;
                    p{
                        @include sc(.55rem, #666);
                    }
                    p:nth-of-type(2){
                        color: #3b95e9;
                        margin-top: .2rem;
                    }
                }
            }
        }
    }
    .captcha_code_container{
        height: 2.2rem;
        .img_change_img{
            display: flex;
            align-items: center;
            img{
                @include wh(3.5rem, 1.5rem);
                margin-right: .2rem;
            }
            .change_img{
                display: flex;
                flex-direction: 'column';
                flex-wrap: wrap;
                width: 2rem;
                justify-content: center;
                p{
                    @include sc(.55rem, #666);
                }
                p:nth-of-type(2){
                    color: #3b95e9;
                    margin-top: .2rem;
                }
            }
        }
    }
    .login_container{
        display: flex;
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 2rem;
        p{
            line-height: 2rem;
            @include sc(.75rem, #fff);
        }
        p:nth-of-type(1){
            flex: 2;
            @include sc(.7rem, #fff);
            background-color: rgb(221, 49, 49);
            text-align: center;
            font-weight: bold;
        }
    }
</style>
