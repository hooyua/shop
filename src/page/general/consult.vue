 <template>
    <div class="order_page">
        <head-top head-title="お問い合わせ" go-back='true'></head-top>
        <form class="restForm">
            <section class="order_header">
                <section class="input_container">
                    <span class="order_times">サービスセンター</span>
                    <span class="order_time">+86-411-62633673</span>
                </section>
                <section class="input_container">
                    <span class="order_times">メールアドレス</span>
                    <span class="order_time">info@qmenu.co.jp</span>
                </section>
            </section>
        </form>
        <transition name="router-slid" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
    import headTop from 'src/components/header/head'
    import {getStore} from 'src/config/mUtils'

    export default {
      data(){
            return{
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
        components: {
            headTop,
        },
        computed: {

        },
        methods: {

        }
    }
</script>
  
<style lang="scss" scoped>
    @import 'src/style/mixin';
    
    .order_page{
        background-color: #f1f1f1;
    padding-top: 1.85rem;
    }
    .order_header{
    .input_container {
        background-color: #fff;
        border-bottom: 1px solid #f1f1f1;
        line-height: 2rem;
         .order_times{
            @include sc(0.6rem, rgb(102, 102, 102));
            padding-left: 0.8rem;
            // float: left;
        }
        .order_time{
            @include sc(0.6rem, rgb(3, 3, 3));
            padding-right: 0.8rem;
            float: right;
        }
    }               
}
    .restForm{
        background-color: #fff;
        margin-top: .6rem;
    }
</style>
