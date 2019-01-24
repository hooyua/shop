 <template>
	<div class="restContainer">
        <head-top head-title="プリンターの設定" go-back='true'></head-top>
        <form class="restForm">
            <section class="input_container phone_number">
                <select v-model="select_models">
                    <option value>QRコード印刷用プリンターを選択してください</option>
                    <option v-for="(item,index) in discount" v-bind:value="item._id" :key="index">{{ item.print_name }}</option>
                </select>
            </section>
        </form>
        <section class="confrim_order">
            <p @click="save">確認</p>
        </section>
        <alert-tip v-if="showAlert"  @closeTip="closeTip" :alertText="alertText"></alert-tip>
    </div>
</template>

<script>
	import headTop from 'src/components/header/head'
    import {updateshopprinterid, getPrinterByRestaurantId, shopDetails} from 'src/service/getData'
    import {getStore, setStore} from 'src/config/mUtils'
    import alertTip from 'src/components/common/alertTip'

    export default {
    	data(){
            return{
                tablecount: null,
                showAlert: false, 
                alertText: null,
                shopid: null,
                user_id: null,
                select_models: '',
                discount: [],
                shopDetailData:{}
            };
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
        },
        props:[],
        methods: {
            closeTip(){
                this.showAlert = false;
                if(this.alertText == '設定成功'){
                    this.$router.go(-1);
                }
            },
            //初始化获取信息
            async initData() {
                this.shopid = getStore("shopid");
                this.discount = await getPrinterByRestaurantId(this.shopid);
                this.shopDetailData = await shopDetails(this.shopid);
                if(this.shopDetailData.printer_id != ''){
                    this.select_models = this.shopDetailData.printer_id
                }
            },
            async save() {
                this.shopid = getStore('shopid')
                if(this.select_models != '') {
                    let res = await updateshopprinterid(this.shopid, this.select_models);
                    if (res.status >= 1) {
                        this.showAlert = true;
                        this.alertText = '設定成功'; 
                    }
                    else{
                        this.showAlert = true;
                        this.alertText = '設定失敗';
                    }
                } else {
                        this.showAlert = true;
                        this.alertText = '未選択';
                }
            },
        },
    }
</script>
	
<style lang="scss" scoped>
    @import 'src/style/mixin';
	
    .restContainer{
        margin-bottom: 1.95rem;
        padding-top: 1.95rem;
        }

    .restForm{
        background-color: #fff;
        margin-top: .5rem;
        .input_container{
            display: flex;
            height: 2rem;
            justify-content: space-between;
            padding: .6rem .8rem;
            border-bottom: 1px solid #f1f1f1;
            input{
                @include sc(.7rem, #666);
            }
            button{
                @include sc(.65rem, #fff);
                font-family: Helvetica Neue,Tahoma,Arial;
                padding: .28rem .4rem;
                border: 1px;
                border-radius: 0.15rem;
            }
        }
        .phone_number{
            padding: .4rem .8rem;
        }
    }
    .input{
    width:  450px;
    height: 45px;
    display: block;
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
