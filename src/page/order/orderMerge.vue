 <template>
	<div class="order_page">
        <head-top head-title="注文をまとめる" go-back='true'></head-top>
        <section class="order_list_ul">
            <el-input
                @keyup.enter.native="onSearch"
                placeholder="注文番号を入力"
                prefix-icon="el-icon-search"
                v-model="order_id">
            </el-input>
        </section>
        <section class="confrim_order2">
            <img v-if="checkboxflag" @click="checkbox_click1(false)" :src="GLOBAL.defaults.choose" class="imgCheck1">
            <img v-else @click="checkbox_click1(true)" :src="GLOBAL.defaults.unchoose" class="imgCheck1">
            <p>全て選択</p>
        </section>
        <section class="order_list_ul">
            <ul class="">
                <li class="order_list_li" v-for="(item,index) in tblst" :key="item.id">
                    <section class="order_item_right">
                        <section class="order_basket">
                            <span class="order_name">注文番号 {{item.id}}</span>
                        <img v-if="item.checked" @click="checkbox_click2(index)" :src="GLOBAL.defaults.choose" class="imgCheck2">
                        <img v-else @click="checkbox_click2(index)" :src="GLOBAL.defaults.unchoose" class="imgCheck2">

                        </section>
                    </section>
                </li>
            </ul>
        </section>
        <section class="coverpart" v-if="showCover">
            <div class="alet_container">
                <section class="cover-background"></section>
            </div>
        </section>
        <section class="coverparts" v-if="showSelect">
            <div class="alet_containers">
                <section class="cover-backgrounds"></section>
                <section class="cover-contents">
                    <div class="sa-icons">
                        <img :src='GLOBAL.defaults.infoico'>
                    </div>
                    <h2>注文をまとめる</h2>
                    <div class="sa-bottons">
                        <div class="confrim" @click="waitingThing">キャンセル</div>
                        <div class="confrims" @click="select">確認</div>
                    </div>
                </section>
            </div>
        </section>  
        <section class="confrim_order">
                <p @click="confrim">まとめる</p>
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
    import loading from 'src/components/common/loading'
    import footGuide from 'src/components/footer/footGuide'
    import {getOpenShop, getTodayAndYesterdayOrderListByTableId, mergeOrder} from 'src/service/getData'
    import {loadMore} from 'src/components/common/mixin'
    import {getStore, setStore} from 'src/config/mUtils'
    import alertTip from 'src/components/common/alertTip'
    import dtime from 'time-formater'

    export default {
      data(){
            return{
                orderList:      null,
                tblst:          [],
                showLoading:    true,
                showCover:      false,
                showSelect:     false,
                showAlert:      false,
                alertText:      null,
                user_id:        null,
                shopDetailData: null,
                order_id:       null,
                name_list:      [],
                quantity_list:  [],
                price_list:     [],
                discount_list:  [],
                orderPrintId:   '',
		checkboxflag:   false
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
            alertTip,
        },
        computed: {
            ...mapState([
                'userInfo'
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
                this.shopOpenList = await getOpenShop(this.user_id)
                var tbl_id_lst = getStore('tbl_id_lst')
                if(this.shopOpenList.length > 0){
                    let res = await getTodayAndYesterdayOrderListByTableId(this.shopOpenList[0].id, tbl_id_lst, this.tmp_datetime, 0, 20)
                    this.orderList = [...res];
                    if(this.orderList[0] == null){
                        //this.show=true;
                    } else {
                        //this.show=false;
                    }
                }
                var tbl_id_lst_check = []
                for (var i = 0; i < this.orderList.length; i++) {
                    if(tbl_id_lst_check.indexOf(this.orderList[i].user_id) == -1){
                        tbl_id_lst_check.push(this.orderList[i].user_id);
                    }
                    this.tblst.push(
                        {
                            id:this.orderList[i].unique_id,
                            basket:this.orderList[i].basket,
                            checked:false
                        }
                    )
                }
                setStore('tbl_id_lst', tbl_id_lst_check);
                this.hideLoading()
            },
            async checked(check_value){
                for (var i = 0; i < this.tblst.length; i++) {
                    this.tblst[i].checked = check_value
                }
            },
            async select(){
                this.showSelect = false
                this.showCover = true
                this.showLoading = true
                var select_lst = []
                var name_list_tmp = []
                var quantity_list_tmp = []
                var price_list_tmp = []
                var discount_list_tmp = []
                for (var i = 0;i < this.tblst.length; i++) {
                    if(this.tblst[i].checked == true){
                        select_lst.push(i)
                    }
                }
                if(select_lst.length > 1) {
                    for (var i = 0;i < select_lst.length; i++) {
                        for (var j = 0;j < this.tblst[select_lst[i]].basket.group[0].length; j++) {
                            name_list_tmp.push(this.tblst[select_lst[i]].basket.group[0][j].name)
                            quantity_list_tmp.push(this.tblst[select_lst[i]].basket.group[0][j].quantity)
                            price_list_tmp.push(this.tblst[select_lst[i]].basket.group[0][j].price)
                            discount_list_tmp.push(this.tblst[select_lst[i]].basket.group[0][j].discount)
                        }
                        this.orderPrintId += this.tblst[select_lst[i]].id + ", "
                    }
                    this.orderPrintId = this.orderPrintId.substring(0, this.orderPrintId.length - 2)
                    // 相同菜合并
                    for (var i = 0;i < name_list_tmp.length; i++) {
                        if(discount_list_tmp[i] > 0 && discount_list_tmp[i] < 1 ){
                            var index = this.name_list.indexOf(name_list_tmp[i]+"(" + discount_list_tmp[i]*100 + "% OFF)")
                            if(index < 0) {
                                this.name_list.push(name_list_tmp[i] + "(" + discount_list_tmp[i]*100 + "% OFF)")
                                this.quantity_list.push(quantity_list_tmp[i])
                                this.price_list.push(price_list_tmp[i])
                            } else {
                                this.quantity_list[index] += quantity_list_tmp[i]
                            }
                        } else {
                            var index = this.name_list.indexOf(name_list_tmp[i])
                            if(index < 0) {
                                this.name_list.push(name_list_tmp[i])
                                this.quantity_list.push(quantity_list_tmp[i])
                                this.price_list.push(price_list_tmp[i])
                            } else {
                                this.quantity_list[index] += quantity_list_tmp[i]
                            }
                        }

                    }

                    let newArr = []
                    let total_amount = 0
                    for(var i=0; i<this.name_list.length; i++){
                        newArr.push({
                            name: this.name_list[i],
                            price: this.price_list[i],
                            quantity: this.quantity_list[i]
                        })
                        total_amount += this.price_list[i] * this.quantity_list[i]
                    }
                    var data = {
                        user_id:                getStore('tbl_id_lst'),
                        total_amount:           total_amount,
                        restaurant_id:          getStore('shopid'),
                        entities:               [newArr],
                        restaurant_name:        getStore('shop_name'),
                        order_id:               this.orderPrintId
                    }
                    let orderRes = await mergeOrder(data);
                    if(orderRes.status == 0){
                        this.showPrint = true;
                        this.alertText = orderRes.message
                        return
                    }
                    this.$router.push({path: '/orderMain'});
                } else if(select_lst.length == 1) {
                    this.alertText = '二つ以上を選択してください';
                } else {
                    this.alertText = '未選択';
                }
                this.showAlert = true;
                this.hideLoading();
                this.showCover = false;
            },
            hideLoading(){
                this.showLoading = false
            },
            confrim(){
                this.showSelect = true
            },
            waitingThing(){
                this.showSelect = false
            },
            async closeTip(){
                this.showAlert = false;
            },
            onSearch(){
                var if_find = false
                var find_index = -1
                for (var i = 0;i < this.tblst.length; i++) {
                    if(this.order_id == this.tblst[i].id){
                        if_find = true
                        find_index = i
                        break
                    }
                }
                if(if_find == true){
                    this.tblst[find_index] = this.tblst.splice(0, 1, this.tblst[find_index])[0];
                } else {
                    this.showAlert = true;
                    this.alertText = "注文番号がありません"
                }
            },
            checkbox_click2(i){
                this.tblst[i].checked = !this.tblst[i].checked;
            },
            checkbox_click1(value){
                this.checkboxflag = !this.checkboxflag
                for (var i = 0;i < this.tblst.length; i++) {
                    this.tblst[i].checked = value;
                    
                }
            },
        },
        watch: {
            userInfo: function (value) {
                if (value && value.user_id) {
                    this.initData()
                }
            }
        }
    }
</script>
  
<style lang="scss" scoped>
    @import 'src/style/mixin';
    @keyframes tipMove{
       0%   { transform: scale(1) }
       35%  { transform: scale(.8) }
       70%  { transform: scale(1.1) }
       100% { transform: scale(1) }
    }

    .inputCheck+label {
        margin-top:.15rem;
        // background-color: white;
        border-radius: 5px;
        border:1px solid #d3d3d3;
        width:.77rem;
        height:.75rem;
        // display: inline-block;
        text-align: center;
        vertical-align: middle;
        line-height: .75rem;
        outline: none;
        // display: none;
    }
    .inputCheck:checked+label {
        background-color: #eee;
        display: inline-block;
    }
    
    .inputCheck:checked+label:after {
        content: "\2714";
    }

    .confrim_order{
        display: flex;
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 2rem;
        p{
            line-height: 2rem;
            @include sc(.75rem, rgb(255, 255, 255));
        }
        p:nth-of-type(1){
            flex: 2;
            background-color: rgb(221, 49, 49);
            text-align: center;
            border-right:1px solid #f1f1f1;
        }
    }

    .confrim_order2{
        display: flex;
        position: fixed;
        padding-top: rem;
        top: 5.95rem;
        // padding-top: 1rem;
        width: 100%;
        height: 2rem;
        p{
            line-height: 2rem;
            @include sc(.75rem, rgb(0, 0, 0));
            font-weight: 600;
        }
        p:nth-of-type(1){
            flex: 2;
            background-color: #fafafa;
            // text-align: center;
            border-right:1px solid #f1f1f1;
        }
    }

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
            @include borderRadius(5px);
            .sa-icon{
                text-align:center;
            }
            .psizes{
                margin-left: .5rem;
                margin-right: .5rem;
                font-size:10px
            }
            .confrim{
                @include sc(.8rem, #fff);
                font-weight: bold;
                margin-top: .8rem;
                background-color: rgb(221, 49, 49);
                width:100%;
                text-align:center;
                line-height: 1.8rem;
                border: 1px;
                border-bottom-left-radius: 0.25rem;
                border-bottom-right-radius: 0.25rem;
            }

        }
    }

    .coverparts{
        @include wh(100%,100%);
        @include allcover;
        .cover-backgrounds{
            @include wh(100%,100%);
            @include allcover;
            background:#000;
            z-index:100;
            opacity:.2;
        }
        .alet_containers{
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 200;
        }
        .cover-contents{
            width:90%;
            background:$fc;
            position:absolute;
            top:20%;
            left:5%;
            z-index:1000;
            @include borderRadius(7px);
            .sa-icons{
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
            .sa-bottons{
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
    
    .order_page{
        background-color: #f1f1f1;
        margin-bottom: 1.95rem;
        p, span, h4{
            font-family: Helvetica Neue,Tahoma,Arial;
        }
    }
    .order_list_ul{
        padding-top: 3.2rem;
        .order_list_li{
            @include sc(.7rem,#333);
            background-color: #fff;
            margin-top: 0.5rem;
            margin-bottom: 0.5rem;
            padding: .5rem .5rem 0;
            .order_item_right{
                flex: 5;
                .order_item_right_header{
                    border-bottom: 0.025rem solid #f5f5f5;
                    padding-bottom: .3rem;
                    @include fj;
                }
                .order_basket{
                    @include fj;
                    line-height: 1.3rem;
                    border-bottom: 0.025rem solid #f5f5f5;
                    .order_name{
                        width: 12rem;
                    }
                    .order_amount{
                        @include sc(.6rem, #f60);
                        font-weight: bold;
                    }
                    .order_amounts{
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
    .imgCheck1{
        background-color: #fafafa;
        padding: .5rem .5rem .5rem;
        width: 1.1rem;
        height: 1.1rem;
    }
    .imgCheck2{
        width: 1.1rem;
        height: 1.1rem;
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
</style>
