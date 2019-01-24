 <template>
	<div class="rating_page">
        <head-top head-title="メニューを追加" go-back='true'></head-top>
        <section class="header_img">
            <input type="file" class="profileinfopanel-upload" @change="updateFoodIMG" :disabled="showLoading">
            <img :src="imgBaseUrl + image_path" class="food_img">
        </section>
        <section class="detail_container">
            <input type="text" placeholder="名前" maxlength="31" v-model="inputNameValue" :disabled="showLoading">
        </section>
        <section class="detail_container">
            <input type="text" placeholder="価格" maxlength="5" v-model="inputPriceValue" :disabled="showLoading">
        </section>
        <section class="detail_containers">
            <select v-model="select_model" v-on:change="indexSelect" :disabled="showLoading">
                <option v-for="(item,index) in menu" v-bind:value="item.id" :key="index">{{ item.name }}</option>
            </select>
            <select v-model="select_models" v-on:change="indexSelect" :disabled="showLoading">
                <option v-for="(item,index) in discount" v-bind:value="item.value" :key="index">{{ item.name }}</option>
            </select>
        </section>
        <section>
        <form class="restForm">
            <section class="input_container phone_number">
                <textarea type="text" placeholder="食べ物情報（100文字以内）" v-model="inputDescriptionValue" maxlength="100"></textarea>
            </section>
        </form>
        </section>
        <div class="sa-botton">
            <div style="display:inline-block;">
                <button class="quitlogin"  @click="addFood">追加</button>
            </div>
        </div>
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
                discount: [{name:'割引しない',value:1},{name:'9割引',value:0.9},{name:'8割引',value:0.8},{name:'7割引',value:0.7},{name:'5割引',value:0.5}],
                select_models: 1,
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
            if(this.user_id == null){
                this.$router.push({path: '/login'});
            }
        },
        async mounted(){
            this.specsForm.restaurant_id = getStore('shopid');
            this.menu = await getMenu({restaurant_id: this.specsForm.restaurant_id, allMenu: true, time: new Date().getTime()});
            this.select_model = this.menu[0].id;
        },
        components: {
            headTop,
            alertTip,
            loading
        },
        props:[],
        methods: {
            indexSelect(){
　　            //alert(this.select_model);
                //alert(this.select_models);
            },
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
                                discount: this.select_models,
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
		background-color: #fff;
		z-index: 12;
        padding-top: 1.95rem;
        p, span{
            font-family: Helvetica Neue,Tahoma,Arial;
        }
	}

    .restForm{
        background-color: #fff;
        //margin-top: .6rem;
        .input_container{
            display: flex;
            justify-content: space-between;
            //padding: .6rem .8rem;
            //border-bottom: 1px solid #f1f1f1;
            textarea{
                @include sc(.6rem, #666);
                height: 2rem;
                width: 15rem;
            }
        }
        .phone_number{
            padding: .4rem .5rem;
        }
    }

    .header_img{
        position: relative;
        .food_img{
            width: 100%;
            display: block;
        }
        
        .profileinfopanel-upload{
            display: block;
            position: absolute;
            opacity: 0;
            top: 2.35rem;
            left: 0;
            @include wh(100%,80%);
        }
    }
    .detail_container{
        padding: .3rem .5rem;
        @include fj;
        align-items: center;
        input{
            @include sc(.6rem, #666);
            width: 12rem;
        }
        select{
            @include sc(.6rem, #666);
        }
    }
    .detail_containers{
        padding: 0rem .5rem;
        //@include fj;
        align-items: center;
        select:nth-of-type(1){
            @include sc(.6rem, #666);
        }
        select:nth-of-type(2){
            @include sc(.6rem, #666);
            margin-left: 2rem;
        }
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
    .input{
    width:  450px;
    height: 45px;
    display: block;
    }
</style>
