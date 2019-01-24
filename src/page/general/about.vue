 <template>
	<div class="restContainer">
        <head-top head-title="About" go-back='true'></head-top>
        <form class="restForm">
            <section class="order_header">
                <img :src="imgBaseUrl + qmenuimg" class="header_img">
                <p class="order_time">バージョン 1.0.0</p>
            </section>
        </form>
    </div>
</template>

<script>
    import headTop from 'src/components/header/head'
    import {getStore} from 'src/config/mUtils'
    import {imgBaseUrl} from 'src/config/env'

    export default {
    	data(){
            return{
                user_id: null,
                imgBaseUrl,
                qmenuimg: 'qmenu.jpg'
            }
        },
        created(){
            this.user_id = getStore('user_id')
            if(this.user_id == null){
                this.$router.push({path: '/login'});
            }
        },
        mounted(){

        },
        components: {
            headTop,
        },
        methods: {
            
        },
        mounted() {
             
 
        }
    }
</script>
	
<style lang="scss" scoped>
    @import 'src/style/mixin';

    .order_header{
        background-color: null;
        text-align: center;
        .order_time{
            @include sc(.55rem, #999);
            line-height: 1.5rem;
        }
    }               
	
    .restContainer{
            padding-top: 1.95rem;
        }

    .restForm{
        background-color: #fff;
        margin-top: .6rem;
    }

    .header_img{
        margin-left: 5rem;
        position: relative;
        width: 6rem;
        display: block;
        }
</style>
