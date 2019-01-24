 <template>
	<div class="rating_page">
        <head-top :head-title="name" go-back='true'></head-top>
        <section class="detail_container">
            <input type="text" :placeholder="name" maxlength="24" v-model="inputNameValue" :disabled="showLoading">
        </section>
        <section class="detail_containers">
            <input type="text" :placeholder="price" maxlength="5" v-model="inputPriceValue" :disabled="showLoading">
        </section>
        <form class="restForm">
            <section class="input_container phone_number">
                <textarea type="text" placeholder="食べ物情報" v-model="inputDescriptionValue" maxlength="100"></textarea>
            </section>
        </form>
        <section class="header_img">
            <span>料理写真：</span>
            <input type="file" class="profileinfopanel-upload" @change="updateFoodIMG" :disabled="showLoading">
            <img :src="imgBaseUrl + image_paths" class="food_img">
            <img :src="imgBaseUrl + image_path" class="food_img">
        </section>
        <section class="confrim_order">
            <p @click="modifyFood">変更</p>
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
                        <div class="confrim" @click="waitingThing">キャンセル</div>
                        <div class="confrims" @click="deleteFoods">確認</div>
                    </div>
                </section>
            </div>
        </section>
        <transition name="loading">
            <loading v-show="showLoading"></loading>
        </transition>
        <alert-tip v-if="showAlert" :showHide="showAlert" @closeTip="closeTip" :alertText="alertText"></alert-tip>
    </div>
</template>

<script>
	import headTop from 'src/components/header/head'
    import {imgBaseUrl} from 'src/config/env'
    import alertTip from '../../components/common/alertTip'
    import {foodList} from 'src/service/getData'
    import {getStore} from 'src/config/mUtils'
    import loading from 'src/components/common/loading'

    export default {
    	data(){
            return{
                image_paths: "add-img.png",
                image_path: null,
                item_id: null,
                category_id: null,
                name: null,
                price: null,
                imgBaseUrl,
                inputPriceValue: '',
                inputNameValue: '',
                NameValue: '',
                showAlert: false, 
                alertText: null,
                show:false,
                menuList: [], //食品列表
                restaurant_id: null,
                user_id: null,
                showLoading: false, //显示加载动画
                inputDescriptionValue: '',
                format: {bmp:'bmp',BMP:'BMP',jpg:'jpg',JPG:'JPG',png:'png',PNG:'PNG',jpeg:'jpeg',JPEG:'JPEG'}
            }
        },
        created(){
            this.user_id = getStore('user_id')
            if(this.user_id == null){
                this.$router.push({path: '/login'});
            }
            this.restaurant_id = getStore('shopid');
        	this.image_path = this.$route.query.image_path;
            this.name = this.$route.query.name;
            this.inputNameValue = this.$route.query.name;
            this.NameValue = this.inputNameValue;
            this.price = this.$route.query.price;
            this.inputPriceValue = this.$route.query.price;
            this.inputDescriptionValue = this.$route.query.description;
            this.select_models = this.$route.query.discount;
            this.sold_out = this.$route.query.sold_out;
            this.item_id = getStore('item_id');
            this.category_id = getStore('category_id');
        },
        components: {
            headTop,
            alertTip,
            loading
        },
        props:[],
        methods: {

            async deleteFood(){
                if(this.showLoading == true){
                    return
                }
                this.show = true;
            },
            async deleteFoods(){
                try{
                    let data = new FormData();
                    data.append('food_id', this.item_id);
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
                //this.$router.push({path: '/shop?id='+ this.restaurant_id});
            },
            async modifyFood(){
                if(this.showLoading == true){
                    return
                }
                if(this.inputNameValue != '')
                {
                    this.name = this.inputNameValue;
                }
                else{
                    this.showAlert = true;
                    this.alertText = '名前を入力してください！';
                    return
                }
                if(this.inputPriceValue != '')
                {
                    this.price = this.inputPriceValue;
                }
                else {
                    this.showAlert = true;
                    this.alertText = '価格を入力してください！';
                    return
                }
                let data = new FormData();
                let inputPriceValues = Number(this.inputPriceValue);
                if(!inputPriceValues){
                    this.showAlert = true;
                    this.alertText = '数字を入力してください';
                }
                else{
                    if(inputPriceValues > 0 & inputPriceValues < 100000 ){
                        if(inputPriceValues%1 === 0){
                            try{
                                this.menuList = await foodList(this.restaurant_id);
                                var exist = 0;
                                if(this.inputNameValue != this.NameValue){
                                    for (var menu_tmp in this.menuList) {
                                        if(this.inputNameValue == this.menuList[menu_tmp].name){
                                            exist = 1
                                            break  
                                        }
                                    }
                                }
                                if (exist == 1){
                                    //alert("exist")
                                    this.showAlert = true;
                                    this.alertText = '名前重複';
                                } else {
                                    data.append('image_path', this.image_path);
                                    data.append('name', this.name);
                                    data.append('item_id', this.item_id);
                                    data.append('category_id', this.category_id);
                                    data.append('new_category_id', this.category_id);
                                    data.append('price', this.price);
                                    data.append('sold_out', this.sold_out);
                                    data.append('description', this.inputDescriptionValue);
                                    data.append('discount', this.select_models);
                                    let response = await fetch('/shopping/v2/updatefood', {
                                            method: 'POST',
                                            credentials: 'include',
                                            body: data
                                            })
                                            let res = await response.json();
                                            if(res.status == 1){
                                                this.showAlert = true;
                                                this.alertText = '変更成功';
                                            }else{
                                                this.showAlert = true;
                                                this.alertText = '変更失敗';
                                            }
                                }
                            }catch (error) {
                                this.showAlert = true;
                                this.alertText = '変更失敗';
                                throw new Error(error);
                            }
                            //this.$router.go(-1);
                            //this.$router.push({path: '/shop?id='+ this.restaurant_id});
                        }
                        else{
                            this.showAlert = true;
                            this.alertText = '整数を入力してください';
                        }
                    }
                    else{
                        this.showAlert = true;
                        this.alertText = '1-99999の数字を入力してください';
                    }
                }
            },
            async updateFoodIMG(){
                let input = document.querySelector('.profileinfopanel-upload')
                let data = new FormData();
                if(!input.files[0]){
                    return
                }
                if(this.showLoading == true){
                    return
                }
                this.showLoading = true;
                var one = input.files[0].name.split(".");
                if(one[one.length - 1] in this.format) {
                    if(input.files[0].size > 2097152){
                        this.showAlert = true;
                        this.alertText = '画像の大きさは2MBを超えない！';
                        this.showLoading = false;
                        return
                    }
                    data.append('file', input.files[0]);
                    try{
                        let response = await fetch('/v1/addimg/food', {
                                method: 'POST',
                                credentials: 'include',
                                body: data
                            })
                        let res = await response.json();
                        if (res.status == 1) {
                            this.image_path = res.image_path;
                        }
                    }catch (error) {
                        this.showAlert = true;
                        this.alertText = '変更失敗';
                        throw new Error(error);
                    }
                }
                else{
                    this.showAlert = true;
                    this.alertText = '画像のフォーマットが正しくない！';
                }
                this.showLoading = false;
            },
            closeTip(){
                this.showAlert = false;
                if(this.alertText === "削除成功" | this.alertText === "変更成功"){
                    this.$router.go(-1);
                }
            },
            waitingThing(){
                this.show = false;
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
    
    .restForm{
        background-color: #fff;
        margin-top: .1rem;
        .input_container{
            display: flex;
            justify-content: space-between;
            textarea{
                @include sc(.7rem, #666);
                height: 3.5rem;
                width: 15rem;
            }
        }
        .phone_number{
            padding: .4rem .5rem;
        }
    }
	
	.rating_page{
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 12;
        padding-top: 1.95rem;
        p, span{
            font-family: Helvetica Neue,Tahoma,Arial;
        }
	}
    .header_img{
        padding: .2rem .5rem;
        position: relative;
        span{
            display: block;
            @include sc(.7rem, #666);
        }
        .food_img{
            margin-top: .3rem;
            width: 5rem;
            height: 5rem;
            border:1px solid rgb(202, 201, 201);
        }
        .profileinfopanel-upload{
            display: block;
            position: absolute;
            opacity: 0;
            margin-top: .3rem;
            width: 5rem;
            height: 5rem;
        }
    }
    .detail_container{
        background-color: #fff;
        margin-top: .5rem;
        padding: .3rem .5rem;
        height: 2rem;
        @include fj;
        align-items: center;
        input{
            @include sc(.7rem, #666);
            width: 12rem;
        }
    }
    .detail_containers{
        background-color: #fff;
        margin-top: .1rem;
        padding: .3rem .5rem;
        height: 1.8rem;
        @include fj;
        align-items: center;
        input{
            @include sc(.7rem, #666);
            width: 12rem;
        }
    }
    .sa-botton{
        width:100%;
        text-align:center;

        button{
            margin-bottom: 1.95rem;
            display:inline-block;
            padding:.4rem 1rem;
            @include borderRadius(5px);
            @include sc(.6rem,$fc);
            letter-spacing:1px;
            margin-top:26px;
        }
        .waiting{
            background:#f7744c;
            margin-right:.4rem;
        }
        .quitlogin{
            background:#56d176;
        }
    }
    .input{
    width:  450px;
    height: 45px;
    display: block;
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
            @include sc(.7rem, #fff);
            background-color: rgb(221, 49, 49);
            text-align: center;
            font-weight: bold;
        }
    }
</style>
