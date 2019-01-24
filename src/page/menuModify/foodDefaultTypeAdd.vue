 <template>
	<div class="order_page">
        <head-top head-title="デフォルトの種類を追加" go-back='true'></head-top>
        <ul class="order_list_ul">
            <li class="order_list_li" v-for="item in typeList" :key="item.id">
                <section class="order_item_right">
                    <section class="order_basket">
                        <span class="order_name">{{item.name}}</span>
                         <input type="checkbox" v-model="item.checked" class="inputCheck" :id="'checkbox' + item.id" v-show="false">
                         <label :for="'checkbox' + item.id"></label>
                    </section>
                </section>
            </li>
        </ul>
        <section class="coverpart" v-if="coverShow">
            <div class="alet_container">
                <section class="cover-background"></section>
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
                <p @click="cancel">取り消す</p>
                <p @click="checkall">全て選択</p>
                <p @click="confrim">追加</p>
        </section>
        <alert-tip v-if="showAlert"  @closeTip="showAlert=false;coverShow=false;" :alertText="alertText"></alert-tip>
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
    import {getMenu, addCategorys} from 'src/service/getData'
    import {loadMore} from 'src/components/common/mixin'
    import {getStore} from 'src/config/mUtils'
    import alertTip from 'src/components/common/alertTip'

    export default {
      data(){
            return{
                typeList: [
                    {id:1, name:"お弁当", checked:0},
                    {id:2, name:"おでん", checked:0},
                    {id:3, name:"中華料理・麺類", checked:0},
                    {id:4, name:"和食・麺類", checked:0},
                    {id:5, name:"洋食・麺類", checked:0},
                    {id:6, name:"揚げ物", checked:0},
                    {id:7, name:"お寿司", checked:0},
                    {id:8, name:"中華料理・まん", checked:0},
                    {id:9, name:"セブンカフェ", checked:0},
                    {id:10, name:"スープ", checked:0},
                    {id:11, name:"ホットスナック", checked:0},
                    {id:12, name:"天ぷら", checked:0},
                    {id:13, name:"炒め物", checked:0},
                    {id:14, name:"焼き物", checked:0},
                    {id:15, name:"刺身", checked:0},
                    {id:16, name:"煮物", checked:0},
                    {id:17, name:"ラーメン", checked:0},
                    {id:18, name:"味噌汁", checked:0},
                    {id:19, name:"お丼", checked:0},
                    {id:20, name:"飲み物お通し", checked:0},
                    {id:21, name:"酒類", checked:0},
                    {id:22, name:"嗜好飲料", checked:0},
                ], //预置种类列表
                showLoading: true, //显示加载动画
                coverShow:false,   //显示不可操作背景
                addShow: false,    //显示追加确认框
                shopid: null,
                showAlert: false,
                alertText: null,
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
            alertTip,
        },
        computed: {
            ...mapState([
                'userInfo'
            ]),
        },
        methods: {
             ...mapMutations([
            ]),
            //初始化获取信息
            async initData(){
                this.shopid = getStore('shopid')
                this.hideLoading();
            },
            //取消
            async cancel(){
                for (var i = 0;i < this.typeList.length; i++) {
                    this.typeList[i].checked=false;
                }
            },
            //全选
            async checkall(){
                for (var i = 0;i < this.typeList.length; i++) {
                    this.typeList[i].checked=true;
                }
            },
            //追加
            async add(){
                this.addShow = false;
                this.coverShow = true;
                this.showLoading = true;
                var menu_add = []
                var menu_exist = []
                for (var i = 0;i < this.typeList.length; i++) {
                    if(this.typeList[i].checked == true) {
                        menu_add.push(this.typeList[i])
                    }
                }
                var menu = await getMenu({restaurant_id: this.shopid, allMenu: true, time: new Date().getTime()});
                for (var menu_tmp in menu) {
                    for (var i = 0;i < menu_add.length; i++) {
                        if(menu_add[i].name == menu[menu_tmp].name){
                            menu_exist.push(menu_add[i].name) 
                        }
                    }
                }
                if (menu_exist.length > 0){
                    this.showAlert = true;
                    this.alertText = '下記の種類が名前重複です：';
                    for (var i = 0;i < menu_exist.length; i++) {
                        this.alertText += menu_exist[i] + "、"
                    }
                } else {
                    var addType_list = []
                    for (var i = 0;i < menu_add.length; i++) {
                        var params = {
                            name: menu_add[i].name,
                            description: menu_add[i].name,
                            restaurant_id: this.shopid,
                        }
                        addType_list.push(params)
                    }
                    try{
                        const result = await addCategorys(addType_list);
                        if (result.status == 1) {
                            this.showAlert = true;
                            this.alertText = '下記の種類を追加する：';
                            for (var i = 0;i < menu_add.length; i++) {
                                this.alertText += menu_add[i].name + "、"
                            }
                        }
                        else{
                            this.showAlert = true;
                            this.alertText = '追加失敗';
                        }
                    }catch(err){
                        console.log(err)
                    }
                }
                this.hideLoading();
            },
            //生产环境与发布环境隐藏loading方式不同
            hideLoading() {
                this.showLoading = false;
            },
            //打印确认
            confrim() {
                this.addShow = true;
            },
            //打印取消
            waitingThing() {
                this.addShow = false;
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
    .inputCheck+label {
        margin-top:.15rem;
        background-color: white;
        border-radius: 5px;
        border:1px solid #d3d3d3;
        width:.77rem;
        height:.75rem;
        display: inline-block;
        text-align: center;
        vertical-align: middle;
        line-height: .75rem;
    }
    .inputCheck:checked+label {
        background-color: #eee;
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
            @include sc(.75rem, #fff);
        }
        p:nth-of-type(1){
            flex: 2;
            background-color: #3190e8;
            text-align: center;
            border-right:1px solid #f1f1f1;
        }
        p:nth-of-type(2){
            flex: 2;
            background-color: #3190e8;
            text-align: center;
            border-right:1px solid #f1f1f1;
        }
        p:nth-of-type(3){
            flex: 2;
            background-color: #56d176;
            text-align: center;
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
            padding:17px;
            position:absolute;
            top:20%;
            left:5%;
            z-index:1000;
            @include borderRadius(5px);
            .sa-icon{
                text-align:center;
            }
            h2{
                width:100%;
                text-align:center;
                @include sc(.7rem,#575757);
                font-weight:500;
                margin:5px 0;
            }
            .sa-botton{
                width:100%;
                text-align:center;

                button{
                    display:inline-block;
                    padding:.4rem 1rem;
                    @include borderRadius(5px);
                    @include sc(.6rem,$fc);
                    letter-spacing:1px;
                    margin-top:26px;
                }
                .quitlogin{
                    background:#56d176;
                }
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
        padding-top: 1.95rem;
        .order_list_li{
            @include sc(.7rem,#333);
            background-color: #fff;
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
</style>
