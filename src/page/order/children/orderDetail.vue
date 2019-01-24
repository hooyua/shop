 <template>
  <div class="order_detail_page">
        <head-top head-title="注文状況" go-back='true'></head-top>
        <section class="food_list" v-if="!showLoading">
            <ul class="food_list_ul">
                <li v-for="(item, index) in name_list" :key="index">
                    <p class="food_name">{{item}}</p>
                    <el-input-number v-model="quantity_list[index]" @change="changeNum(index)" :min="0" :max="99" size="mini"></el-input-number>
                    <span class="span">単価：{{price_list[index]}} 円</span>
                    <span class="span">合計：{{totle_price_list[index]}} 円</span>
                </li>
            </ul>
        </section>
        <section class="confrim_order">
            <p @click="print(false)">キッチンプリンター印刷</p>
            <p @click="print(true)">レジプリンター印刷</p>
        </section>
        <alert-tip v-if="showPrint" @closeTip="closeTip" :alertText="alertText"></alert-tip>
        <transition name="loading">
            <loading v-if="showLoading"></loading>
        </transition>
    </div>
</template>

<script>
    import headTop from 'src/components/header/head'
    import loading from 'src/components/common/loading'
    import alertTip from 'src/components/common/alertTip'
    import {modifyOrder} from 'src/service/getData'
    import {getStore} from 'src/config/mUtils'

    export default {

      data(){
            return{
                showLoading: true,
                user_id: null,
                showPrint:false,
                alertText:null,
                name_list:[],
                quantity_list:[],
                price_list:[],
                discount_list:[],
                totle_price_list:[]
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
            alertTip,
            loading,
        },
        methods: {
            async initData(){
                this.orderDetail = eval('(' + getStore('orderDetail') + ')');
                for(var i=0; i<this.orderDetail.basket.group[0].length; i++){
                    this.name_list.push(this.orderDetail.basket.group[0][i].name)
                    this.quantity_list.push(this.orderDetail.basket.group[0][i].quantity)
                    this.price_list.push(this.orderDetail.basket.group[0][i].price)
                    this.discount_list.push(this.orderDetail.basket.group[0][i].discount)
                    this.totle_price_list.push(this.orderDetail.basket.group[0][i].quantity * this.orderDetail.basket.group[0][i].price)
                }
                this.showLoading = false;
            },
            changeNum(index){
                this.totle_price_list[index] = this.price_list[index] * this.quantity_list[index]
            },
            async print(print_flag){
                let newArr = []
                let total_amount = 0
                for(var i=0; i<this.name_list.length; i++){
                    if( this.quantity_list[i] != 0 ){
                        newArr.push({
                            name: this.name_list[i],
                            price: this.price_list[i],
                            quantity: this.quantity_list[i],
                            discount: this.discount_list[i]
                        })
                        total_amount += this.price_list[i] * this.quantity_list[i]
                    }
                }
                var data = {
                    user_id:                this.orderDetail.user_id,
                    total_amount:           total_amount,
                    restaurant_id:          getStore('shopid'),
                    entities:               [newArr],
                    restaurant_name:        getStore('shop_name'),
                    restaurant_image_url:   this.orderDetail.restaurant_image_url,
                    order_id:               this.orderDetail.id,
                    print:                  print_flag
                }
                let orderRes = await modifyOrder(data);
                if(orderRes.status == 0){
                    this.showPrint = true;
                    this.alertText = orderRes.message
                    return
                }
                this.$router.push({path: '/orderMain'});
            },
            closeTip(){
                this.showPrint = false;
            }
        },
    }
</script>
  
<style lang="scss" scoped>
    @import 'src/style/mixin';
    .order_detail_page {
        top:    0;
        left:   0;
        right:  0;
        bottom: 0;
        padding-top: 1.95rem;
    }
    .food_list {
        background-color: #fff;
        padding-bottom: 2rem;
        .food_list_ul {
            li {
                padding: 0 .5rem;
                line-height: 1.5rem;
            }
        }
    }
    .food_name {
        @include sc(.6rem, #666)
    }
    .span {
        @include sc(.6rem, #ccc)
    }
    .confrim_order{
        display: flex;
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 2rem;
        z-index: 999;
        p{
            line-height: 2rem;
            @include sc(.65rem, #fff);
        }
        p:nth-of-type(1){
            flex: 2;
            background-color: rgb(221, 49, 49);
            text-align: center;
            border-right:1px solid #f1f1f1;
        }
        p:nth-of-type(2){
            flex: 2;
            background-color: rgb(221, 49, 49);
            text-align: center;
            border-right:1px solid #f1f1f1;
        }
    }
</style>
