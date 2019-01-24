 <template>
    <div>
        <section v-if="shop_exist === true && food_exist === true" class="shop_container">
            <header class="shop_detail_header" ref="shopheader" :style="{zIndex: '10'}">
                <section class="order_header">
                    <img :src="imgBaseUrl + shopDetailData.image_path" class="order_img">
                    <div class="order_font">	
                        <span class="order_shop">{{shopDetailData.name}}</span>
                    </div>
                    <div class="order_font">
                        <span class="order_phone">{{shopDetailData.phone}}</span>
                    </div>
                    <div class="order_font">
                        <span class="order_address">{{shopDetailData.address}}</span>
                    </div>	
                </section>
            </header>
            <transition name="fade-choose">
                <section class="food_container">
                    <section class="menu_container">
                        <section class="menu_left" id="wrapper_menu" ref="wrapperMenu">
                            <ul>
                                <li v-for="(item,index) in menuList" :key="index" class="menu_left_li" :class="{activity_menu: index == menuIndex}" @click="chooseMenu(index)">
                                    <span>{{item.name}}</span>
                                </li>
                                
                                <li class="menu_left_li_ext">
                                    <section @click="typeManage">
                                        <span>種類追加</span>
                                    </section>
                                </li>                                
                            </ul>
                        </section>
                        <section class="menu_right" ref="menuFoodList">
                            <ul>
                                <li v-for="(item,index) in menuList" :key="index">
                                    <header class="menu_detail_header">
                                        <section class="menu_detail_header_left">
                                            <span class="menu_item_title">{{item.name}}</span>
                                            <el-popover
                                            placement="bottom"
                                            class="popover" 
                                            hide-on-click=true
                                            width="10"
                                            v-model="item.visible"
                                            trigger="click">
                                                <el-dropdown-item @click.native="lot1(index)">一括処理</el-dropdown-item>
                                                <el-dropdown-item @click.native="updateCategory(index)">名前変更</el-dropdown-item>
                                                <el-dropdown-item @click.native="deleteCategory(index)">種類削除</el-dropdown-item>
                                                <el-dropdown-item @click.native="add(index)">料理追加</el-dropdown-item>
                                                <el-button slot="reference">編集</el-button>
                                            </el-popover>
                                        </section>
                                    </header>
                                    <section v-for="(foods,foodindex) in item.foods" :key="foodindex" class="menu_detail_list">
                                        <section class="menu_detail_link">
                                            <section class="menu_food_img">
                                                <img :src="imgBaseUrl + foods.image_path">
                                            </section>
                                            <section class="menu_food_description">
                                                <h3 class="food_description_head">
                                                    <strong style="font-size:.5rem;" class="description_foodname">{{foods.name}}</strong>
                                                </h3>

                                                <h3 class="food_description_head">
                                                    <span style="color:green;font-size:.5rem;" v-if='foods.specfoods[0].sold_out' class="description_foodname">発売</span>
                                                    <span style="color:red;font-size:.5rem;" v-else class="description_foodname">売切</span>

                                                    <span style="color:grey;font-size:.5rem;" class="description_foodname">￥{{foods.specfoods[0].price}}円</span>

                                                    <span style="color:grey;font-size:.5rem;" v-if="foods.discount == 1" class="description_foodname">割引率：なし</span>
                                                    <span style="color:grey;font-size:.5rem;" v-else class="description_foodname">割引率：{{foods.discount*100}}%</span>
                                                </h3>
                                            </section>
                                        </section>
                                        <section class="food_description_head">
                                            <img :src='GLOBAL.defaults.edit' @click="linkfoodDetail(foods.image_path, foods.name, foods.specfoods[0].price, foods.item_id, foods.category_id, foods.description, foods.discount, foods.specfoods[0].sold_out)" class="icon_style2">
                                            <img :src='GLOBAL.defaults.trash' @click="deleteFood(foods.item_id)" class="icon_style1">
                                        </section>
                                    </section>
                                </li>
                            </ul>
                        </section>
                    </section>
                </section>
            </transition>
        </section>
        <section v-if="shop_exist === true && food_exist === false" class="shop_container">
            <header class="shop_detail_header" ref="shopheader" :style="{zIndex: '10'}">
                <img src="" class="header_cover_img">
                <section class="description_header">
                    <router-link to="" class="description_top">
                        <section class="description_right">
                            <h4 class="description_title ellipsis">説明</h4>
                        </section>
                    </router-link>
                </section>
            </header>
            <transition name="fade-choose">
                <section class="food_container">
                    <section class="menu_container">
                        <section class="menu_left" id="wrapper_menu" ref="wrapperMenu">
                            <ul>
                                <li class="menu_left_li_ext">
                                    <section @click="typeManage">
                                        <span>種類追加</span>
                                    </section>
                                </li>                                
                            </ul>
                        </section>
                        <section class="menu_right" ref="menuFoodList">
                            <ul>
                                <li>
                                    <header class="menu_detail_header">
                                        <section class="menu_detail_header_left">
                                            <strong class="menu_item_title">新規種類を追加してください。</strong>
                                        </section>
                                    </header>
                                </li>
                            </ul>
                        </section>
                    </section>
                </section>
            </transition>
        </section>
        <section v-if="shop_exist === false" class="shop_container">
            <header class="shop_detail_header" ref="shopheader" :style="{zIndex: '10'}">
                <img src="" class="header_cover_img">
                <section class="description_header">
                    <router-link to="" class="description_top">
                        <section class="description_right">
                            <h4 class="description_title ellipsis">説明</h4>
                        </section>
                    </router-link>
                </section>
            </header>
            <strong class="description_foodname">店舗はありません！</strong>
            <strong class="description_foodname">下記の開店案内により、</strong>
            <strong class="description_foodname">新規店舗を申し込んでください。</strong>
            <strong class="description_foodname">本人  ->  店舗の管理  ->  新規店舗お申し込み</strong>
        </section>
        <section class="coverpart" v-if="show">
            <div class="alet_container">
                <section class="cover-background"></section>
                <section class="cover-content">
                    <div class="sa-icon">
                        <img :src='GLOBAL.defaults.infoico'>
                    </div>
                    <h2>削除の確認</h2>
                    <div class="sa-botton">
                        <div class="confrim"  @click="waitingThing">キャンセル</div>
                        <div class="confrims"  @click="deleteFoods">確認</div>
                    </div>
                </section>
            </div>
        </section>
        <section class="coverpart" v-if="shows">
            <div class="alet_container">
                <section class="cover-backgrounds"></section>
                <section class="cover-content">
                    <div class="sa-icon">
                        <img :src='GLOBAL.defaults.infoico'>
                    </div>
                    <h2>削除の確認</h2>
                    <div class="sa-botton">
                        <div class="confrim"  @click="waitingThing">キャンセル</div>
                        <div class="confrims"  @click="deleteCategorys">確認</div>
                    </div>
                </section>
            </div>
        </section>
        <section class="coverpart" v-if="if_have_food">
            <div class="alet_container">
                <section class="cover-backgrounds"></section>
                <section class="cover-content">
                    <div class="sa-icon">
                        <img :src='GLOBAL.defaults.infoico'>
                    </div>
                    <h2>{{lot_manage_category_name}}の料理をすべて削除</h2>
                    <div class="sa-botton">
                        <div class="confrim"  @click="waitingThing">キャンセル</div>
                        <div class="confrims"  @click="deleteCategorysWithFood">確認</div>
                    </div>
                </section>
            </div>
        </section>
        <section class="coverpart" v-if="modify_show">
            <div class="alet_container">
                <section class="cover-background"></section>
                <section class="cover-content">
                    <h2>種類名前変更</h2>
                    <section class="detail_container">
                        <input type="text" :placeholder="name" maxlength="10" v-model="modifyValue">
                    </section>
                    <div class="sa-botton">
                        <div class="confrim"  @click="waitingThing">キャンセル  </div>
                        <div class="confrims"  @click="modify(modifyValue)">確認</div>
                    </div>
                </section>
            </div>
        </section>
        <transition name="router-slid" mode="out-in">
            <router-view :key="activeDate"></router-view>
        </transition>
        <foot-guide :homeStatus="true" :orderStatus="false" :moneyStatus="false" :profileStatus="false"></foot-guide>
    </div>
</template>

<script>
    import {mapState, mapMutations} from 'vuex'
    import {shopDetails, foodMenu, getOpenShop, getMenu, getMenuDetail, deleteCategory, deleteFoods, updateCategory} from 'src/service/getData'
    import loading from 'src/components/common/loading'
    import {imgBaseUrl} from 'src/config/env'
    import BScroll from 'better-scroll'
    import footGuide from 'src/components/footer/footGuide'
    import {getStore, setStore} from 'src/config/mUtils'

    export default {
        data(){
            return{
                restaurant_id: null, //商店id值
                showLoading: true, //显示加载动画
                shopDetailData: {
                    name: null,
                    image_path: null,
		        }, //商铺详情
                menuList: [], //食品列表
                menuIndex: 0, //已选菜单索引值，默认为0
                menuIndexChange: true,//解决选中index时，scroll监听事件重复判断设置index的bug
                shopListTop: [], //商品列表的高度集合
                foodScroll: null,  //食品列表scroll
                imgBaseUrl,
                activeDate: null,
                user_id: null,
                shop_exist: true,
                food_exist: true,
                show:false,
                shows:false,
                if_have_food:false,
                modify_show:false,
                food_del_list:[],
                modifyValue: '',
                name: null,
                menu:[],
                lot_manage_category_name: null
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
        beforeDestroy(){
        },
        components: {
            loading,
            footGuide,
        },
        computed: {
            ...mapState([
            ]),
        },
        methods: {
            ...mapMutations([
            ]),
            //初始化时获取基本数据
            async initData(){
                this.menu = await getMenu({restaurant_id: this.restaurant_id, allMenu: true, time: new Date().getTime()});
                this.restaurant_id = getStore('shopid');
                if(this.restaurant_id != 'null'){
                    this.shopDetailData = await shopDetails(this.restaurant_id);
                    setStore('shop_name',this.shopDetailData.name);
                    if(this.shopDetailData.state == '认证中'){
                        this.shop_exist = false;
                    }else{
                        this.menuList = await foodMenu(this.restaurant_id);
                        if(this.menuList==''){
                            this.food_exist = false;
                        } else {
                            var tmp_list = await getMenu({restaurant_id: this.restaurant_id, allMenu: true, time: new Date().getTime()});
                            var re_list = []
                            for(var i=0; i<tmp_list.length; i++){
                                for(var j=0; j<this.menuList.length; j++){
                                    if(tmp_list[i].name == this.menuList[j].name) {
                                        re_list.push(i)
                                        break
                                    }
                                }
                            }
                            //alert(JSON.stringify(re_list.length))
                            for(var i=re_list.length - 1; i>=0; i--){
                                tmp_list.splice(re_list[i], 1);
                            }

                            for(var i=0; i<tmp_list.length; i++){
                                this.menuList.push(tmp_list[i])
                            }
                            //alert(JSON.stringify(this.menuList))
                        }
                    }   
                }else{
                    this.shop_exist = false;
                }
                if(this.food_exist == false) {
                    this.menuList = await getMenu({restaurant_id: this.restaurant_id, allMenu: true, time: new Date().getTime()});
                    if(this.menuList.length > 0) {
                        this.food_exist = true;
                    }
                }
                for(var k=0; k<this.menuList.length; k++){
                    this.menuList.visible = false;
                }
                this.hideLoading();
            },
            //获取食品列表的高度，存入shopListTop
            getFoodListHeight(){
                if(typeof(this.$refs.menuFoodList) != "undefined"){
                    const listContainer = this.$refs.menuFoodList;
                    const listArr = Array.from(listContainer.children[0].children);
                    listArr.forEach((item, index) => {
                        this.shopListTop[index] = item.offsetTop;
                    });
                    this.listenScroll(listContainer)
                }
            },
            //当滑动食品列表时，监听其scrollTop值来设置对应的食品列表标题的样式
            listenScroll(element){
                this.foodScroll = new BScroll(element, {
                    probeType: 3,
                    deceleration: 0.001,
                    bounce: false,
                    swipeTime: 2000,
                    click: true,
                });

                const wrapperMenu = new BScroll('#wrapper_menu', {
                    click: true,
                });

                const wrapMenuHeight = this.$refs.wrapperMenu.clientHeight;
                this.foodScroll.on('scroll', (pos) => {
                    if (!this.$refs.wrapperMenu) {
                        return 
                    }
                    this.shopListTop.forEach((item, index) => {
                        if (this.menuIndexChange && Math.abs(Math.round(pos.y)) >= item) {
                            this.menuIndex = index;
                            const menuList=this.$refs.wrapperMenu.querySelectorAll('.activity_menu');
                            const el = menuList[0];
                            wrapperMenu.scrollToElement(el, 800, 0, -(wrapMenuHeight/2 - 50));
                        }
                    })
                })
            },
            //点击左侧食品列表标题，相应列表移动到最顶层
            chooseMenu(index){
                for(var j=0; j<this.menuList.length; j++){
                    this.menuList[j].visible = false;
                }
                this.menuIndex = index;
                //menuIndexChange解决运动时listenScroll依然监听的bug
                this.menuIndexChange = false;
                this.foodScroll.scrollTo(0, -this.shopListTop[index], 400);
                this.foodScroll.on('scrollEnd', () => {
                    this.menuIndexChange = true;
                })
            },
            typeManage(){
                this.$router.push({path: '/foodTypeShortCutAdd'});
            },
            lot1(index){
                setStore('lot_manage_category_id',this.menuList[index].id);
                setStore('lot_manage_category_type',this.menuList[index].type);
                setStore('lot_manage_category_name',this.menuList[index].name);
                this.$router.push({path: '/lotOperation'});
            },
            add(index){
                setStore('lot_manage_category_id',this.menuList[index].id);
                setStore('lot_manage_category_type',this.menuList[index].type);
                setStore('lot_manage_category_name',this.menuList[index].name);
                this.$router.push({path: '/foodShortCutAdd'});
            },
            //隐藏动画
            hideLoading(){
                this.showLoading = false;
            },
            async linkfoodDetail(image_path, name, price, item_id, category_id, description, discount, sold_out){
                setStore('item_id',item_id);
                setStore('category_id',category_id);
                this.$router.push({path: '/foodDetail?image_path='+ image_path +'&name='+ name +'&price='+ price +'&description='+ description +'&discount='+ discount +'&sold_out='+ sold_out});
            },
            async deleteFood(item_id){
                for(var j=0; j<this.menuList.length; j++){
                    this.menuList[j].visible = false;
                }
                setStore('item_id',item_id);
                if(this.showLoading == true){
                    return
                }
                this.show = true;
            },
            waitingThing(){
                this.show = false;
                this.shows = false;
                this.if_have_food = false;
                this.modify_show = false;
            },
            async deleteFoods(){
                var food_id = getStore('item_id')
                try{
                    let data = new FormData();
                    data.append('food_id', food_id);
                    let response = await fetch('/shopping/v2/food/', {
                            method: 'POST',
                            credentials: 'include',
                            body: data
                            })
                            let res = await response.json();
                            if(res.status == 1){
                                this.show = false;
                                this.showAlert = true;
                                this.alertText = '削除成功';
                            }else{
                                this.show = false;
                                this.showAlert = true;
                                this.alertText = '削除失敗';
                            } 
                }catch (error) {
                    this.showAlert = true;
                    this.alertText = '削除失敗';
                    throw new Error(error);
                }
                this.initData();
            },
            async deleteCategory(index){
                for(var j=0; j<this.menuList.length; j++){
                    this.menuList[j].visible = false;
                }
                var item = this.menuList[index].id
                this.food_del_list = []
                this.item_id = item;
                this.MenuDetail = await getMenuDetail(this.item_id);
                if(this.MenuDetail.foods.length == 0){
                    this.shows = true;
                } else {
                    this.if_have_food = true;
                    this.lot_manage_category_name = getStore('lot_manage_category_name')
                    for (var i = 0;i < this.MenuDetail.foods.length; i++) {
                        this.food_del_list.push({food_id:this.MenuDetail.foods[i].item_id})
                    }
                    
                }
            },
            async deleteCategorys(){
                this.shows = false;
                   const deleteCategorys = await deleteCategory(this.item_id);
                    if(deleteCategorys.status == 1){
                        this.showAlert = true;
                        this.alertText = '削除成功';
                        this.initData();
                    }
                    else{
                        this.showAlert = true;
                        this.alertText = '削除失敗';
                    } 
            },
            async deleteCategorysWithFood(){
                this.if_have_food = false;
                try{
                    const result = await deleteFoods(this.food_del_list);
                    if (result.status == 1) {
                        const deleteCategorys = await deleteCategory(this.item_id);
                        if(deleteCategorys.status == 1){
                            this.showAlert = true;
                            this.alertText = '削除成功';
                            this.initData();
                        }
                        else{
                            this.showAlert = true;
                            this.alertText = '削除失敗';
                        } 
                    }
                    else{
                        this.showAlert = true;
                        this.alertText = '削除失敗'
                    }
                }catch(err){
                    console.log(err)
                }
                
            },
            async updateCategory(index){
                for(var j=0; j<this.menuList.length; j++){
                    this.menuList[j].visible = false;
                }
                var item = this.menuList[index]
                this.modify_show = true;
                this.item_id = item.id;
                this.name = item.name;
                this.modifyValue = item.name;
            },
            async modify(modifyValue){
                this.modify_show = false;
                if(this.modifyValue != '')
                {
                    var exist = 0
                    for (var menu_tmp in this.menu) {
                        if(this.modifyValue == this.menu[menu_tmp].name){
                            exist = 1
                            break 
                        }
                    }
                    if (exist == 1){
                        this.showAlert = true;
                        this.alertText = '名前重複';
                    } else {
                        const Categorys = await updateCategory(modifyValue,this.item_id);
                        if(Categorys.status == 1){
                            this.showAlert = true;
                            this.alertText = '変更成功';
                            this.initData();
                            this.modifyValue=null;
                        }
                        else{
                            this.showAlert = true;
                            this.alertText = '変更失敗';
                        }
                    }
                }
                else{
                    this.showAlert = true;
                    this.alertText = '名前を入力してください！';
                }
            },
        },
        watch: {
            //showLoading变化时说明组件已经获取初始化数据，下一帧nextTick进行后续操作
            showLoading: function (value){
                if (!value) {
                    this.$nextTick(() => {
                        this.getFoodListHeight();
                    })
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import 'src/style/mixin';
    @keyframes mymove{
       0%   { transform: scale(1) }
       25%  { transform: scale(.8) }
       50%  { transform: scale(1.1) }
       75%  { transform: scale(.9) }
       100% { transform: scale(1) }
    }
    @-moz-keyframes mymove{
       0%   { transform: scale(1) }
       25%  { transform: scale(.8) }
       50%  { transform: scale(1.1) }
       75%  { transform: scale(.9) }
       100% { transform: scale(1) }
    }
    @-webkit-keyframes mymove{
       0%   { transform: scale(1) }
       25%  { transform: scale(.8) }
       50%  { transform: scale(1.1) }
       75%  { transform: scale(.9) }
       100% { transform: scale(1) }
    }
    @-o-keyframes mymove{
       0%   { transform: scale(1) }
       25%  { transform: scale(.8) }
       50%  { transform: scale(1.1) }
       75%  { transform: scale(.9) }
       100% { transform: scale(1) }
    }
    .shop_container{
        display: flex;
        flex-direction: column;
        position: absolute;
        right: 0;
        left: 0;
        height: 100%;
    }
    .shop_detail_header{
        overflow: hidden;
        position: relative;
        .header_cover_img{
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 9;
            filter: blur(10px);
        }
        .description_header{
            position: relative;
            z-index: 10;
            background-color: rgba(119,103,137,.43);
            //background-color: #3190e8;
            padding: 0.4rem 0 0.4rem 0.4rem;
            width: 100%;
            overflow: hidden;
            .description_top{
                display: flex;
                .description_left{
                    margin-right: 0.3rem;
                    img{
                        @include wh(2.9rem, 2.9rem);
                        display: block;
                        border-radius: 0.15rem;
                    }
                }
                .description_right{
                    flex: 1;
                    .description_title{
                        @include sc(.8rem, #fff);
                        font-weight: bold;
                        width: 100%;
                        margin-bottom: 0.3rem;
                    }
                }
            }
        }
    }

    .food_container{
        display: flex;
        flex: 1;
        padding-bottom: 2rem;
    }
    .menu_container{
        display: flex;
        flex: 1;
        overflow-y: hidden;
        position: relative;
        .menu_left{
            width: 3.8rem;
            .menu_left_li{
                padding: .7rem .3rem;
                border-bottom: 0.025rem solid #ededed;
                box-sizing: border-box;
                border-left: 0.15rem solid #f8f8f8;
                position: relative;
                display: flex;
                line-height: 1.5rem;
                img{
                    @include wh(.5rem, .6rem);
                }
                span{
                    width: 3rem;
                    @include sc(.6rem, #666);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .right_up{
                    position: absolute;
                    top: .1rem;
                    right: .1rem;
                    line-height: .6rem;
                    text-align: center;
                    border-radius: 50%;
                    min-width: .6rem;
                    height: .6rem;
                    @include sc(.5rem, #fff);
                }
                .right_down{
                    position: absolute;
                    bottom: .1rem;
                    right: .1rem;
                    line-height: .6rem;
                    text-align: center;
                    border-radius: 50%;
                    min-width: .6rem;
                    height: .6rem;
                    @include sc(.5rem, #fff);
                }
            }
            .menu_left_li_ext{
                padding: .7rem .3rem;
                border-bottom: 0.025rem solid #333;
                box-sizing: border-box;
                border-left: 0.15rem solid #333;
                background-color: #333;
                position: relative;
                img{
                    @include wh(.5rem, .6rem);
                }
                span{
                    @include sc(.6rem, #fff);
                }
            }
            .activity_menu{
                border-left: 0.15rem solid rgb(221, 49, 49);
                background-color: #fff;
                span:nth-of-type(1){
                    font-weight: bold;
                }
            }
        }
        .menu_right{
            flex: 4;
            overflow-y: auto;
            .menu_detail_header{
                width: 100%;
                padding: .4rem 0 .4rem .4rem;
                position: relative;
                @include fj;
                align-items: center;
                .menu_detail_header_left{
                    display:flex;
                    white-space: nowrap;
                    overflow: hidden;
                    .menu_item_title{
                        min-width: 7.8rem;
                        @include sc(.7rem, #666);
                        font-weight: bold;
                    }
                    .menu_item_click1{
                        @include sc(.7rem, #333);
                        font-size:12px;
                        font-weight: bold;
                    }
                    .menu_item_click2{
                        @include sc(.7rem, red);
                        font-size:12px;
                        font-weight: bold;
                    }
                    .menu_item_click3{
                        @include sc(.7rem, green);
                        font-size:12px;
                        font-weight: bold;
                    }
                }
            }
            .menu_detail_list{
                background-color: #fff;
                padding: .6rem .4rem;
                border-bottom: 1px solid #f8f8f8;
                position: relative;
                height:4rem;
                overflow: hidden;
                .menu_detail_link{
                    display:flex;
                    .menu_food_img{
                        margin-right: .4rem;
                        img{
                            @include wh(2rem, 2rem);
                            display: block;
                        }
                    }
                    .menu_food_description{
                        width: 100%;
                        .food_description_head{
                            @include fj;
                            margin-bottom: .1rem;
                            .description_foodname{
                                @include sc(.7rem, #333);
                            }
                        }
                    }
                }
                .icon_style1{
                    position: absolute;
                    right:1rem;
                    width: 6%;
                }
                .icon_style2{
                    position: absolute;
                    right:3rem;
                    width: 6%;
                }
            }
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
            @include borderRadius(7px);
            .sa-icon{
                text-align: center;
                padding-top: 1rem;
                img{
                    @include wh(4rem, 4rem);
                }
            }
            h2{
                padding-left: .5rem;
                padding-right: .5rem;
                width:100%;
                text-align:center;
                @include sc(30px,#575757);
                font-weight:500;
                margin:25px 0;
            }
            .sa-botton{
                width:100%;
                text-align:center;
                float: left;
            }
            .detail_container{
                input{
                    padding-left: 1rem;
                    padding-right: 1rem;
                    padding-bottom: 1rem;
                    @include sc(.7rem,#575757);  
                }
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
	.title_text{
		display: flex;
		float: right;
		@include sc(0.7rem, #333);
		padding-right: .7rem;
		margin-top: .5rem;
	}
    .language_img{
        height: 0.6rem;
    }
    .popover{
        padding-left: 1rem
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
	.order_header{
        position: relative;
        z-index: 100;
        left: 0;
        top: 0rem;
		padding-left: 0rem;
        @include wh(100%, 3.95rem);
		background-color: rgb(82,82, 82);
		font-weight: bold;
	}
	.order_img{
		float: left;
		left: 0.4rem;
		@include wh(3rem, 3rem);
		line-height: 2.2rem;
		margin-left: 0rem;
		margin-top: .5rem;
		padding-left: .7rem;
	}
	.order_font{
		display: flex;
		align-items: center;
		.order_shop{
			width: 10rem;
			margin-top: .7rem;
			@include sc(.8rem, rgb(255, 255, 255));
			line-height: .8rem;
			margin-left: .5rem;
			font-weight: bold;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.order_phone{
			width: 10rem;
			margin-top: .4rem;
			@include sc(.6rem, rgb(255, 254, 254));
			margin-left: .5rem;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.order_address{
			width: 10rem;
			@include sc(.6rem, rgb(255, 254, 254));
			margin-left: .5rem;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
</style>
