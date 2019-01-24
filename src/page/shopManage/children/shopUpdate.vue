 <template>
	<div class="rating_page">
        <head-top head-title="店舗の情報を変更" go-back='true'></head-top>
        <section class="detail_container">
            <input type="text" placeholder="店名" maxlength="31" v-model="shopDetailData.name" :disabled="showLoading">
        </section>
        <section class="detail_containers">
            <input type="text" placeholder="電話番号" v-model="shopDetailData.phone" maxlength="11" disabled>
        </section>
        <section class="detail_containerss">
            <input type="text" placeholder="住所" maxlength="64" v-model="shopDetailData.address" :disabled="showLoading">
        </section>
        <section class="header_img">
            <span>店舗写真：</span>
            <input type="file" class="profileinfopanel-upload" @change="updateFoodIMG" :disabled="showLoading">
            <img :src="imgBaseUrl + image_paths" class="food_img">
            <img :src="imgBaseUrl + shopDetailData.image_path" class="food_img">
        </section>
        <section class="header_img">
            <span>営業許可証：</span>
            <input type="file" class="profileinfopanels-upload" disabled>
            <img :src="imgBaseUrl + shopDetailData.license" class="food_img">
        </section>
        <section class="confrim_order">
            <p @click="updateshop">確認</p>
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
    import {shopDetails, updateshop} from 'src/service/getData'
    import {getStore} from 'src/config/mUtils'
    import loading from 'src/components/common/loading'

    export default {
    	data(){
            return{
                image_paths: "add-img.png",
                imgBaseUrl,
                showAlert: false, 
                alertText: null,
                menu: null,
                select_model: 11,
    			shopDetailData: {
    				name: '',
    				phone: '',
                    address: '',
                    image_path: 'add.png',
                    license: "add.png",
                },
                restaurant_id: null, //商店id值
                user_id: null,
                showLoading: false, //显示加载动画
                format: {bmp:'bmp',BMP:'BMP',jpg:'jpg',JPG:'JPG',png:'png',PNG:'PNG',jpeg:'jpeg',JPEG:'JPEG'}
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
            loading
        },
        props:[],
        methods: {
            //初始化时获取基本数据
            async initData(){
                this.restaurant_id = getStore('shopid');
                if(this.restaurant_id != null){
                    this.shopDetailData = await shopDetails(this.restaurant_id);
                }
                else{
                    this.showAlert = true;
                    this.alertText = '店舗情報がない';
                }
            },
            async updateshop(){
                if(this.showLoading == true){
                    return
                }
                if (this.shopDetailData.name ==''){
                    this.showAlert = true;
                    this.alertText = '店名を入力してください！';
                    return
                }
                if (this.shopDetailData.address ==''){
                    this.showAlert = true;
                    this.alertText = '住所を入力してください！';
                    return
                }
                try{
                    let res = await updateshop(this.restaurant_id, this.shopDetailData.name, this.shopDetailData.address, this.shopDetailData.image_path);
                    if (res.status >= 1) {
                        this.showAlert = true;
                        this.alertText = '変更成功';
                    }
                }catch (error) {
                    this.showAlert = true;
                    this.alertText = '変更失敗';
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
                            this.shopDetailData.image_path = res.image_path;
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
                if(this.alertText === "変更成功"){
                    this.initData();
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
            @include sc(.7rem, rgb(0, 0, 0));
            width: 15rem;
            }    
    }
    .detail_containerss{
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
</style>
