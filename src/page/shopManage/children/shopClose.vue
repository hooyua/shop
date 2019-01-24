 <template>
	<div class="restContainer">
        <head-top head-title="閉店・休業" go-back='true'></head-top>
        <form class="restForm">
            <section class="input_container phone_number">
                <input type="password" placeholder="パスワード入力" name="phone" :class="{'setname-input':bordercolor}" @input="inputThing" v-model="password"> 
            </section>
        </form>
        <div>
            <p v-if="earn" class="unlikep">パスワードのサイズは6から31まで。</p>
        </div>
        <section class="confrim_order">
            <div :class="{fontopacity:opacityall}" @click="confirm">確認</div>
        </section>
        <section class="coverpart" v-if="shows">
            <div class="alet_container">
                <section class="cover-backgrounds"></section>
                <section class="cover-content">
                    <div class="sa-icon">
                        <img :src='GLOBAL.defaults.infoico'>
                    </div>
                    <h2>店舗閉鎖の確認</h2>
                    <div class="sa-botton">
                        <div class="confrim" @click="shows = false">キャンセル</div>
                        <div class="confrims" @click="closeshop">確認</div>
                    </div>
                </section>
            </div>
        </section>
        <alert-tip v-if="showAlert" :showHide="showAlert" @closeTip="closeTip" :alertText="alertText"></alert-tip>
    </div>
</template>

<script>
    import headTop from 'src/components/header/head'
    import alertTip from 'src/components/common/alertTip'
    import {accountLogin, closeshop} from 'src/service/getData'
    import {getStore} from 'src/config/mUtils'

    export default {
        data(){
            return {
                password: '', //用户密码
                showAlert: false, //显示提示组件
                alertText: null, //提示的内容
                username: null, //用户名
                userInfo: null, //获取到的用户信息
                shows: false,
                restaurant_id: null, //商店id值
                state: '已关闭', //商店的状态
                user_id: null,
                earn: false,     //输入框提醒
                bordercolor: false,  //输入框边框颜色
                opacityall: false,   //字体透明度
            }
        },
        created(){
            this.user_id = getStore('user_id')
            if(this.user_id == null){
                this.$router.push({path: '/login'});
            }
        },
        components: {
            headTop,
            alertTip,
        },
        computed: {
            
        },
        methods: {
            confirm(){  
                let checkResult = this.inputThing();
                if (!checkResult) {
                  return;
                } 
                
                if(!this.password){
                    this.showAlert = true;
                    this.alertText = 'パスワードを入力してください！';
                    return
                }
                this.shows = true;
            },
            //关闭店铺
            async closeshop(){
                this.username = getStore('userAccount');
                this.userInfo = await accountLogin(this.username, this.password);
            
                //如果返回的值不正确，则弹出提示框，返回的值正确则关闭店铺
                if (!this.userInfo.user_id) {
                    this.shows = false;
                    this.showAlert = true;
                    this.alertText = 'パスワードが正しくない';
                }else{
                    try{
                        this.restaurant_id = getStore('shopid');
                        let res = await closeshop(this.restaurant_id, this.state);
                        if (res.status >= 1) {
                            this.shows = false;
                            this.showAlert = true;
                            this.alertText = '店舗閉鎖成功';
                        }
                    }catch (error) {
                        this.shows = false;
                        this.showAlert = true;
                        this.alertText = '店舗閉鎖失敗';
                        throw new Error(error);
                    }
                }
            },
            closeTip(){
                this.showAlert = false;
                if (this.alertText === '店舗閉鎖成功') {
                    this.$router.go(-1);
                }
            },
            inputThing(){
                if(this.password.length == 0){
                    this.earn=false;
                    return
                }
                if(this.password.length <6 || this.password.length>31){
                    this.earn=true;
                    this.bordercolor=true;
                    this.opacityall=false;
                    return false;
                }else{
                    this.earn=false;
                    this.bordercolor=false;
                    this.opacityall=true;
                    return true;
                }
            },
        }
    }

</script>

<style lang="scss" scoped>
    @import 'src/style/mixin';

    .coverpart{
        @include wh(100%,100%);
        @include allcover;
        .cover-background{
            @include wh(100%,100%);
            @include allcover;
            background:#000;
            z-index:100;
            opacity:.2;
        }
        .alet_container{
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 200;
        }
        .cover-content{
            width:90%;
            background:$fc;
            position:absolute;
            top:20%;
            left:5%;
            z-index:1000;
            @include borderRadius(7px);
            .sa-icon{
                text-align: center;
                padding-top: 1rem;
                img{
                    @include wh(4rem, 4rem);
                }
            }
            h2{
                width:100%;
                text-align:center;
                @include sc(30px,#575757);
                font-weight:500;
                margin:25px 0;
            }
            .sa-botton{
                width:100%;
                text-align:center;
                float: left;
            }

        }
    }
    .confrim{
        float: left;
        @include sc(.8rem, #fff);
        font-weight: bold;
        margin-top: .3rem;
        background-color: #979797;
        width: 50%;
        text-align: center;
        line-height: 2.3rem;
        border: 1px;
        border-bottom-left-radius: 0.25rem;
    }
    .confrims{
        float: left;
        @include sc(.8rem, #fff);
        font-weight: bold;
        margin-top: .3rem;
        background-color: rgb(221, 49, 49);
        width: 50%;
        text-align: center;
        line-height: 2.3rem;
        border: 1px;
        border-bottom-right-radius: 0.25rem;
    }

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
        .setname-input{
            border-color:rgb(221, 49, 49);
        }
    }
    .unlikep{
            @include sc(.58rem,rgb(221, 49, 49));
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
</style>