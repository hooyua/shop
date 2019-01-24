 <template>
    <div class="order_page">
        <head-top head-title="改善要望を追加" go-back='true'></head-top>
        <form class="restForm">
            <section class="input_container phone_number">
                <textarea type="text" placeholder="改善要望入力" v-model="inputImproveValue"></textarea>
            </section>
        </form>
        <section class="confrim_order">
            <p @click="addImprove">確認</p>
        </section>
        <alert-tip v-if="showAlert"  @closeTip="closeTip" :alertText="alertText"></alert-tip>
        <transition name="loading">
            <loading v-show="showLoading"></loading>
        </transition>
        <transition name="router-slid" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
    import {mapState, mapMutations} from 'vuex'
    import headTop from 'src/components/header/head'
    import computeTime from 'src/components/common/computeTime'
    import loading from 'src/components/common/loading'
    import footGuide from 'src/components/footer/footGuide'
    import {addImprove} from 'src/service/getData'
    import {loadMore} from 'src/components/common/mixin'
    import {getStore} from 'src/config/mUtils'
    import alertTip from 'src/components/common/alertTip'
    import dtime from 'time-formater'

    export default {
      data(){
            return{
                improveList: null, //改善要望列表
                preventRepeat: false,  //防止重复获取
                showLoading: false, //显示加载动画
                inputImproveValue: '',
                showAlert: false,
                alertText: null,
                offset: 0,
                limit: 20,
                answer: '未処理', 
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
        mixins: [loadMore],
        components: {
            headTop,
            footGuide,
            loading,
            computeTime,
            alertTip
        },
        computed: {
            ...mapState([
                'userInfo',
            ]),
        },
        methods: {
             ...mapMutations([
               'SAVE_ORDER'
            ]),
            async addImprove() {
                if (this.inputImproveValue !=''){
                    const params = {
                        improve: this.inputImproveValue,
                        answer: this.answer,
                        user_id: this.user_id,
                        submit_time: dtime().format('YYYY-MM-DD hh:mm:ss'),
                    }
                    try{
                        const result = await addImprove(params);
                        if (result.status == 1) {
                            //alert("success");
                            this.showAlert = true;
                            this.alertText = '追加成功';
                        }
                        else{
                            this.showAlert = true;
                            this.alertText = '追加失敗';
                        }
                    }catch(err){
                        console.log(err)
                    }
                }
                else{
                    this.showAlert = true;
                    this.alertText = '改善要望を入力してください！';
                }
            },
            closeTip() {
                this.showAlert = false;
                this.inputImproveValue = '';
            }
        }
    }
</script>
  
<style lang="scss" scoped>
    @import 'src/style/mixin';
    
    .order_page{
        background-color: #f1f1f1;
        padding-top: 1.95rem;
    }
    .restForm{
        background-color: #fff;
        margin-top: .6rem;
        .input_container{
            display: flex;
            justify-content: space-between;
            padding: .6rem .8rem;
            border-bottom: 1px solid #f1f1f1;
            textarea{
                @include sc(.7rem, #666);
                height: 7rem;
                width: 15rem;
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
            padding: .4rem .8rem;
        }
    }
    .login_container{
            margin: 1rem .5rem;
            @include sc(.7rem, #fff);
            background-color: #4cd964;
            padding: .5rem 0;
            border: 1px;
            border-radius: 0.15rem;
            text-align: center;
        }
    .loading-enter-active, .loading-leave-active {
        transition: opacity .7s
    }
    .loading-enter, .loading-leave-active {
        opacity: 0
    }
    .router-slid-enter-active, .router-slid-leave-active {
        transition: all .4s;
    }
    .router-slid-enter, .router-slid-leave-active {
        transform: translate3d(2rem, 0, 0);
        opacity: 0;
    }
//底部按钮
.confrim_order {
    display: flex;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 2rem;
    z-index: 999;
    p {
        line-height: 2rem;
        @include sc(0.75rem, #fff);
    }
    p:nth-of-type(1) {
        flex: 1;
        background-color: #da2020;
        text-align: center;
        border-right: 1px solid #f1f1f1;
    }
}
</style>
