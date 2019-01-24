 <template>
	<div class="rating_page">
        <head-top head-title="料理の種類を追加" go-back='true'></head-top>
        <section class="detail_container">
            <input type="text" placeholder="ここに名前を書いてください" maxlength="10" v-model="inputNameValue">
        </section>
        <section class="confrim_order">
            <p @click="addFoodType">追加</p>
        </section>
        <alert-tip v-if="showAlert"  @closeTip="closeTip" :alertText="alertText"></alert-tip>
    </div>
</template>

<script>
	import headTop from 'src/components/header/head'
    import {addCategory, getMenu} from 'src/service/getData'
    import alertTip from 'src/components/common/alertTip'
    import {getStore} from 'src/config/mUtils'

    export default {
    	data(){
            return{
                inputNameValue: '',
                menu: null,
                showAlert: false,
                alertText: null,
                restaurant_id: null,
                user_id: null,
            }
        },
        created(){
            this.user_id = getStore('user_id')
            if(this.user_id == null){
                this.$router.push({path: '/login'});
            }
            this.restaurant_id = getStore('shopid');
        },
        components: {
            headTop,
            alertTip,
        },
        props:[],
        methods: {
            async addFoodType(){
                if (this.inputNameValue ==''){
                    this.showAlert = true;
                    this.alertText = '名前を入力してください！';
                    return
                }
                this.menu = await getMenu({restaurant_id: this.restaurant_id, allMenu: true, time: new Date().getTime()});
                var exist = 0
                for (var menu_tmp in this.menu) {
                    if(this.inputNameValue == this.menu[menu_tmp].name){
                       exist = 1
                       break 
                    }
                }
                if (exist == 1){
                    //alert("exist")
                    this.showAlert = true;
                    this.alertText = '名前重複';
                } else {
                    const params = {
                        name: this.inputNameValue,
                        description: this.inputNameValue,
                        restaurant_id: this.restaurant_id,
                    }
                    try{
                        const result = await addCategory(params);
                        if (result.status == 1) {
                            //alert("success");
                            this.showAlert = true;
                            this.alertText = '追加成功';
                        }
                        else{
                            this.showAlert = true;
                            this.alertText = '追加失敗';
                        }
                    }catch(err){
                        console.log(err)
                    }
                }
                
            },
            closeTip(){
                this.showAlert = false;
                if(this.alertText === "追加成功"){
                    this.$router.go(-1);
                }
            },
        }
    }
</script>
	
<style lang="scss" scoped>
    @import 'src/style/mixin';
	
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
    .description{
        @include sc(.6rem, #666);
        margin-top: .5rem;
        line-height: .8rem;
        bottom: .2rem;
        padding: 0 .4rem;
    }
    .detail_container{
        padding: .5rem;
        @include fj;
        align-items: center;
        input{
                @include sc(.6rem, #666);
                width: 12rem;
            }
    }
    .sa-botton{
        width:100%;
        text-align:center;

        button{
            display:inline-block;
            padding:.4rem 1rem;
            @include borderRadius(5px);
            @include sc(.6rem,$fc);
            letter-spacing:1px;
            margin-top:26px;
        }
        .quitlogin{
            background:#56d176;
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
