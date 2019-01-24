 <template>
	<div class="rating_page">
        <head-top head-title="カスタム期間内の金額" go-back='true'></head-top>
	<section>
        <section class="detail_container">
            <p>開始時間：</p>
            <datepicker type="day" v-model="start_datetime" @select-time="initData" :placeholder="start_datetime" class="datepicker"></datepicker>
        </section>
        <section class="detail_container">
            <p>終了時間：</p>
            <datepicker type="day" v-model="end_datetime" @select-time="initData" :placeholder="end_datetime" class="datepicker"></datepicker>
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
    <alert-tip v-if="showAlert"  @closeTip="showAlert = false;" :alertText="alertText"></alert-tip>
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
    import alertTip from 'src/components/common/alertTip'
    import loading from 'src/components/common/loading'

    export default {
    	data(){
            return{
                inputPriceValue: 0,
                start_datetime: dtime(new Date()).format('YYYY-MM-DD'),
                end_datetime: dtime(new Date()).format('YYYY-MM-DD'),
                start_datetimes: null,
                end_datetimes: null,
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
				options: {
                    title: 'カスタム期間内の店の総売上高',
                    fillColor: 'red',
                },
                name: '',
                value: 0,
                total_amounts: 0,
                showAlert: false, 
                alertText: null,
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
            alertTip,
            loading,
        },
        props:[],
        methods: {
            //初始化获取信息
            async initData(){
                this.show = true;
                this.showLoading = true;

                this.data = [];
                var date = new Date(this.start_datetime);
                var dates = new Date(this.end_datetime);
                this.total_amounts = 0;
                this.user_id = getStore('user_id');
                this.shopOpenList = await getOpenShop(this.user_id);
                if(this.shopOpenList.length > 0){
                    var y = date.getFullYear(); //年
                    var m = date.getMonth()+1; //月
                    var d = date.getDate(); //日
                    m = m < 10 ? '0' + m: m;
                    d = d < 10 ? '0' + d: d;
                    this.start_datetimes = y + "-" + m + "-" + d;
                    y = dates.getFullYear();
                    m = dates.getMonth()+1;
                    d = dates.getDate();
                    m = m < 10 ? '0' + m: m;
                    d = d < 10 ? '0' + d: d;
                    this.end_datetimes = y + "-" + m + "-" + d;

                    if(this.start_datetimes <= this.end_datetimes){
                        dates.setDate(dates.getDate()+1);
                        y = dates.getFullYear();
                        m = dates.getMonth()+1;
                        d = dates.getDate();
                        m = m < 10 ? '0' + m: m;
                        d = d < 10 ? '0' + d: d;
                        this.end_datetimes = y + "-" + m + "-" + d;
                        let res = await getSectionOrders(this.shopOpenList[0].id, this.start_datetimes, this.end_datetimes, this.offset, this.limit);
                        this.orderList = [...res];
                        for(let j of this.orderList){
                            this.total_amounts += j.total_amount;
                        }

                        dates.setDate(dates.getDate()-1);
                        y = dates.getFullYear();
                        m = dates.getMonth()+1;
                        d = dates.getDate();
                        m = m < 10 ? '0' + m: m;
                        d = d < 10 ? '0' + d: d;
                        this.end_datetimes = y + "-" + m + "-" + d;
                        for(var i=0; i<5; i++){
                            if(i==2){
                                this.data.push({name: this.start_datetimes + " ~ " + this.end_datetimes, value: this.total_amounts});
                            }else{
                                this.data.push({name: '', value: ''});
                            }
                        }
                    }
                    else{
                        this.showAlert = true;
                        this.alertText = '開始時間はより終了時間';
                    }
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
