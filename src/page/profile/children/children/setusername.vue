 <template>
    <div class="rating_page">
        <head-top head-title="ユーザー名の変更" go-back='true'></head-top>
        <form class="restForm">
            <section class="input_container phone_number">
                <input type="text" placeholder="ユーザー名を入力してください" :class="{'setname-input':bordercolor}" @input="inputThing" v-model="inputValue"> 
            </section>
        </form>
        <div>
            <p v-if="earn" class="unlikep">ユーザー名のサイズは1から24まで。</p>
        </div>
        <section class="confrim_order">
            <div :class="{fontopacity:opacityall}" @click="resetName">確認</div>
        </section>
        <alert-tip v-if="showAlert"  @closeTip="closeTip" :alertText="alertText"></alert-tip>
    </div>
</template>

<script>
    import headTop from 'src/components/header/head'
    import {mapMutations,mapState} from 'vuex'
    import {updateUserName} from 'src/service/getData'
    import {getStore} from 'src/config/mUtils'
    import alertTip from 'src/components/common/alertTip'

    export default {
      data(){
            return{
                earn: false,     //输入框提醒
                bordercolor: false,  //输入框边框颜色
                opacityall: false,   //字体透明度
                inputValue: '',       //输入框的内容
                newusername: '',         //新用户名
                user_id: null,
                showAlert: false,
                alertText: null,
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
            alertTip
        },
        mounted(){

        },
        computed:{
            ...mapState([
                'userInfo'
            ])
        },
        props:[],
        methods: {
            ...mapMutations([
                'RETSET_NAME'
            ]),
            inputThing(){
                if(this.inputValue.length == 0){
                    this.earn=false;
                    return
                }
                if(this.inputValue.length < 1 || this.inputValue.length > 24){
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
            async resetName(){
                let checkResult = this.inputThing();
                if (!checkResult) {
                  return;
                } 

                this.user_id = getStore('user_id')
                const params = {
                    user_id: this.user_id,
                    username: this.inputValue,
                }
                try{
                    const result = await updateUserName(params);
                    if (result.status == 1) {
                        this.RETSET_NAME(this.inputValue);
                        this.showAlert = true;
                        this.alertText = '変更成功';
                    }
                    else{
                        this.showAlert = true;
                        this.alertText = '変更失敗';
                    }
                }catch(err){
                    console.log(err)
                }
            },
            closeTip() {
                this.showAlert = false;
                if(this.alertText == '変更成功'){
                    this.$router.go(-1);
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import 'src/style/mixin';

    .rating_page{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 202;
        background:#f2f2f2;
        padding-top: 1.95rem;
        p, span{
            font-family: Helvetica Neue,Tahoma,Arial;
        }
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
