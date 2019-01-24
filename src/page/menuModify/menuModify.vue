 <template>
    <div>
        <head-top head-title="メニューを削除・更新" go-back='true'></head-top>
        <section v-if="!showLoading" class="shop_container">
            <header class="shop_detail_header" ref="shopheader" :style="{zIndex: '10'}">
                <section class="description_header">
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
                            </ul>
                        </section>
                        <section class="menu_right" ref="menuFoodList">
                            <ul>
                                <li v-for="(item,index) in menuList" :key="index">
                                    <header class="menu_detail_header">
                                        <section class="menu_detail_header_left">
                                            <strong class="menu_item_title">{{item.name}}</strong>
                                        </section>
                                    </header>
                                    <section v-for="(foods,foodindex) in item.foods" :key="foodindex" class="menu_detail_list">
                                        <section @click="linkfoodDetail(foods.image_path, foods.name, foods.specfoods[0].price, foods.item_id, foods.category_id, foods.description, foods.discount)" tag="div" class="menu_detail_link">
                                            <section class="menu_food_img">
                                                <img :src="imgBaseUrl + foods.image_path">
                                            </section>
                                            <section class="menu_food_description">
                                                <h3 class="food_description_head">
                                                    <strong class="description_foodname">{{foods.name}}</strong>
                                                </h3>
                                                <span style="color:red;font-size:.7rem;">変更・削除</span>
                                            </section>
                                        </section>            
                                    </section>
                                </li>
                            </ul>
                        </section>
                    </section>
                </section>
            </transition>
        </section>
        <transition name="router-slid" mode="out-in">
            <router-view :key="activeDate"></router-view>
        </transition>
    </div>
</template>

<script>
    import headTop from 'src/components/header/head'
    import {mapState, mapMutations} from 'vuex'
    import Vue from 'vue'
    import {shopDetails, foodMenu} from 'src/service/getData'
    import loading from 'src/components/common/loading'
    import {loadMore} from 'src/components/common/mixin'
    import {imgBaseUrl} from 'src/config/env'
    import BScroll from 'better-scroll'
    import footGuide from 'src/components/footer/footGuide'
    import {setStore, getStore} from 'src/config/mUtils'

    export default {
        data(){
            return{
                restaurant_id: null, //商店id值
                showLoading: true, //显示加载动画
                shopDetailData: null, //商铺详情
                menuList: [], //食品列表
                menuIndex: 0, //已选菜单索引值，默认为0
                menuIndexChange: true,//解决选中index时，scroll监听事件重复判断设置index的bug
                shopListTop: [], //商品列表的高度集合
                TitleDetailIndex: null, //点击展示列表头部详情
                foodScroll: null,  //食品列表scroll
                windowHeight: null, //屏幕的高度
                imgBaseUrl,
                activeDate: null,
                user_id: null,
            }
        },
        created(){
            this.user_id = getStore('user_id')
            if(this.user_id == null){
                this.$router.push({path: '/login'});
            }
            this.restaurant_id = getStore('shopid');
        },
        mounted(){
            this.initData();
            this.windowHeight = window.innerHeight;
        },
        beforeDestroy(){
        },
        mixins: [loadMore],
        components: {
            headTop,
            loading,
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
                this.shopDetailData = await shopDetails(this.restaurant_id);
                this.menuList = await foodMenu(this.restaurant_id);
                this.hideLoading();
            },
            //获取食品列表的高度，存入shopListTop
            getFoodListHeight(){
                const listContainer = this.$refs.menuFoodList;
                const listArr = Array.from(listContainer.children[0].children);
                listArr.forEach((item, index) => {
                    this.shopListTop[index] = item.offsetTop;
                });
                this.listenScroll(listContainer)
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
                this.menuIndex = index;
                //menuIndexChange解决运动时listenScroll依然监听的bug
                this.menuIndexChange = false;
                this.foodScroll.scrollTo(0, -this.shopListTop[index], 400);
                this.foodScroll.on('scrollEnd', () => {
                    this.menuIndexChange = true;
                })
            },
            showTitleDetail(index){
                if (this.TitleDetailIndex == index) {
                    this.TitleDetailIndex = null;
                }else{
                    this.TitleDetailIndex = index;
                }
            },
            //隐藏动画
            hideLoading(){
                this.showLoading = false;
            },
            async linkfoodDetail(image_path, name, price, item_id, category_id, description, discount){
                setStore('item_id',item_id);
                setStore('category_id',category_id);
                this.$router.push({path: '/foodDetail?image_path='+ image_path +'&name='+ name +'&price='+ price +'&description='+ description +'&discount='+ discount});
            },
        },
        watch: {
            //showLoading变化时说明组件已经获取初始化数据，在下一帧nextTick进行后续操作
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
        top: 1rem;
        display: flex;
        flex-direction: column;
        position: absolute;
        right: 0;
        left: 0;
        height: 104%;
    }
    .shop_detail_header{
        overflow: hidden;
        position: relative;
        .description_header{
            position: relative;
            z-index: 10;
            background-color: rgba(119,103,137,.43);
            padding: 0.4rem 0 0.4rem 0.4rem;
            width: 100%;
            overflow: hidden;
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
                img{
                    @include wh(.5rem, .6rem);
                }
                span{
                    @include sc(.6rem, #666);
                }
                .category_num{
                    position: absolute;
                    top: .1rem;
                    right: .1rem;
                    background-color: #ff461d;
                    line-height: .6rem;
                    text-align: center;
                    border-radius: 50%;
                    border: 0.025rem solid #ff461d;
                    min-width: .6rem;
                    height: .6rem;
                    @include sc(.5rem, #fff);
                    font-family: Helvetica Neue,Tahoma,Arial;
                }
            }
            .activity_menu{
                border-left: 0.15rem solid #3190e8;
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
                padding: .4rem;
                position: relative;
                @include fj;
                align-items: center;
                .menu_detail_header_left{
                    width: 11rem;
                    white-space: nowrap;
                    overflow: hidden;
                    .menu_item_title{
                        @include sc(.7rem, #666);
                        font-weight: bold;
                    }
                }
            }
            .menu_detail_list{
                background-color: #fff;
                padding: .6rem .4rem;
                border-bottom: 1px solid #f8f8f8;
                position: relative;
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
                            margin-bottom: .2rem;
                            .description_foodname{
                                @include sc(.7rem, #333);
                            }
                        }
                    }
                }
            }
        }
    }
</style>
