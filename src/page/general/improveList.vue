 <template>
    <div class="order_page">
        <head-top head-title="改善要望リスト" go-back='true'></head-top>
        <ul class="order_list_ul" v-load-more="loaderMore">
            <li class="order_list_li" v-for="item in improveList" :key="item.id">
                <section class="order_item_right">
                    <section @click="showDetail(item)">
                        <section class="order_basket">
                            <p class="order_name ellipsis">{{item.improve}}</p>
                            <span class="myorder-divsvg">
                                <svg fill="#bbb">
                                    <use
                                        xmlns:xlink="http://www.w3.org/1999/xlink"
                                        xlink:href="#arrow-right"
                                    ></use>
                                </svg>
                            </span>
                        </section>
                        <section class="order_basket">
                            <p class="order_amount ellipsis">{{item.answer}}</p>
                        </section>
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
    import {getImprove} from 'src/service/getData'
    import {loadMore} from 'src/components/common/mixin'
    import {getStore, setStore} from 'src/config/mUtils'

    export default {
      data(){
            return{
                improveList: null, //改善要望列表
                offset: 0,
                limit: 20, 
                preventRepeat: false,  //防止重复获取
                showLoading: true, //显示加载动画
                user_id: null,
                shopOpenList: [],
            }
        },
        created(){
            this.user_id = getStore('user_id')
            if(this.user_id == null){
                this.$router.push({path: '/login'});
            };
            this.initData();
        },
        mounted(){
            
        },
        mixins: [loadMore],
        components: {
            headTop,
            loading,
            computeTime,
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
                let res = await getImprove(this.user_id, this.offset, this.limit);
                this.improveList = [...res];
                this.hideLoading();
            },
            //加载更多
            async loaderMore(){
                if (this.preventRepeat) {
                   return
                }
                this.preventRepeat = true;
                this.showLoading = true;
                this.offset += this.limit;
                //获取信息
                let res = await getImprove(this.user_id, this.offset, this.limit);
                this.improveList = [...this.improveList, ...res];
                this.hideLoading();
                if (res.length < this.limit) {
                   return
                }
                this.preventRepeat = false;
            },
            //显示详情页
            showDetail(item){
                setStore('improve',item.improve);
                setStore('answer',item.answer);
                this.preventRepeat = false;
                this.$router.push('/improveDetail');
            },
            //生产环境与发布环境隐藏loading方式不同
            hideLoading(){
                this.showLoading = false;
            },
        },
        watch: {
            userInfo: function (value) {
                if (value && value.user_id && !this.orderList) {
                    this.initData();
                }
            }
        }
    }
</script>
  
<style lang="scss" scoped>
    @import 'src/style/mixin';
    
    .order_page{
        background-color: #f1f1f1;
    }
    .order_list_ul{
        padding-top: 1.95rem;
        .order_list_li{
            background-color: #fff;
            display: flex;
            margin-bottom: 0.5rem;
            padding: .6rem .6rem 0;
            .order_item_right{
                flex: 5;
                .order_basket{
                    @include fj;
                    line-height: 2rem;
                    border-bottom: 0.025rem solid #f5f5f5;
                    .order_name{
                        @include sc(.6rem, #333);
                        width: 13rem;
                        font-weight: bold;
                    }
                    .order_amount{
                        @include sc(.6rem, #666);
                        width: 13rem;
                    }
                }
	    }
            .myorder-divsvg {
                margin-left: -1rem;
                @include wh(0.6rem, 1rem);
                // @include wh(0.46667rem, 0.466667rem);
                svg {
                    @include wh(100%, 100%);
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
