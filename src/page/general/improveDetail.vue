 <template>
    <div class="order_page">
        <head-top head-title="改善要望状況" go-back='true'></head-top>
        <ul class="order_list_ul">
            <li class="order_list_li" v-for="(item, index) in improves" :key="index">
                <section class="order_item_right">
                    <section class="order_basket">
                        <p class="order_name">{{item.improve}}</p>
                    </section>
                    <section class="order_basket">
                        <p class="order_amount">{{item.answer}}</p>
                    </section>
                </section>
            </li>
        </ul>
        <transition name="router-slid" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
    import {mapState, mapMutations} from 'vuex'
    import headTop from 'src/components/header/head'
    import loading from 'src/components/common/loading'
    import {getStore} from 'src/config/mUtils'

    export default {
      data(){
            return{
                improves: [{
                    improve: null,
                    answer: null,
                }], //改善要望状況
                offset: 0,
                limit: 20, 
                user_id: null,
                shopOpenList: [],
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
        components: {
            headTop,
            loading,
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
                this.improves[0].improve = getStore('improve');
                this.improves[0].answer = getStore('answer');
            },
        },
    }
</script>
  
<style lang="scss" scoped>
    @import 'src/style/mixin';
    
    .order_page{
        background-color: #f1f1f1;
    }
    .order_list_ul{
    padding-top: 2.2rem;
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
                        font-weight: bold;
                    }
                    .order_amount{
                        @include sc(.6rem, #666);
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
