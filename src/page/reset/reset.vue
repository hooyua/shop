<template>
    <div class="restContainer">
        <head-top head-title="パスワードリセット" goBack="true"></head-top>
        <form class="restForm">
            <section class="input_container">
                <input type="text" placeholder="アカウントを入力" name="phone" maxlength="64" v-model="phoneNumber">
            </section>
             <section class="input_container">
                <input type="password" placeholder="元のパスワードを入力" name="oldPassWord" maxlength="31" v-model="oldPassWord">
            </section>
            <section class="input_container">
                <input type="password" placeholder="新しいパスワードを入力" name="newPassWord" :class="{'setname-input':bordercolor}" @input="inputThing" v-model="newPassWord">
                <button class="info" v-show="info" type="info" v-text="msgText" disabled></button>
                <button class="info1" v-show="info1" type="info" v-text="msgText" disabled></button>
                <button class="info2" v-show="info2" type="info" v-text="msgText" disabled></button>
            </section>
            <div>
                <p v-if="earns" class="unlikep">半角英数字、記号のみ使用できます。変更してください。</p>
                <p v-if="earn" class="unlikep">パスワードのサイズは6から31まで。</p>
            </div>
            <section class="input_container">
                <input type="password" placeholder="新しいパスワードをもう一度入力" name="confirmPassWord" class="setname-input" v-model="confirmPassWord">
            </section>
        </form>
        <section class="confrim_order">
            <div :class="{fontopacity:opacityall}" @click="resetButton">確認</div>
        </section>
        <alert-tip v-if="showAlert" :showHide="showAlert" @closeTip="closeTip" :alertText="alertText"></alert-tip>
    </div>
</template>

<script>
    import headTop from 'src/components/header/head'
    import alertTip from 'src/components/common/alertTip'
    import {getcaptchas, changePassword} from 'src/service/getData'
    import {getStore} from 'src/config/mUtils'
    import {checkStrong} from 'src/store/checkpassStrong'

    export default {
        data(){
            return {
                phoneNumber: null, //邮箱
                oldPassWord: null,
                newPassWord: null, //新密码
                confirmPassWord: null, //确认密码
                captchaCodeImg: null, //验证码地址
                computedTime: 0, //倒数记时
                showAlert: false, //显示提示组件
                alertText: null, //提示的内容
                accountType: 'mobile',//注册方式
                user_id: null,
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
        components: {
            headTop,
            alertTip,
        },
        created(){
            this.user_id = getStore('user_id')
            if(this.user_id == null){
                this.$router.push({path: '/login'});
            }
            this.getCaptchaCode()
        },
        methods: {
            async getCaptchaCode(){
                let res = await getcaptchas();
                this.captchaCodeImg = res.code;
            },
            //重置密码
            async resetButton(){
                let checkResult = this.inputThing();
                if (!checkResult) {
                  return;
                } 
                if (this.earns == true) {
                  return;
                } 
                
                if (!this.phoneNumber) {
                    this.showAlert = true;
                    this.alertText = 'アカウントを入力してください！';
                    return
                }else if(!this.oldPassWord){
                    this.showAlert = true;
                    this.alertText = '元のパスワードを入力してください！';
                    return
                }else if(!this.newPassWord){
                    this.showAlert = true;
                    this.alertText = '新しいパスワードを入力してください！';
                    return
                }else if(!this.confirmPassWord){
                    this.showAlert = true;
                    this.alertText = '新しいパスワードをも一度入力してください！';
                    return
                }else if(this.newPassWord !== this.confirmPassWord){
                    this.showAlert = true;
                    this.alertText = '入力の新しいパスワードが一致しません！';
                    return
                }
                // 发送重置信息
                let res = await changePassword(this.phoneNumber, this.oldPassWord, this.newPassWord, this.confirmPassWord);
                if (res.message) {
                    this.showAlert = true;
                    this.alertText = res.message;
                    this.getCaptchaCode()
                    return
                }else{
                    this.showAlert = true;
                    this.alertText = 'パスワードを修正しました！';
                }
                //this.$router.go(-1);
            },
            closeTip(){
                this.showAlert = false;
                if(this.alertText == 'パスワードを修正しました！'){
                    this.$router.go(-1);
                }
            },
            inputThing(){
                if(this.newPassWord.length == 0){
                    this.earn=false;
                    this.earns = false;
                    return
                }
                var reg = /^[0-9a-zA-Z\u0000-\u00FF]+$/;
                if(this.newPassWord.length <6 || this.newPassWord.length>31){
                    this.earn=true;
                    this.bordercolor=true;
                    this.opacityall=false;
                    if (!reg.test(this.newPassWord)) {
                        this.earns = true;
                    }else{
                        this.earns = false;
                    }
                    return false;
                }else{
                    this.earn=false;
                    this.bordercolor=false;
                    this.opacityall=true;
                    if (!reg.test(this.newPassWord)) {
                        this.earns = true;
                        this.bordercolor=true;
                        this.opacityall=false;
                    }else{
                        this.earns = false;
                    }
                    return true;
                }
            }  
        },
        watch: {
            newPassWord(newValue,oldValue){
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
    @import 'src/style/mixin';

    .restContainer{
        padding-top: 1.95rem;
    }
    .restForm{
        margin-top: .5rem;
        .input_container{
            background-color: #fff;
            display: flex;
            height: 2rem;
            justify-content: space-between;
            padding: .6rem .8rem;
            border-bottom: 1px solid #f1f1f1;
            input{

                @include sc(.7rem, #666);
                width: 12.5rem;
            }
            .right_phone_number{
                background-color: #4cd964;
            }
        }
        .setname-input{
            border-color:#ea3106;
        }
    }
    .unlikep{
            @include sc(.58rem,#ea3106);
            padding-top:.1rem;
            margin-left:.8rem;
        }
    .confrim_order{
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
        width: 2rem;
    }
    .info1{
        @include sc(.65rem, #fff);
        background-color: #f8bb49;
        width: 2rem;
    }
    .info2{
        @include sc(.65rem, #fff);
        background-color: #4cd964;
        width: 2rem;
    }
</style>
