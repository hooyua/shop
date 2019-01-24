 <template>
	<div class="rating_page">
        <head-top :head-title="name" go-back='true'></head-top>
        <section class="header_img">
            <img :src="imgBaseUrl + image_path" class="food_img">
        </section>
        <section class="detail_container">
            <section class="detail_left">
                <p>{{name}}</p>
                <p>{{price}} 円</p>
                <p>{{description}}</p>
            </section>
        </section>
    </div>
</template>

<script>
	import headTop from 'src/components/header/head'
    import {imgBaseUrl} from 'src/config/env'
    import {getStore} from 'src/config/mUtils'

    export default {
    	data(){
            return{
                image_path: null,
                name: null,
                price: null,
                imgBaseUrl,
                inputPriceValue: '',
                inputNameValue: '',
                user_id: null,
                description: null
            }
        },
        created(){
            this.user_id = getStore('user_id')
            if(this.user_id == null){
                this.$router.push({path: '/login'});
            }
        	this.image_path = this.$route.query.image_path;
            this.name = this.$route.query.name;
            this.price = this.$route.query.price;
            this.description = this.$route.query.description;
            if(this.description == ''){
                this.description = 'しばらくは食べ物の情報がない';
            }
        },
        components: {
        	headTop,
        },
        props:[],
        methods: {
        }
    }
</script>
	
<style lang="scss" scoped>
    @import 'src/style/mixin';
    input:disabled{
        background-color:#fff;
        @include sc(.7rem, #333);
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
    .header_img{
        position: relative;
        .food_img{
            width: 100%;
            display: block;
        }
    }
    .detail_container{
        padding: .5rem;
        @include fj;
        align-items: center;
        .detail_left{
            p:nth-of-type(1){
                @include sc(.7rem, #333);
                margin-bottom: .2rem;
                font-weight: bold;
            }
            p:nth-of-type(2){
                @include sc(.6rem, #333);
                margin-bottom: .2rem;
            }
            p:nth-of-type(3){
                @include sc(.6rem, #333);
                margin-bottom: .2rem;
            }
        }
    }
    .input{
    width:  450px;
    height: 45px;
    display: block;
    }
</style>
