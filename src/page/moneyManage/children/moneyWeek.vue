 <template>
	<div class="rating_page">
        <head-top head-title="最近５週間の売り上げ金額" go-back='true'></head-top>
	<section>
        <section class="detail_container">
            <p>時間：</p>
            <datepicker type="week" v-model="tmp_datetime" @select-time="initData" :placeholder="tmp_datetime" class="datepicker"></datepicker>
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
                tmp_datetime: dtime(new Date()).format('YYYY-MM-DD'),
                tmp_datetimes: dtime(new Date()).format('YYYY-MM-DD'),
                year: dtime(new Date()).format('YYYY'),
                month: dtime(new Date()).format('MM'),
                day: dtime(new Date()).format('DD'),
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
                    title: '最近５週間の店の総売上高',
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
                var name = null;
                var date = new Date(this.tmp_datetime);
                var weekday = date.getDay()||7; //获取星期几,getDay()返回值是 0（周日） 到 6（周六） 之间的一个整数。0||7为7，即weekday的值为1-7
                date.setDate(date.getDate()-weekday+1);//往前算（weekday-1）天，年份、月份会自动变化
                this.user_id = getStore('user_id');
                this.shopOpenList = await getOpenShop(this.user_id);

                date.setDate(date.getDate()-35);
                if(this.shopOpenList.length > 0){
                    for(var i=0; i<5; i++){
                        this.total_amounts = 0;
                        date.setDate(date.getDate()+7);//往后算1天，年份、月份会自动变化
                        var y = date.getFullYear(); //年
                        var m = date.getMonth()+1; //月
                        var d = date.getDate(); //日
                        m = m < 10 ? '0' + m: m;
                        d = d < 10 ? '0' + d: d;
                        this.start_datetime = y + "-" + m + "-" + d;
                        name = m + "-" + d + '/~/';
                        date.setDate(date.getDate()+7);
                        y = date.getFullYear();
                        m = date.getMonth()+1;
                        d = date.getDate();
                        m = m < 10 ? '0' + m: m;
                        d = d < 10 ? '0' + d: d;
                        this.end_datetime = y + "-" + m + "-" + d;
                        date.setDate(date.getDate()-1);
                        y = date.getFullYear();
                        m = date.getMonth()+1;
                        d = date.getDate();
                        m = m < 10 ? '0' + m: m;
                        d = d < 10 ? '0' + d: d;
                        name += m + "-" + d;
                        date.setDate(date.getDate()-6);
                        y = date.getFullYear();
                        m = date.getMonth()+1;
                        d = date.getDate();
                        m = m < 10 ? '0' + m: m;
                        d = d < 10 ? '0' + d: d;

                        let res = await getSectionOrders(this.shopOpenList[0].id, this.start_datetime, this.end_datetime, this.offset, this.limit);
                        this.orderList = [...res];
                        for(let j of this.orderList){
                            this.total_amounts += j.total_amount;
                        }
                        if(this.total_amounts == 0){
                            this.datas.push({name: name, value: ''}); 
                        }else{
                            this.datas.push({name: name, value: this.total_amounts});
                        }
                    }
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
        width: 60%;
        p{
            @include sc(.6rem, #666);
        }
        .datepicker{
            width: 60%;
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
