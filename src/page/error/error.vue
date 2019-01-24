 <template>
	<div class="restContainer">
        <section class="order_header">
            <img :src='img' style="width: 16rem">
        </section>
    </div>
</template>

<script>
	import headTop from 'src/components/header/head'
    import {imgBaseUrl} from 'src/config/env'

    export default {
    	data(){
            return{
                img: "/img/error.jpg",
            }
        },
        created(){
        	
        },
        mounted(){

        },
        components: {
            
        },
        props:[],
        methods: {
            
        },
        mounted() {
             
 
        }
    }
</script>
	
<style lang="scss" scoped>
    @import 'src/style/mixin';

    .order_header{
        background-color: #fff;
        text-align: center;
    }               
	
    .restContainer{
        position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #fff;
        padding-top: 1.95rem;
        //margin-bottom:-1rem;
    }
 
</style>
