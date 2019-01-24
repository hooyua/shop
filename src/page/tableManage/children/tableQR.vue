 <template>
	<div class="order_page">
        <head-top head-title="QRコードの印刷" go-back='true'></head-top>
        <section class="confrim_order2">
            <img v-if="checkboxflag" @click="checkbox_click1(false)" :src="GLOBAL.defaults.choose" class="imgCheck1">
            <img v-else @click="checkbox_click1(true)" :src="GLOBAL.defaults.unchoose" class="imgCheck1">
            <p>全て選択</p>
        </section>
        <ul class="order_list_ul">
            <li class="order_list_li" v-for="(item,index) in QRList" :key="item.id">
                <section class="order_item_right">
                    <section class="order_basket">
                        <span class="order_name">テーブル {{item.id}}</span>
                        <section @click="showDetail(item)">
                            <qriously :value="item.QR" :size="fullWidth" class="order_amount"/>
                            <qriously :id="'qriously' + item.id" :value="item.QR" :size="fullWidths" class="order_amount" v-show="false"/>
                        </section>
                        <img v-if="item.checked" @click="checkbox_click2(index)" :src="GLOBAL.defaults.choose" class="imgCheck2">
                        <img v-else @click="checkbox_click2(index)" :src="GLOBAL.defaults.unchoose" class="imgCheck2">

                    </section>
                </section>
            </li>
        </ul>
        <section class="coverpart" v-if="shows">
            <div class="alet_container">
                <section class="cover-background"></section>
            </div>
        </section>
        <section class="coverpart" v-if="show">
            <div class="alet_container">
                <section class="cover-background"></section>
                <section class="cover-content">
                    <div class="sa-icon">
                    <img :src="qriouslyimgs">
                    </div>
                    <h2>テーブル {{QRs.id}}</h2>
                    <h2>QRコード長押しで写真を保存</h2>
                    <div class="confrim" @click="outLogin">確認</div>
                </section>
            </div>
        </section>
        <section class="coverparts" v-if="showss">
            <div class="alet_containers">
                <section class="cover-backgrounds"></section>
                <section class="cover-contents">
                    <div class="sa-icons">
                        <img :src='GLOBAL.defaults.infoico'>
                    </div>
                    <h2>印刷を確認</h2>
                    <div class="sa-bottons">
                        <div class="confrim" @click="waitingThing">キャンセル</div>
                        <div class="confrims" @click="printing">確認</div>
                    </div>
                </section>
            </div>
        </section>  
        <section class="confrim_order">
                <p @click="confrim">印刷する</p>
        </section>
        <alert-tip v-if="showAlert"  @closeTip="showAlert=false" :alertText="alertText"></alert-tip>
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
    import {getOrderList, printingQR, shopDetails, shopKey, shopTableList} from 'src/service/getData'
    import {loadMore} from 'src/components/common/mixin'
    import {imgBaseUrl} from 'src/config/env'
    import {getStore} from 'src/config/mUtils'
    import alertTip from 'src/components/common/alertTip'

    export default {
      data(){
            return{
                QRList: [], //QR列表
                offset: 0, 
                preventRepeat: false,  //防止重复获取
                showLoading: true, //显示加载动画
                imgBaseUrl,
                show:false,
                shows:false,
                QRs:null,
                qriouslyimgs: null,
                shopid: null,
                showAlert: false,
                alertText: null,
                shopDetailData: null,
                res: null,
                Failurelist: [],
                fullWidth: document.documentElement.clientWidth/13,
                fullWidths: document.documentElement.clientWidth/2,
                user_id: null,
                shopKey: null,
                tablelist: [],
                showss: false,
		checkboxflag: false,
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
               'SAVE_ORDER'
            ]),
            //初始化获取信息
            async initData(){
                this.shopid = getStore('shopid')
                this.shopDetailData = await shopDetails(this.shopid);
                this.shopKey = await shopKey(this.shopid);
                this.tablelist = await shopTableList(this.shopid, this.shopDetailData.table_num);
                for (var i = 1;i <= this.shopDetailData.table_num; i++) {
                    var id = i;
                    var QR = 'http://customer.qmenu.co.jp/shoplist/'+ this.shopKey.restaurant_key +'/'+ this.tablelist[i-1];
                    var checked = false;
                    this.QRList.push({id:id,QR:QR,checked:checked});
                }
                this.hideLoading();
            },
            //显示QR详情
            showDetail(item){
                this.show = true;
                this.QRs = item;
                let canvas = document.querySelector('#qriously'+ item.id +' canvas');
			    let imgSrc = canvas.toDataURL('image/png');
                this.qriouslyimgs=imgSrc;
            },
            //确认
            async outLogin(){
                this.show = false;
            },
            //取消
            async cancel(){
                for (var i = 0;i < this.shopDetailData.table_num; i++) {
                    this.QRList[i].checked=false;
                }
            },
            //全选
            async checkall(){
                for (var i = 0;i < this.shopDetailData.table_num; i++) {
                    this.QRList[i].checked=true;
                }
            },
            //打印
            async printing(){
                this.showss = false;
                this.shows = true;
                this.showLoading = true;
                let counter = 0;
                let Failuretext = null;
                for (var i = 0;i < this.shopDetailData.table_num; i++) {
                    if(this.QRList[i].checked == true){
                        this.res = await printingQR(this.QRList[i].QR, this.QRList[i].id, this.shopid);
                        if(this.res.status == 0){
                            this.showAlert = true;
                            this.alertText = '失敗';
                            this.hideLoading();
                            this.shows = false;
                            return
                        }
                        counter++;
                        if(this.res.status != 1){
                            this.Failurelist.push(this.QRList[i]);
                        }
                    }
                }
                if(counter == 0){
                    this.showAlert = true;
                    this.alertText = '印刷するQRコードを選択してください';
                    this.hideLoading();
                    this.shows = false;
                }
                else if(this.Failurelist.length == 0){
                    this.showAlert = true;
                    this.alertText = '印刷成功';
                    this.hideLoading();
                    this.shows = false;
                }
                else{
                    if(this.Failurelist.length == counter){
                        this.showAlert = true;
                        this.alertText = '印刷失敗';
                        this.hideLoading();
                        this.shows = false;
                    }
                    else{
                        if(this.Failurelist.length > 3){
                            for (var j = 0;j < 3; j++) {
                                Failuretext += 'テーブル '+ this.Failurelist[j].id +',';
                            }
                            Failuretext += 'など'+this.Failurelist.length+'個のQRコード印刷失敗';
                        }
                        else{
                            for (var p = 0;p < this.Failurelist.length; p++) {
                                Failuretext += 'テーブル '+ this.Failurelist[p].id +',';
                            }
                            Failuretext += '印刷失敗';
                        }
                        this.showAlert = true;
                        this.alertText = Failuretext;
                        this.hideLoading();
                        this.shows = false;
                    }
                }
            },
            //生产环境与发布环境隐藏loading方式不同
            hideLoading(){
                this.showLoading = false;
            },
            //打印确认
            confrim(){
                this.showss=true;
            },
            //打印取消
            waitingThing(){
                this.showss=false;
            },
            checkbox_click2(i){
                this.QRList[i].checked = !this.QRList[i].checked;
            },
            checkbox_click1(value){
                this.checkboxflag = !this.checkboxflag
                for (var i = 0;i < this.QRList.length; i++) {
                    this.QRList[i].checked = value;
                    
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
            padding-top: 1rem;
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
            h2{
                width:100%;
                text-align:center;
                @include sc(.7rem,#575757);
                font-weight:500;
                margin:5px 0;
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
