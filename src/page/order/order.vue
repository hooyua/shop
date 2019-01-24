 <template>
    <div class="order_page">
        <head-top head-title="注文リスト" go-back='true'></head-top>
        <section class="order_list_ul">
            <el-input
                @keyup.enter.native="onSearch"
                placeholder="注文番号を入力"
                prefix-icon="el-icon-search"
                v-model="order_id">
            </el-input>
        </section>
        <section class="order_list_null" v-if="show">
            <h4>まだ注文がありません</h4>
        </section>
        <ul class="order_list_ul" v-else v-load-more="loaderMore">
            <li class="order_list_li" v-for="item in orderList" :key="item.id">
                <img :src="imgBaseUrl + item.restaurant_image_url" class="restaurant_image">
                <section class="order_item_right">
                    <section @click="showDetail(item)">
                        <header class="order_item_right_header">
                            <section class="order_header">
                                <h4 >
                                    <span class="ellipsis">{{item.restaurant_name}} </span>
                                    <svg fill="#333" class="arrow_right">
                                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                                    </svg>
                                </h4>
                                <p class="order_time">注文時点：{{item.formatted_created_at}} 注文番号：{{item.id}}</p>
                            </section>
                        </header>
                        <section class="order_basket">
                            <p class="order_name ellipsis">{{item.basket.group[0][0].name}}{{item.basket.group[0].length > 1 ? ' と他の' + item.basket.group[0].length + '品の料理' : ''}}</p>
                            <p class="order_amount">{{item.total_amount}} 円</p>
                        </section>
                    </section>
                </section>
            </li>
        </ul>
        <foot-guide :homeStatus="false" :orderStatus="true" :moneyStatus="false" :profileStatus="false"></foot-guide>
        <transition name="loading">
            <loading v-show="showLoading"></loading>
        </transition>
        <transition name="router-slid" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import headTop from 'src/components/header/head'
    import computeTime from 'src/components/common/computeTime'
    import loading from 'src/components/common/loading'
    import footGuide from 'src/components/footer/footGuide'
    import {getOpenShop, getOrderList} from 'src/service/getData'
    import {loadMore} from 'src/components/common/mixin'
    import {imgBaseUrl} from 'src/config/env'
    import {getStore, setStore} from 'src/config/mUtils'
    import dtime from 'time-formater'

    export default {
      data(){
            return{
                orderList: null, //订单列表
                offset: 0,
                limit: 20, 
                preventRepeat: false,  //防止重复获取
                showLoading: true, //显示加载动画
                imgBaseUrl,
                user_id: null,
                shopOpenList: [],
                show: false,
                order_id:null,
                tmp_datetime:null
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
        },
        computed: {
            ...mapState([
                'userInfo',
            ]),
        },
        methods: {
            //初始化获取信息
            async initData(){
                var today = new Date()
                today = today.setDate(today.getDate() - 1)
                today = new Date(today)
                this.tmp_datetime = dtime(today).format('YYYY-MM-DD')
                this.user_id = getStore('user_id')
                this.shopOpenList = await getOpenShop(this.user_id);
                if(this.shopOpenList.length > 0){
                    setStore('shopid', this.shopOpenList[0].id)
                    let res = await getOrderList(this.shopOpenList[0].id, this.tmp_datetime, this.offset, this.limit, this.order_id);
                    this.orderList = [...res];
                    if(this.orderList[0] == null){
                        this.show=true;
                    } else {
                        this.show=false;
                    }
                }else{
                    setStore('shopid',null)
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
                this.offset += this.limit;
                //获取信息
                let res = await getOrderList(this.shopOpenList[0].id, this.tmp_datetime, this.offset, this.limit, this.order_id);
                this.orderList = [...this.orderList, ...res];
                this.hideLoading();
                if (res.length < this.limit) {
                   return
                }
                this.preventRepeat = false;
            },
            //显示详情页
            showDetail(item){
                setStore('orderDetail', item);
                this.preventRepeat = false;
                this.$router.push({path: '/orderDetail'});
            },
            //生产环境与发布环境隐藏loading方式不同
            hideLoading(){
                this.showLoading = false;
            },
            onSearch(){
                this.initData();
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
        // margin-bottom: 1.95rem;
        p, span, h4{
            font-family: Helvetica Neue,Tahoma,Arial;
        }
    }
    .order_list_null{
        background-color: #f5f5f5;
        padding-top: 9rem;
        text-align:center;
        opacity:.5;
    }
    .order_list_ul{
        padding-top: 1.95rem;
        .order_list_li{
            background-color: #fff;
            display: flex;
            margin-bottom: 0.5rem;
            padding: .6rem .6rem 0;
            .restaurant_image{
                @include wh(2rem, 2rem);
                margin-right: 0.4rem;
            }
            .order_item_right{
                flex: 5;
                .order_item_right_header{
                    border-bottom: 0.025rem solid #f5f5f5;
                    padding-bottom: .3rem;
                    @include fj;
                    .order_header{
                        h4{
                            display: flex;
                            align-items: center;
                            justify-content: flex-start;
                            @include sc(.75rem, #333);
                            line-height: 1rem;
                            width: 9rem;

                            .arrow_right{
                                @include wh(.4rem, .4rem);
                                fill: #ccc;
                                margin-right: .2rem;
                            }
                        }
                        .order_time{
                            @include sc(.55rem, #999);
                            line-height: .8rem;
                        }
                    }
                }
                .order_basket{
                    @include fj;
                    line-height: 2rem;
                    border-bottom: 0.025rem solid #f5f5f5;
                    .order_name{
                        @include sc(.6rem, #666);
                        width: 8.5rem;
                    }
                    .order_amount{
                        @include sc(.6rem, #f60);
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
    .tab {
        text-align: center;
        padding: 10px;
        margin: 5px 0;
        background-color: #F2F2F2;
        a {
            color: #7e8c8d;
        }
    }

    .home-container{
        width: 100%;

        .Header{
            background:linear-gradient(90deg, rgb(231, 86, 142), #ff696b);
            padding: 4vw;
            color: #fff;
            text-align: center;
        }
        .item-wrapper{
            display: flex;
            padding: 4vw;
        }
        .item-image{  
            width: 25vw;
        }
        .item-right{
            flex: 1;
            margin-left: 3vw;
            display: flex;
            justify-content: space-between;
            flex-direction: column;
            padding: 1vw 0;
        }
    }

</style>
