 <template>
	<div class="rating_page">
        <head-top head-title="最近５ヶ月間の売り上げ金額" go-back='true'></head-top>
	<section>
        <section class="detail_container">
            <p>時間：</p>
            <datepicker type="month" v-model="tmp_datetime" @select-time="initData" :placeholder="tmp_datetime" class="datepicker"></datepicker>
        </section>
	</section>
    <div id="app">
        <schart class="wrapper" :canvasId="canvasId" :type="type" :data="data" :options="options"></schart>
    </div>
    <section class="coverpart" v-if="show">
            <div class="alet_container">
                <section class="cover-background"></section>
            </div>
    </section>
    <transition name="loading">
        <loading v-show="showLoading"></loading>
    </transition>
    </div>
</template>

<script>
    import headTop from 'src/components/header/head'
    import dtime from 'time-formater'
    import {getOpenShop, getSectionOrders} from 'src/service/getData'
    import {getStore} from 'src/config/mUtils'
    import Schart from 'vue-schart';
    import Datepicker from 'src/components/common/datepicker'
    import loading from 'src/components/common/loading'

    export default {
    	data(){
            return{
                inputPriceValue: 0,
                start_datetime: null,
                end_datetime: null,
                tmp_datetime: dtime(new Date()).format('YYYY-MM'),
                orderList: [], //订单列表
                offset: 0, 
                limit: 0,
                shopOpenList: [],
                user_id: null,
                canvasId: 'myCanvas',
				type: 'bar',
                data: [],
                datas: [],
				options: {
                    title: '最近５ヶ月間の店の総売上高',
                    fillColor: 'red',
                },
                name: '',
                value: 0,
                total_amounts: 0,
                showLoading: true, //显示加载动画
                show: false,
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
            Schart,
            Datepicker,
            loading,
        },
        props:[],
        methods: {
            //初始化获取信息
            async initData(){
                this.show = true;
                this.showLoading = true;

                this.data = [];
                this.datas = [];
                var date = new Date(this.tmp_datetime);
                this.user_id = getStore('user_id');
                this.shopOpenList = await getOpenShop(this.user_id);
                var y = date.getFullYear(); //年
                var m = date.getMonth()+1; //月

                if(this.shopOpenList.length > 0){
                    for(var i=0; i<5; i++){
                        this.total_amounts = 0;
                        // var y = date.getFullYear(); //年
                        // var m = date.getMonth()+1; //月
                        if(i != 0){
                            m = m - 1;
                            if(m == 0){
                                m = 12;
                                y = y - 1;
                            }
                        }
                        m = m < 10 ? '0' + m: m;
                        this.start_datetime = y + "-" + m;
                        m = Number(m);
                        m = m + 1;
                        if(m == 13){
                            m = 1;
                            y = y + 1;
                        }
                        m = m < 10 ? '0' + m: m;
                        this.end_datetime = y + "-" + m;
                        m = Number(m);
                        m = m - 1;
                        if(m == 0){
                            m = 12;
                            y = y - 1;
                        }

                        let res = await getSectionOrders(this.shopOpenList[0].id, this.start_datetime, this.end_datetime, this.offset, this.limit);
                        this.orderList = [...res];
                        for(let j of this.orderList){
                            this.total_amounts += j.total_amount;
                        }
                        if(this.total_amounts == 0){
                            this.datas.push({name: y + "-" + m, value: ''}); 
                        }else{
                            this.datas.push({name: y + "-" + m, value: this.total_amounts});
                        }
                    }
                    this.datas.reverse();
                    this.data =  this.datas;
                }
                this.showLoading = false;
                this.show = false;
            },
        }
    }
</script>
	
<style lang="scss" scoped>
    @import 'src/style/mixin';

    .wrapper{
        width: 15rem;
        height: 15rem;
    }
	
	.rating_page{
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #fff;
		z-index: 100;
        padding-top: 1.95rem;
        p, span{
            font-family: Helvetica Neue,Tahoma,Arial;
        }
	}
    .detail_container{
        padding: .5rem;
        @include fj;
        align-items: center;
        text-align: left;
        width: 50%;
        p{
            @include sc(.6rem, #666);
        }
        .datepicker{
            width: 50%;
        }
    }
    .coverpart{
        @include wh(100%,100%);
        @include allcover;
        .cover-background{
            @include wh(100%,100%);
            @include allcover;
            background:#000;
            z-index:100;
            opacity:0;
        }
        .alet_container{
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 200;
        }
    }
</style>
