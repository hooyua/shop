 <template>
	<div class="order_page">
        <head-top :head-title="lot_manage_category_name" go-back='true'></head-top>
        <section class="confrim_order2">
            <img v-if="checkboxflag" @click="checkbox_click1(false)" :src="GLOBAL.defaults.choose" class="imgCheck1">
            <img v-else @click="checkbox_click1(true)" :src="GLOBAL.defaults.unchoose" class="imgCheck1">
            <p>全て選択</p>
        </section>
        <ul class="order_list_ul">
            <li class="order_list_li" v-for="(item,index) in footList" :key="item.id">
                <section class="order_item_right">
                    <section class="order_basket">
                        <span class="order_name">{{item.name}}</span>
                        <span style="color:green;font-size:.5rem;" v-if='item.sold_out' class="description_foodname">発売</span>
                        <span style="color:red;font-size:.5rem;" v-else class="description_foodname">売切</span>
                        <img v-if="item.checked" @click="checkbox_click2(index)" :src="GLOBAL.defaults.choose" class="imgCheck2">
                        <img v-else @click="checkbox_click2(index)" :src="GLOBAL.defaults.unchoose" class="imgCheck2">

                    </section>
                </section>
            </li>
        </ul>
        <section class="coverpart" v-if="coverShow">
            <div class="alet_container">
                <section class="cover-background"></section>
            </div>
        </section>
        <section class="coverpart" v-if="show">
            <div class="alet_container">
                <section class="cover-background"></section>
                <section class="cover-content">
                    <div class="sa-icon">
                        <img :src="qriouslyimgs" class="order_amount_width"/>
                    </div>
                    <p class="psizes">{{tmp_name}}</p>
                    <p class="psizes">価格：{{tmp_price}} 円（税込）</p>
                    <p class="psizes">&nbsp;</p>
                    <p class="psizes">{{tmp_description}}</p>
                    <div class="confrim" @click="outLogin">確認</div>
                </section>
            </div>
        </section>
        <section class="coverparts" v-if="delShow">
            <div class="alet_containers">
                <section class="cover-backgrounds"></section>
                <section class="cover-contents">
                    <div class="sa-icons">
                        <img :src='GLOBAL.defaults.infoico'>
                    </div>
                    <h2>削除を確認</h2>
                    <div class="sa-bottons">
                        <div class="confrim" @click="waitingThing">キャンセル</div>
                        <div class="confrims" @click="del">確認</div>
                    </div>
                </section>
            </div>
        </section>
        <section class="coverparts" v-if="putonShow">
            <div class="alet_containers">
                <section class="cover-backgrounds"></section>
                <section class="cover-contents">
                    <div class="sa-icons">
                        <img :src='GLOBAL.defaults.infoico'>
                    </div>
                    <h2>発売を確認する</h2>
                    <div class="sa-bottons">
                        <div class="confrim" @click="waitingThing">キャンセル</div>
                        <div class="confrims" @click="puton">確認</div>
                    </div>
                </section>
            </div>
        </section>
        <section class="coverparts" v-if="pulloffShow">
            <div class="alet_containers">
                <section class="cover-backgrounds"></section>
                <section class="cover-contents">
                    <div class="sa-icons">
                        <img :src='GLOBAL.defaults.infoico'>
                    </div>
                    <h2>売り切れを確認する</h2>
                    <div class="sa-bottons">
                        <div class="confrim" @click="waitingThing">キャンセル</div>
                        <div class="confrims" @click="pulloff">確認</div>
                    </div>
                </section>
            </div>
        </section>
        <section class="confrim_order">
                <p @click="putonconfirm">確認</p>
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
    import {getMenuDetail, getMenu, addCategory, deleteFoods, putonFoods} from 'src/service/getData'
    import {loadMore} from 'src/components/common/mixin'
    import {imgBaseUrl} from 'src/config/env'
    import {getStore} from 'src/config/mUtils'
    import alertTip from 'src/components/common/alertTip'

    export default {
      data(){
            return{
                footList: [], //QR列表
                showLoading: true, //显示加载动画
                imgBaseUrl,
                coverShow:false,        //显示不可操作背景
                delShow: false,         //显示删除确认框
                putonShow: false,       //显示上架确认框
                pulloffShow: false,     //显示下架确认框
                show: false,            //显示菜品详细内容
                qriouslyimgs: null,
                shopid: null,
                showAlert: false,
                alertText: null,
                user_id: null,
                lot_manage_category_id: null,
                lot_manage_category_name: null,
                tablelist: [],
                tmp_name: null,
                tmp_description: null,
                tmp_price: null,
		checkboxflag: false,
            }
        },
        created(){
            this.user_id = getStore('user_id')
            this.lot_manage_category_id = getStore('lot_manage_category_id')
            this.lot_manage_category_name = getStore('lot_manage_category_name') + "の発売"
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
             ...mapMutations([
               'SAVE_ORDER'
            ]),
            //初始化获取信息
            async initData(){
                this.shopid = getStore('shopid')
                this.tablelist = await getMenuDetail(this.lot_manage_category_id);
                for (var i = 0;i < this.tablelist.foods.length; i++) {
                    var checked = false;
                    this.footList.push(
                    {
                        id:         i + 1,
                        item_id:    this.tablelist.foods[i].item_id,
                        type:       this.tablelist.foods[i].type,
                        category:   this.tablelist.foods[i].category,
                        name:       this.tablelist.foods[i].name,
                        image_path: this.tablelist.foods[i].image_path,
                        description:this.tablelist.foods[i].description,
                        price:      this.tablelist.foods[i].specfoods[0].price,
                        sold_out:   this.tablelist.foods[i].specfoods[0].sold_out,
                        checked:    checked
                    });
                }
                this.hideLoading();
            },
            //显示QR详情
            showDetail(item){
                this.show = true;
                this.tmp_name = item.name;
                this.tmp_description = item.description;
                this.tmp_price = item.price;
                this.qriouslyimgs=imgBaseUrl + item.image_path;
            },
            //确认
            async outLogin(){
                this.show = false;
            },
            //取消
            async cancel(){
                for (var i = 0;i < this.tablelist.foods.length; i++) {
                    this.footList[i].checked=false;
                }
            },
            //全选
            async checkall(){
                for (var i = 0;i < this.tablelist.foods.length; i++) {
                    this.footList[i].checked=true;
                }
            },
            //删除
            async del(){
                this.delShow = false;
                this.coverShow = true;
                this.showLoading = true;

                var menu_del = []
                for (var i = 0;i < this.footList.length; i++) {
                    if(this.footList[i].checked == true) {
                        menu_del.push(this.footList[i])
                    }
                }
                //alert(JSON.stringify(menu_del))
                var menu_del_list = []
                for (var i = 0;i < menu_del.length; i++) {
                    var data = {
                        food_id:menu_del[i].item_id
                    };
                    //alert(data.get("food_id"))
                    menu_del_list.push(data)
                }
                //alert(JSON.stringify(menu_del_list))
                try{
                    const result = await deleteFoods(menu_del_list);
                    if (result.status == 1) {
                        this.showAlert = true;
                        this.alertText = '削除成功'
                    }
                    else{
                        this.showAlert = true;
                        this.alertText = '削除失敗'
                    }
                }catch(err){
                    console.log(err)
                }
                
                this.hideLoading();
            },
            //上架
            async puton(){
                this.putonShow = false;
                this.coverShow = true;
                this.showLoading = true;

                var menu_puton = []
                for (var i = 0;i < this.footList.length; i++) {
                    if(this.footList[i].checked == true) {
                        menu_puton.push(this.footList[i])
                    }
                }

                var menu_puton_list = []
                for (var i = 0;i < menu_puton.length; i++) {
                    var data = {
                        name:menu_puton[i].name,
                        price:menu_puton[i].price,
                        sold_out:true,
                        item_id:menu_puton[i].item_id,
                        category_id:this.lot_manage_category_id,
                    };
                    //alert(data.get("food_id"))
                    menu_puton_list.push(data)
                }

                try{
                    const result = await putonFoods(menu_puton_list);
                    if (result.status == 1) {
                        this.showAlert = true;
                        this.alertText = '発売成功'
                    }
                    else{
                        this.showAlert = true;
                        this.alertText = '発売失敗'
                    }
                }catch(err){
                    console.log(err)
                }

                this.hideLoading();
            },
            //下架
            async pulloff(){
                this.pulloffShow = false;
                this.coverShow = true;
                this.showLoading = true;

                var menu_puton = []
                for (var i = 0;i < this.footList.length; i++) {
                    if(this.footList[i].checked == true) {
                        menu_puton.push(this.footList[i])
                    }
                }

                var menu_puton_list = []
                for (var i = 0;i < menu_puton.length; i++) {
                    var data = {
                        name:menu_puton[i].name,
                        price:menu_puton[i].price,
                        sold_out:false,
                        item_id:menu_puton[i].item_id,
                        category_id:this.lot_manage_category_id,
                    };
                    //alert(data.get("food_id"))
                    menu_puton_list.push(data)
                }

                try{
                    const result = await putonFoods(menu_puton_list);
                    if (result.status == 1) {
                        this.showAlert = true;
                        this.alertText = '売り切れ成功'
                    }
                    else{
                        this.showAlert = true;
                        this.alertText = '売り切れ失敗'
                    }
                }catch(err){
                    console.log(err)
                }

                this.hideLoading();
            },
            //生产环境与发布环境隐藏loading方式不同
            hideLoading(){
                this.showLoading = false;
            },
            //删除确认
            delconfirm(){
                this.delShow = true;
            },
            //上架确认
            putonconfirm(){
                this.putonShow = true;
            },
            //下架确认
            pulloffconfirm(){
                this.pulloffShow = true;
            },
            //删除取消
            waitingThing(){
                this.delShow = false;
                this.putonShow = false;
                this.pulloffShow = false;
            },
            closeTip(){
                this.showAlert = false;
                this.coverShow = false;
                this.$router.go(-1);
            },
            checkbox_click2(i){
                this.footList[i].checked = !this.footList[i].checked;
            },
            checkbox_click1(value){
                this.checkboxflag = !this.checkboxflag
                for (var i = 0;i < this.footList.length; i++) {
                    this.footList[i].checked = value;
                    
                }
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
        top: 1.95rem;
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
                width: 100%;
                text-align: center;
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
</style>
