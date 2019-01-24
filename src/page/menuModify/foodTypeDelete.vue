 <template>
	<div class="rating_page">
        <head-top head-title="料理の種類を削除・更新" go-back='true'></head-top>
        <li v-for="(item,index) in menu" :key="index">
            <header class="menu_detail_header">
                <section class="detail_container">
                    <strong class="menu_item_description">{{item.name}}</strong>
                    <button class="waiting"  @click="deleteCategory(item)">削除</button>
                </section>
                <section class="coverpart" v-if="show">
                    <div class="alet_container">
                        <section class="cover-background"></section>
                        <section class="cover-content">
                            <h2>種類変更</h2>
                            <section class="detail_container">
                                <input type="text" :placeholder="name" maxlength="10" v-model="inputNameValue">
                            </section>
                            <div class="sa-botton">
                                <div style="display:inline-block;">
                                    <button class="waiting"  @click="waitingThing">キャンセル  </button>
                                    <button class="quitlogin"  @click="confirm(inputNameValue)">確認</button>
                                </div>
                            </div>
                        </section>
                    </div>
                </section>
            </header>
        </li>
        <section class="coverpart" v-if="shows">
                    <div class="alet_container">
                        <section class="cover-backgrounds"></section>
                        <section class="cover-content">
                            <div class="sa-icons">
                                <span class="sa-body"></span>
                                <span class="sa-dot"></span>
                            </div>
                            <h2>削除の確認</h2>
                            <div class="sa-botton">
                                <div style="display:inline-block;">
                                    <button class="waiting"  @click="waitingThing">キャンセル</button>
                                    <button class="quitlogin"  @click="deleteCategorys">確認</button>
                                </div>
                            </div>
                        </section>
                    </div>
        </section>
        <section class="coverpart" v-if="if_have_food">
                    <div class="alet_container">
                        <section class="cover-backgrounds"></section>
                        <section class="cover-content">
                            <div class="sa-icons">
                                <span class="sa-body"></span>
                                <span class="sa-dot"></span>
                            </div>
                            <h2>カテゴリー内の食品を一緒に削除</h2>
                            <div class="sa-botton">
                                <div style="display:inline-block;">
                                    <button class="waiting"  @click="waitingThing">キャンセル</button>
                                    <button class="quitlogin"  @click="deleteCategorysWithFood">確認</button>
                                </div>
                            </div>
                        </section>
                    </div>
        </section>
        <alert-tip v-if="showAlert"  @closeTip="showAlert=false" :alertText="alertText"></alert-tip>
    </div>
</template>

<script>
	import headTop from 'src/components/header/head'
    import {getMenu, updateCategory, deleteFoods, deleteCategory, getMenuDetail} from 'src/service/getData'
    import alertTip from 'src/components/common/alertTip'
    import {getStore} from 'src/config/mUtils'

    export default {
    	data(){
            return{
                item_id: null,
                name: null,
                inputNameValue: '',
                menu: null,
                MenuDetail: null,
                show:false,
                if_have_food:false,
                showAlert: false,
                alertText: null,
                shows:false,
                restaurant_id: null,
                user_id: null,
                food_del_list:[],
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
        },
        props:[],
        methods: {
            //初始化时获取基本数据
            async initData(){
                this.restaurant_id = getStore('shopid');
                if(this.restaurant_id){
                    this.menu = await getMenu({restaurant_id: this.restaurant_id, allMenu: true, time: new Date().getTime()});
                }
            },
            async deleteCategory(item){
                this.item_id = item.id;
                this.MenuDetail = await getMenuDetail(this.item_id);
                if(this.MenuDetail.foods.length == 0){
                    this.shows = true;
                } else {
                    this.if_have_food = true;
                    for (var i = 0;i < this.MenuDetail.foods.length; i++) {
                        this.food_del_list.push({food_id:this.MenuDetail.foods[i].item_id})
                    }
                    
                }
            },
            async deleteCategorys(){
                this.shows = false;
                //this.MenuDetail = await getMenuDetail(this.item_id);
                //if(this.MenuDetail.foods.length == 0){
                   const deleteCategorys = await deleteCategory(this.item_id);
                    if(deleteCategorys.status == 1){
                        //alert("success");
                        this.showAlert = true;
                        this.alertText = '削除成功';
                        this.initData();
                    }
                    else{
                        //alert("failure")
                        this.showAlert = true;
                        this.alertText = '削除失敗';
                    } 
                //}
                //else{
                //    this.showAlert = true;
                //    this.alertText = 'まずカテゴリー内の食品を削除してください';
                //}
                
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
            async updateCategory(item){
                this.show = true;
                this.item_id = item.id;
                this.name = item.name;
                this.inputNameValue = item.name;
            },
            async confirm(inputNameValue){
                this.show = false;
                if(this.inputNameValue != '')
                {
                    var exist = 0
                    for (var menu_tmp in this.menu) {
                        if(this.inputNameValue == this.menu[menu_tmp].name){
                        exist = 1
                        break 
                        }
                    }
                    if (exist == 1){
                        this.showAlert = true;
                        this.alertText = '名前重複';
                    } else {
                        const Categorys = await updateCategory(inputNameValue,this.item_id);
                        if(Categorys.status == 1){
                            this.showAlert = true;
                            this.alertText = '変更成功';
                            this.initData();
                            this.inputNameValue=null;
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
            waitingThing(){
                this.show = false;
                this.shows = false;
                this.if_have_food = false;
            },
        }
    }
</script>
	
<style lang="scss" scoped>
    @import 'src/style/mixin';

    .coverpart{
        @include wh(100%,100%);
        @include allcover;
        .cover-background{
            @include wh(100%,100%);
            @include allcover;
            background:#000;
            z-index:100;
            opacity:.03;
        }
        .cover-backgrounds{
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
            .sa-icons{
                @include wh(90px,90px);
                border:4px solid #f8bb86;
                @include borderRadius(50%);
                margin:20px auto;
                position:relative;
                .sa-body{
                    @include wh(5px,47px);
                    @include borderRadius(2px);
                    background:#f8bb86;
                    @include cl;
                    top:10px;
                }
                .sa-dot{
                    @include wh(7px,7px);
                    @include borderRadius(50%);
                    background:#f8bb86;
                    @include cl;
                    bottom:10px;
                }
            }
            h2{
                width:100%;
                text-align:center;
                @include sc(1rem,#575757);
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
                .waiting{
                    @include wh(6.2rem,1.7rem);
                    background:#f7744c;
                    margin-right:.4rem;
                }
                .quitlogin{
                    @include wh(6.2rem,1.7rem);
                    background:#56d176;
                }
            }

        }
    }
	
	.rating_page{
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #fff;
		z-index: 12;
        padding-top: 1.95rem;
        p, span{
            font-family: Helvetica Neue,Tahoma,Arial;
        }
	}
    .detail_container{
        padding: .5rem;
        @include fj;
        align-items: center;
        input{
            @include sc(.6rem, #666);
            width: 12rem;
            }
        .waiting{
            @include sc(.6rem, #f7744c);
            background-color: #fff;
        }
        .quitlogin{
            @include sc(.6rem, #4cd964);
            background-color: #fff;
        }

    }
    .menu_item_description{
        @include sc(.6rem, #999);
        width: 70%;
            overflow: hidden;
    }
</style>
