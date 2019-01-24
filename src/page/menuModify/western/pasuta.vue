 <template>
	<div class="order_page">
        <head-top head-title="洋食・パスタ" go-back='true'></head-top>
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
                        <section @click="showDetail(item)">
                            <img :src="imgBaseUrl + 'western/' + item.image_path" class="order_amount"/>
                        </section>
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
        <section class="coverparts" v-if="addShow">
            <div class="alet_containers">
                <section class="cover-backgrounds"></section>
                <section class="cover-contents">
                    <div class="sa-icons">
                        <img :src='GLOBAL.defaults.infoico'>
                    </div>
                    <h2>追加を確認する</h2>
                    <div class="sa-bottons">
                        <div class="confrim" @click="waitingThing">キャンセル</div>
                        <div class="confrims" @click="add">確認</div>
                    </div>
                </section>
            </div>
        </section>  
        <section class="confrim_order">
                <p @click="confrim">追加</p>
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
    import {defaultFoodList, getMenu, addCategory, addFoods} from 'src/service/getData'
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
                coverShow:false,   //显示不可操作背景
                addShow: false,    //显示追加确认框
                show: false,       //显示菜品详细内容
                qriouslyimgs: null,
                shopid: null,
                showAlert: false,
                alertText: null,
                user_id: null,
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
            this.lot_manage_category_type = getStore('lot_manage_category_type')
            this.lot_manage_category_name = getStore('lot_manage_category_name')
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
                this.tablelist = await defaultFoodList("洋食", "パスタ");
                for (var i = 0;i < this.tablelist.length; i++) {
                    var id = i;
                    var checked = false;
                    this.footList.push(
                        {
                            id:         id,
                            type:       this.tablelist[i].type,
                            category:   this.tablelist[i].category,
                            name:       this.tablelist[i].name,
                            image_path: this.tablelist[i].image_path,
                            description:this.tablelist[i].description,
                            price:      this.tablelist[i].price,
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
                this.qriouslyimgs=imgBaseUrl + 'western/' + item.image_path;
            },
            //确认
            async outLogin(){
                this.show = false;
            },
            //取消
            async cancel(){
                for (var i = 0;i < this.tablelist.length; i++) {
                    this.footList[i].checked=false;
                }
            },
            //全选
            async checkall(){
                for (var i = 0;i < this.tablelist.length; i++) {
                    this.footList[i].checked=true;
                }
            },
            //添加
            async add(){
                this.addShow = false;
                this.coverShow = true;
                this.showLoading = true;
                var menu_add = this.lot_manage_category_name
                var category_id = this.lot_manage_category_id
                var category_type = this.lot_manage_category_type
                var food_add = []

                    
                for (var i = 0;i < this.footList.length; i++) {
                    if(this.footList[i].checked == true) {
                        food_add.push(this.footList[i])
                    }
                }
                var food_add_params = []
                for (var i = 0;i < food_add.length; i++) {
                    var specsForm = {
                        name: food_add[i].name,
                        restaurant_id: food_add[i].price,
                        price: this.shopid,
                    }
        
                    var params = {
                        name: food_add[i].name,
                        description: food_add[i].description,
                        image_path: 'western/' + food_add[i].image_path,
                        price: food_add[i].price,
                        specs: [specsForm],
                        category_id: category_id,
                        category_type: category_type,
                        restaurant_id: this.shopid,
                    }
                    food_add_params.push(params);
                }
                try{
                    let res = await addFoods(food_add_params);
                    if (res.status == 999) {
                        this.showAlert = true;
                        this.alertText = res.message + " (" + "種類「" + res.category_info + '」の食べ物「' + res.info + "」)";
                    } else if (res.status >= 1) {
                        this.showAlert = true;
                        this.alertText = res.message;
                    }
                }catch (error) {
                    this.showAlert = true;
                    this.alertText = food_add[0].name + '追加失敗';
                    throw new Error(error);
                }

                this.hideLoading();
            },
            //生产环境与发布环境隐藏loading方式不同
            hideLoading(){
                this.showLoading = false;
            },
            //打印确认
            confrim(){
                this.addShow = true;
            },
            //打印取消
            waitingThing(){
                this.addShow = false;
            },
            closeTip(){
                this.showAlert = false;
                this.coverShow = false;
                this.$router.push({path: '/shop'});
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
                        height: 1rem;
                        width: 1rem;
                    }
                    .order_amounts{
                        @include sc(.6rem, #f60);
                        font-weight: bold;
                    }
                }
            }
        }
    }
    .order_amount_width{
        height: 10rem;
        width: 10rem;
    }

    .psizes{font-size:10px}

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
