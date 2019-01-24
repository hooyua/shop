 <template>
	<div v-if="show" class="rating_page">
        <head-top head-title="新規店舗お申し込み" go-back='true'></head-top>
        <section class="detail_container">
            <input type="text" placeholder="店名" maxlength="31" v-model="inputNameValue" :disabled="showLoading">
        </section>
        <section class="detail_containers">
            <input type="text" placeholder="電話番号" maxlength="11" v-model="inputPhoneValue" :disabled="showLoading">
        </section>
        <section class="detail_containers">
            <input type="text" placeholder="住所" maxlength="64" v-model="inputAddressValue" :disabled="showLoading">
        </section>
        <section class="header_img">
            <span>店舗写真：</span>
            <input type="file" class="profileinfopanel-upload" @change="updateFoodIMG" :disabled="showLoading">
            <img :src="imgBaseUrl + image_paths" class="food_img">
            <img v-if="image_path != ''" :src="imgBaseUrl + image_path" class="food_img">
        </section>
        <section class="header_img">
            <span>営業許可証：</span>
            <input type="file" class="profileinfopanels-upload" @change="updateFoodIMGs" :disabled="showLoading">
            <img :src="imgBaseUrl + image_paths" class="food_img">
            <img v-if="license != ''" :src="imgBaseUrl + license" class="food_img">
        </section>
        <section class="confrim_order">
            <p @click="addshop">確認</p>
        </section>
        <transition name="loading">
            <loading v-show="showLoading"></loading>
        </transition>
        <alert-tip v-if="showAlert" :showHide="showAlert" @closeTip="closeTip" :alertText="alertText"></alert-tip>
    </div>
    
</template>

<script>
    import headTop from 'src/components/header/head'
    import alertTip from '../../../components/common/alertTip'
    import {imgBaseUrl} from 'src/config/env'
    import {addshop, getOpenShop} from 'src/service/getData'
    import {getStore, setStore} from 'src/config/mUtils'
    import loading from 'src/components/common/loading'

    export default {
    	data(){
            return{
                image_paths: "add-img.png",
                image_path: "",
                license: "",
                name: '',
                imgBaseUrl,
                inputPhoneValue: '',
                inputNameValue: '',
                inputAddressValue: '',
                showAlert: false, 
                alertText: null,
                menu: null,
                select_model: 11,
    			shopDetailData: {
    				name: '',
    				phone: '',
                    address: '',
                    image_path: '',
                    license: '',
                },
                user_id: null,
                shopOpenList: [],
                showLoading: false, //显示加载动画
                show: false,
                format: {bmp:'bmp',BMP:'BMP',jpg:'jpg',JPG:'JPG',png:'png',PNG:'PNG',jpeg:'jpeg',JPEG:'JPEG'}
            }
        },
        async created(){
            this.user_id = getStore('user_id')
            if(this.user_id == null){
                this.$router.push({path: '/login'});
                return
            }
            this.shopOpenList = await getOpenShop(this.user_id);
            if(this.shopOpenList.length > 0){
                this.$router.push({path: '/profile'});
                return
            }
            this.show = true;
        },
        async mounted(){
        },
        components: {
            headTop,
            alertTip,
            loading
        },
        props:[],
        methods: {
            async addshop(){
                if(this.showLoading == true){
                    return
                }
                if (this.inputNameValue !=''){
                    this.shopDetailData.name = this.inputNameValue
                } else{
                    this.showAlert = true;
                    this.alertText = '店名を入力してください！';
                    return
                }
                if (this.inputPhoneValue !=''){
                    this.shopDetailData.phone = this.inputPhoneValue
                } else {
                    this.showAlert = true;
                    this.alertText = '電話番号を入力してください！';
                    return
                }
                let inputPhoneValues = Number(this.inputPhoneValue);
                if(!inputPhoneValues){
                    this.showAlert = true;
                    this.alertText = '正しい電話番号を入力してください';
                    return
                }
                if (this.inputAddressValue !=''){
                    this.shopDetailData.address = this.inputAddressValue
                } else {
                    this.showAlert = true;
                    this.alertText = '住所を入力してください！';
                    return
                }
                if (this.image_path != 'add.png'){
                    this.shopDetailData.image_path = this.image_path
                } else{
                    this.showAlert = true;
                    this.alertText = '店舗写真を追加してください！';
                    return
                }
                if (this.license != 'add.png'){
                    this.shopDetailData.license = this.license
                } else{
                    this.showAlert = true;
                    this.alertText = '営業許可証を追加してください！';
                    return
                }
                try{
                    this.user_id = getStore('user_id');
                    let res = await addshop(this.shopDetailData.name, this.shopDetailData.address, this.user_id, this.shopDetailData.phone, this.shopDetailData.image_path, this.shopDetailData.license);
                    if (res.status >= 1) {
                        this.shopOpenList = await getOpenShop(this.user_id);
                        if(this.shopOpenList.length > 0){
                            setStore('shopid',this.shopOpenList[0].id)
                        }
                        this.showAlert = true;
                        this.alertText = '新規店舗成功';
                    }
                    else{
                        this.showAlert = true;
                        this.alertText = '新規店舗失敗';
                    }
                }catch (error) {
                    this.showAlert = true;
                    this.alertText = '新規店舗失敗';
                    throw new Error(error);
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
                        let response = await fetch('/v1/addimg/shop', {
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
                    this.alertText = '画像のフォーマットが正しくない！';
                }
                this.showLoading = false;
            },
            async updateFoodIMGs(){
                let input = document.querySelector('.profileinfopanels-upload')
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
                        let response = await fetch('/v1/addimg/shop', {
                                method: 'POST',
                                credentials: 'include',
                                body: data
                            })
                        let res = await response.json();
                        if (res.status == 1) {
                            this.license = res.image_path;
                        }
                    }catch (error) {
                        this.showAlert = true;
                        this.alertText = 'アップロード失敗';
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
                if(this.alertText === "新規店舗成功"){
                    this.$router.go(-1);
                }
            }
        }
    }
</script>
	
<style lang="scss" scoped>
    @import 'src/style/mixin';
	
    input:disabled{     
        background-color:#fff;
        @include sc(.7rem, #111);
    }

	.rating_page{
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
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
        .profileinfopanels-upload{
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
        padding: .5rem;
        height: 2rem;
        @include fj;
        align-items: center;
        input{
            @include sc(.7rem, #999);
            width: 12rem;
        }
    }
    .detail_containers{
        background-color: #fff;
        margin-top: .1rem;
        padding: .5rem;
        @include fj;
        align-items: center;
        input{
            @include sc(.7rem, #999);
            width: 12rem;
        }
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
