 <template>
	<div class="rating_page">
        <head-top :head-title="lot_manage_category_name" go-back='true'></head-top>
        <section class="detail_container">
            <input type="text" placeholder="名前" maxlength="31" v-model="inputNameValue" :disabled="showLoading">
        </section>
        <section class="detail_containers">
            <input type="text" placeholder="価格" maxlength="5" v-model="inputPriceValue" :disabled="showLoading">
        </section>
        <section>
        <form class="restForm">
            <section class="input_container phone_number">
                <textarea type="text" placeholder="食べ物情報（100文字以内）" v-model="inputDescriptionValue" maxlength="100"></textarea>
            </section>
        </form>
        </section>
        <section class="header_img">
            <span>料理写真：</span>
            <input type="file" class="profileinfopanel-upload" @change="updateFoodIMG" :disabled="showLoading">
            <img :src="imgBaseUrl + image_paths" class="food_img">
            <img :src="imgBaseUrl + image_path" class="food_img">
        </section>
        <section class="confrim_order">
            <p @click="addFood">追加</p>
        </section>
        <transition name="loading">
            <loading v-show="showLoading"></loading>
        </transition>
        <alert-tip v-if="showAlert" :showHide="showAlert" @closeTip="closeTip" :alertText="alertText"></alert-tip>
    </div>
    
</template>

<script>
    import headTop from 'src/components/header/head'
    import alertTip from '../../components/common/alertTip'
    import {imgBaseUrl} from 'src/config/env'
    import {addFoodTest, getMenu} from 'src/service/getData'
    import {getStore} from 'src/config/mUtils'
    import loading from 'src/components/common/loading'

    export default {
    	data(){
            return{
                image_paths: "add-img.png",
                image_path: "example.png",
                category_id: null,
                name: '',
                price: null,
                imgBaseUrl,
                inputPriceValue: '',
                inputNameValue: '',
                showAlert: false, 
                alertText: null,
                menu: null,
                select_model: null,
                specsForm: {
                    name: "",
                    //specs_name:"默认",
                    restaurant_id: null,
		          	price: null,
		        },
    			foodForm: {
    				name: '',
    				description: '',
                    image_path: 'example.png',
                    price: 0,
    				activity: '',
    				attributes: [],
    				specs: [],
                },
                user_id: null,
                showLoading: false, //显示加载动画
                inputDescriptionValue: '',
                format: {bmp:'bmp',BMP:'BMP',jpg:'jpg',JPG:'JPG',png:'png',PNG:'PNG',jpeg:'jpeg',JPEG:'JPEG'}
            }
        },
        created(){
            this.user_id = getStore('user_id')
            this.lot_manage_category_id = getStore('lot_manage_category_id')
            this.select_model_name = getStore('lot_manage_category_name')
            this.lot_manage_category_name = getStore('lot_manage_category_name') + "のメニューに追加"
            if(this.user_id == null){
                this.$router.push({path: '/login'});
            }
        },
        async mounted(){
            this.specsForm.restaurant_id = getStore('shopid');
            //this.menu = await getMenu({restaurant_id: this.specsForm.restaurant_id, allMenu: true, time: new Date().getTime()});
            this.select_model = this.lot_manage_category_id;
        },
        components: {
            headTop,
            alertTip,
            loading
        },
        props:[],
        methods: {
            async addFood(){
                if(this.showLoading == true){
                    return
                }

                if (this.image_path !='example.png'){
                    this.foodForm.image_path = this.image_path
                }
                if (this.inputNameValue !=''){
                    this.foodForm.name = this.inputNameValue
                    this.specsForm.name = this.inputNameValue
                } else{
                    this.showAlert = true;
                    this.alertText = '名前を入力してください！';
                    return
                }
                if (this.inputPriceValue !=''){
                    this.foodForm.price = this.inputPriceValue
                    this.specsForm.price = this.inputPriceValue
                } else {
                    this.showAlert = true;
                    this.alertText = '価格を入力してください！';
                    return
                }
                let inputPriceValues = Number(this.inputPriceValue);
                if(!inputPriceValues){
                    this.showAlert = true;
                    this.alertText = '数字を入力してください';
                }
                else{
                    if(inputPriceValues > 0 & inputPriceValues < 100000 ){
                        if(inputPriceValues%1 === 0){
                            this.foodForm.description = this.inputDescriptionValue;
                            this.foodForm.specs.push({...this.specsForm});
                            const params = {
                                ...this.foodForm,
                                category_id: this.select_model,
                                restaurant_id: this.specsForm.restaurant_id,
                            }
                            try{
                                let res = await addFoodTest(params);
                                if (res.status >= 1) {
                                    this.showAlert = true;
                                    this.alertText = res.message;
                                }
                            }catch (error) {
                                this.showAlert = true;
                                this.alertText = '追加失敗';
                                throw new Error(error);
                            }
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
                        this.alertText = 'アップロード失敗';
                        throw new Error(error);
                    }
                }
                else{
                    this.showAlert = true;
                    this.alertText = '画像のフォーマットが正しくありません！';
                }
                this.showLoading = false;
            },
            closeTip(){
                this.showAlert = false;
                if(this.alertText === "追加成功"){
                    this.$router.go(-1);
                }
            }
        }
    }
</script>
	
<style lang="scss" scoped>
    @import 'src/style/mixin';
	
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
