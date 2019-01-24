 <template>
    <div class="order_page">
        <head-top head-title="利用規約" go-back='true'></head-top>
        <ul class="order_list_ul" v-load-more="loaderMore">
            <li class="order_list_li" v-for="(item, index) in agreementList" :key="index">
                <section class="order_item_right">
                        <section class="order_basket">
                            <p class="order_p">{{item.id}}.&#8194;</p>
                            <p class="order_amount">{{item.agreement}}</p>
                        </section>
                        <section class="order_basket">
                            <p class="order_amounts">{{item.content}}</p>
                        </section>
                </section>
            </li>
        </ul>
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
    import {getAgreement} from 'src/service/getData'
    import {loadMore} from 'src/components/common/mixin'
    import alertTip from 'src/components/common/alertTip'
    import {getStore} from 'src/config/mUtils'

    export default {
      data(){
            return{
                agreementList: [],
                preventRepeat: false,  //防止重复获取
                showLoading: true, //显示加载动画
                offset: 0,
                limit: 20, 
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
            this.initData();
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
            //初始化获取信息
            async initData(){
                let res = await getAgreement(this.offset,this.limit);
                for(var i=0; i<res.length; i++){
                    this.agreementList.push({id: i+1, agreement: res[i].agreement, content: res[i].content});
                }
                this.hideLoading();
            },
            //加载更多
            async loaderMore(){
                if (this.preventRepeat) {
                   return
                }
                this.preventRepeat = true;
                this.showLoading = true;
                this.offset += 20;
                //获取信息
                let res = await getAgreement(this.offset,this.limit);
                for(var i=0; i<res.length; i++){
                    this.agreementList.push({id: this.offset+i+1, agreement: res[i].agreement, content: res[i].content});
                }
                this.hideLoading();
                if (res.length < 20) {
                   return
                }
                this.preventRepeat = false;
            },
            //生产环境与发布环境隐藏loading方式不同
            hideLoading(){
                this.showLoading = false;
            },
        }
    }
</script>
  
<style lang="scss" scoped>
    @import 'src/style/mixin';
    
    .order_page{
        background-color: #f1f1f1;
    }
    .order_list_ul{
    padding-top: 2.35rem;
        .order_list_li{
            background-color: #fff;
            display: flex;
        margin-bottom: 0rem;
        padding: 0.6rem 0.6rem 0;
            .order_item_right{
                flex: 5;
                .order_basket{
                    background-color: #fff;
                    @include fj;
                    float: left;
                    line-height: 1.5rem;
                    .order_amount{
                    @include sc(0.7rem, #333);
                        font-weight: bold;
                    }
                    .order_amounts{
                    @include sc(0.6rem, #999);
                    border-bottom: 0.1rem solid #f5f5f5;
                        // font-weight: bold;
                    }
                    .order_p{
                    @include sc(0.7rem, #333);
                        font-weight: bold;
                    }
                }
            }
        }
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
</style>
