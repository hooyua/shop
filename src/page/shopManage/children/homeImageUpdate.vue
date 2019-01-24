 <template>
	<div class="rating_page">
        <head-top head-title="ホームの写真を変更" go-back='true'></head-top>
        <section class="detail_containers">
            <input type="text" v-model="text1" disabled>
        </section>
        <section class="header_img" :style="width">
            <input type="file" class="profileinfopanel1-upload" @change="updateFoodIMG(1)" :disabled="showLoading">
            <img :src="imgBaseUrl + imgArray[0]" class="food_img">
        </section>
        <section class="detail_containers">
            <input type="text" v-model="text2" disabled>
        </section>
        <section class="header_img" :style="width">
            <input type="file" class="profileinfopanel2-upload" @change="updateFoodIMG(2)" :disabled="showLoading">
            <img :src="imgBaseUrl + imgArray[1]" class="food_img">
        </section>
        <section class="detail_containers">
            <input type="text" v-model="text3" disabled>
        </section>
        <section class="header_img" :style="width">
            <input type="file" class="profileinfopanel3-upload" @change="updateFoodIMG(3)" :disabled="showLoading">
            <img :src="imgBaseUrl + imgArray[2]" class="food_img">
        </section>
        <section class="detail_containers">
            <input type="text" v-model="text4" disabled>
        </section>
        <section class="header_img" :style="width">
            <input type="file" class="profileinfopanel4-upload" @change="updateFoodIMG(4)" :disabled="showLoading">
            <img :src="imgBaseUrl + imgArray[3]" class="food_img">
        </section>
        <section class="detail_containers">
            <input type="text" v-model="text5" disabled>
        </section>
        <section class="header_img" :style="width">
            <input type="file" class="profileinfopanel5-upload" @change="updateFoodIMG(5)" :disabled="showLoading">
            <img :src="imgBaseUrl + imgArray[4]" class="food_img">
        </section>
        <div class="login_container" @click="updateHomeImage">確認</div>
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
    import {shopDetails, updateHomeImage} from 'src/service/getData'
    import {getStore} from 'src/config/mUtils'
    import loading from 'src/components/common/loading'

    export default {
    	data(){
            return{
                imgBaseUrl,
                showAlert: false, 
                alertText: null,
                menu: null,
                select_model: 11,
                shopDetailData: null,
                imgArray: [],
                restaurant_id: null, //商店id值
                text1: "写真一：",
                text2: "写真二：",
                text3: "写真三：",
                text4: "写真四：",
                text5: "写真五：",
                user_id: null,
                width: "width:" + 16*0.9 + "rem",
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
                    this.imgArray = this.shopDetailData.home_image;
                }
                else{
                    this.showAlert = true;
                    this.alertText = '店舗情報がない';
                }
            },
            async updateHomeImage(){
                if(this.showLoading == true){
                    return
                }
                try{
                    let res = await updateHomeImage(this.restaurant_id, this.imgArray);
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
            async updateFoodIMG(index){
                let input = document.querySelector('.profileinfopanel'+ index +'-upload')
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
                            //this.imgArray[index-1] = res.image_path;
                            this.imgArray.splice(index-1,1,res.image_path);
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
		//bottom: 0;
		background-color: #fff;
		z-index: 12;
        padding-top: 1.95rem;
        p, span{
            font-family: Helvetica Neue,Tahoma,Arial;
        }
	}

    .login_container{
            margin: 1rem .5rem;
            @include sc(.7rem, #fff);
            background-color: #4cd964;
            padding: .5rem 0;
            border: 1px;
            border-radius: 0.15rem;
            text-align: center;
        }

    .header_img{
        margin-left: .5rem;
        position: relative;
        .food_img{
            width: 100%;
            display: block;
        }
        
        .profileinfopanel1-upload{
            display: block;
            position: absolute;
            opacity: 0;
            top: 2.35rem;
            left: 0;
            @include wh(100%,80%);
        }
        .profileinfopanel2-upload{
            display: block;
            position: absolute;
            opacity: 0;
            top: 2.35rem;
            left: 0;
            @include wh(100%,80%);
        }
        .profileinfopanel3-upload{
            display: block;
            position: absolute;
            opacity: 0;
            top: 2.35rem;
            left: 0;
            @include wh(100%,80%);
        }
        .profileinfopanel4-upload{
            display: block;
            position: absolute;
            opacity: 0;
            top: 2.35rem;
            left: 0;
            @include wh(100%,80%);
        }
        .profileinfopanel5-upload{
            display: block;
            position: absolute;
            opacity: 0;
            top: 2.35rem;
            left: 0;
            @include wh(100%,80%);
        }
    }
    .detail_containers{
        padding: .5rem;
        @include fj;
        align-items: center;
        input{
            @include sc(.6rem, rgb(0, 0, 0));
            width: 15rem;
            }    
    }
</style>
