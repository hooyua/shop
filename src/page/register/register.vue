<template>
    <div class="loginContainer">
	    <head-top head-title="新規取得" goBack="true"></head-top>
        <form class="loginForm">
            <section class="input_container">
                <input type="text" placeholder="メールアドレス" maxlength="64" v-model.lazy="userAccount">
            </section>
            <section class="input_container">
                <input type="password" placeholder="パスワード(英文大文字、小文字に注意)" :class="{'setname-input':bordercolor}" @input="inputThing" v-model="passWord">
                <button class="info" v-show="info" type="info" v-text="msgText" disabled></button>
                <button class="info1" v-show="info1" type="info" v-text="msgText" disabled></button>
                <button class="info2" v-show="info2" type="info" v-text="msgText" disabled></button>
            </section>
            <div>
                <p v-if="earns" class="unlikep">半角英数字、記号のみ使用できます。変更してください。</p>
                <p v-if="earn" class="unlikep">パスワードの長さは6文字から31文字まで。</p>
            </div>
            <section class="input_container">
                <input type="password" placeholder="パスワードをもう一度入力" name="confirmPassWord" class="setname-input" v-model="confirmPassWord">
            </section>
            <section class="input_container captcha_code_container">
                <input type="text" placeholder="画像の数字を入力" maxlength="4" v-model="codeNumber">
                <div class="img_change_img">
                    <img v-show="captchaCodeImg" :src="captchaCodeImg">
                    <div class="change_img" @click="getCaptchaCode">
                        <p>別の数字を表示</p>
                    </div>
                </div>
            </section>
        </form>
        <section class="reset">
            <div :class="{fontopacity:opacityall}" @click="Login">確認</div>
        </section>
        <alert-tip v-if="showAlert" :showHide="showAlert" @closeTip="closeTip" :alertText="alertText"></alert-tip>
    </div>
</template>

<script>
    import headTop from '../../components/header/head'
    import alertTip from '../../components/common/alertTip'
    import {getcaptchas, register} from '../../service/getData'
    import {checkStrong} from 'src/store/checkpassStrong'

    export default {
        data(){
            return {
                userAccount: null, //用户名
                passWord: null, //密码
                captchaCodeImg: null, //验证码地址
                codeNumber: null, //验证码
                showAlert: false, //显示提示组件
                alertText: null, //提示的内容
                confirmPassWord: null, //确认密码
                earn: false,     //输入框提醒
                earns: false,     //输入框提醒
                bordercolor: false,  //输入框边框颜色
                opacityall: false,   //字体透明度
                msgText: null,
                info: false,
                info1: false,
                info2: false,
            }
        },
        created(){
            this.getCaptchaCode();
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
            //获取验证吗，线上环境使用固定的图片，生产环境使用真实的验证码
            async getCaptchaCode(){
                let res = await getcaptchas();
                this.captchaCodeImg = res.code;
            },
            //发送登录信息
            async Login(){
                if(!this.opacityall){
                    return
                }
                let checkResult = this.inputThing();
                if (!checkResult) {
                  return;
                } 
                if (this.earns == true) {
                  return;
                } 

                if (!this.userAccount) {
                    this.showAlert = true;
                    this.alertText = 'メールアドレスを入力してください！';
                    return
                } 
                else if (!this.rightUserAccount) {
                    this.showAlert = true;
                    this.alertText = '正しいメールアドレスを入力してください！';
                    return
                } 
                else if (!this.passWord) {
                    this.showAlert = true;
                    this.alertText = 'パスワードを入力してください！';
                    return
                } else if (!this.confirmPassWord) {
                    this.showAlert = true;
                    this.alertText = 'パスワードをもう一度入力してください！';
                    return
                } else if (this.passWord != this.confirmPassWord) {
                    this.showAlert = true;
                    this.alertText = '入力したパスワードが異なっています！';
                    return
                } else if (!this.codeNumber) {
                    this.showAlert = true;
                    this.alertText = '数字を入力してください！';
                    return
                } else if (this.userAccount == this.passWord) {
                    this.showAlert = true;
                    this.alertText = 'ユーザー名とパスワードが同じです！';
                    return
                }

                let res = await register(this.userAccount, this.passWord, this.confirmPassWord, this.codeNumber);
                if (res.message) {
                    this.showAlert = true;
                    this.alertText = res.message;
                    this.getCaptchaCode()
                    return
                } else if (res.status == 1) {
                    this.showAlert = true;
                    this.alertText = '登録が完了しました。メールに記載されているリンクをクリックするとメールアドレスでログインできます。';
                    return
                } else if (res.status == 2) {
                    this.showAlert = true;
                    this.alertText = 'メール送信に失敗しました。正しいメールアドレスを確認してください。';
                    return
                }
            },
            closeTip(){
                this.showAlert = false;
                if (this.alertText === '登録が完了しました。メールに記載されているリンクをクリックするとメールアドレスでログインできます。') {
                    this.$router.go(-1);
                }
            },
            inputThing(){
                if(this.passWord.length == 0){
                    this.earn=false;
                    this.earns = false;
                    return
                }
                var reg = /^[0-9a-zA-Z\u0000-\u00FF]+$/;
                if(this.passWord.length <6 || this.passWord.length>31){
                    this.earn=true;
                    this.bordercolor=true;
                    this.opacityall=false;
                    if (!reg.test(this.passWord)) {
                        this.earns = true;
                    }else{
                        this.earns = false;
                    }
                    return false;
                }else{
                    this.earn=false;
                    this.bordercolor=false;
                    this.opacityall=true;
                    if (!reg.test(this.passWord)) {
                        this.earns = true;
                        this.bordercolor=true;
                        this.opacityall=false;
                    }else{
                        this.earns = false;
                    }
                    return true;
                }
            },
        },
        watch: {
            passWord(newValue,oldValue){
                if(newValue == ''){
                    this.info = false;
                    this.info1 = false;
                    this.info2 = false;
                    return
                }
                var show = checkStrong(newValue);
                if(show == 1){
                    this.info = true;
                    this.info1 = false;
                    this.info2 = false;
                    this.msgText = '低';
                }else if (show == 2){
                    this.info = false;
                    this.info1 = true;
                    this.info2 = false;
                    this.msgText = '中';
                }else{
                    this.info = false;
                    this.info1 = false;
                    this.info2 = true;
                    this.msgText = '高';
                }
            }
        }
    }

</script>

<style lang="scss" scoped>
    @import '../../style/mixin';

    .loginContainer{
        padding-top: 1.95rem;
        p, span, input{
            font-family: Helvetica Neue,Tahoma,Arial;
        }
    }

    .loginForm{
        margin-top: .5rem;
        .input_container{
            margin-top: .1rem;
            background-color: #fff;
            display: flex;
            height: 2rem;
            justify-content: space-between;
            padding: .6rem .8rem;
            input{
                @include sc(.7rem, #666);
                width: 12.5rem;
            }
        }
        .setname-input{
            border-color:#ea3106;
        }
        .captcha_code_container{
            height: 2.2rem;
            input{
                @include sc(.7rem, #666);
                width: 7rem;
            }
            .img_change_img{
                display: flex;
                align-items: center;
                img{
                    @include wh(3.5rem, 1.5rem);
                    margin-right: .1rem;
                    margin-left: -1.5rem;
                }
                .change_img{
                    display: flex;
                    flex-direction: 'column';
                    flex-wrap: wrap;
                    width: 3rem;
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
    .unlikep{
            @include sc(.58rem,#ea3106);
            padding-top:.1rem;
            margin-left:.8rem;
        }
    .reset{
        display: flex;
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 2rem;
        text-align: center;
        background-color: rgb(221, 49, 49);
        div{
            flex: 2;
            line-height: 2rem;
            @include sc(.7rem, #fff);
            text-align: center;
            font-weight: bold;
            opacity:.6;
        }
        .fontopacity{
            transition: all 1s;
            opacity:1;
        }
    }
    .info{
        @include sc(.65rem, #fff);
        background-color: #ea3106;
        width: 1.7rem;
    }
    .info1{
        @include sc(.65rem, #fff);
        background-color: #f8bb49;
        width: 1.7rem;
    }
    .info2{
        @include sc(.65rem, #fff);
        background-color: #4cd964;
        width: 1.7rem;
    }
</style>
