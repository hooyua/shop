 <template>
	<div class="loading_container">
		<vue-loading type="spiningDubbles" color="rgb(221, 49, 49)" :size="{ width: '50px', height: '50px' }"></vue-loading>
	</div>
</template>

<script>
    export default {
    	data(){
            return{
                positionY: 0,
                timer: null,
            }
        },
        mounted(){
        	this.timer = setInterval(() => {
        		this.positionY ++;
        	}, 600)
        },
        beforeDestroy(){
        	clearInterval(this.timer);
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../style/mixin';
	@keyframes load{
		0%   {transform: translateY(0px);}
		50%  {transform: translateY(-50px);}
		100% {transform: translateY(0px);}
	}
	@keyframes ellipse{
		0%   {transform: scale(1);}
		50%  {transform: scale(0.3);}
		100% {transform: scale(1);}
	}
    .loading_container{
    	position: fixed;
    	top: 50%;
    	left: 50%;
    	transform: translate(-50%, -50%);
    	@include wh(2.5rem, 2.5rem);
    }
	.load_ellipse{
		position: absolute;
		@include wh(2.6rem, 2rem);
		top: 2.2rem;
        left: 0.2rem;
		z-index: 10;
		animation: ellipse .6s infinite ease-in-out;
	}
</style>
