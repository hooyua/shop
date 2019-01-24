 <template>
    <div class="add_printer">
        <head-top
            :head-title="this.printerInfo.printerId == '' ?'プリンター追加':'プリンター変更'"
            go-back="true"
            printer-del="true"
            :printerid="printerInfo.printerId"
            @delPrinter="delPrinter"
        ></head-top>
        <form class="addPrinterForm">
            <section class="input_container">
                <span>名前</span>
                <input type="text" maxlength="30" v-model="printerInfo.printerName">
            </section>
            <section class="input_container">
                <span>端末番号</span>
                <input type="text" maxlength="30" v-model="printerInfo.printerCode">
            </section>
            <section class="input_container">
                <span>キー</span>
                <input type="text" maxlength="30" v-model="printerInfo.printerKey">
            </section>
            <section class="input_container">
                <img v-if="autoflag" :src="GLOBAL.defaults.choose" @click="changeAuto(1)">
                <img v-else :src="GLOBAL.defaults.unchoose" @click="changeAuto(1)">
                <span>レジ印刷</span>
                <img v-if="autoflag" :src="GLOBAL.defaults.unchoose" @click="changeAuto(0)">
                <img v-else :src="GLOBAL.defaults.choose" @click="changeAuto(0)">
                <span>キッチン印刷</span>
            </section>
            <section class="input_container">
                <span>印刷タイプの選択</span>
                <select v-model="printerInfo.selectModel" v-on:change="indexSelect">
                    <option value>印刷タイプを選択してください</option>
                    <option v-for="(item,index) in printerTemplateList" :key="index" v-bind:value="item.template_id" >{{ item.template_name }}</option>
                </select>
            </section>
            <section class="imgStyle" style="margin-top: .6rem;">
                <img :src="imagePath" :class="printerInfo.selectModel==''?'kong':'printer_amount'">
            </section>
            <section class="input_container" style="margin-top: .6rem; ">
                <p @click="printPrinter()">テストプリント</p>
            </section>
            <input type="hidden" v-model="printerInfo.printerId">
        </form>
        <section class="confrim_order">
            <p @click="submitPrinter">確認</p>
        </section>
        <transition name="loading">
            <loading v-show="showLoading"></loading>
        </transition>
        <alert-tip
            v-if="showAlert"
            :showHide="showAlert"
            @closeTip="closeTip"
            :alertText="alertText"
        ></alert-tip>
    </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import headTop from "src/components/header/head";
import loading from "src/components/common/loading";
import {
    modifyPrinter,
    addPrinter,
    getPrinterTemplateList,
    getPrinterTemplateByRestaurantId,
    setPrinterAuto,
    testPrinter,
    deletePrinter
} from "src/service/getData";
import { loadMore } from "src/components/common/mixin";
import { imgBaseUrl } from "src/config/env";
import { getStore } from "src/config/mUtils";
import alertTip from "src/components/common/alertTip";
export default {
    data() {
        return {
            shopid: "", //店铺ID
            showLoading: true, //显示加载动画
            printerInfo: {
                //获取到的店铺信息
                printerId: "", //打印机ID
                printerName: "", //打印机名
                printerCode: "", //打印机机器码
                printerKey: "", //打印机密钥
                selectModel: ""
            },
            eventFlag: true,
            showAlert: false, //显示提示组件
            alertText: null, //提示的内容
            imagePath: "",
            imgBaseUrl,
            imageInfo: "",
            autoflag: true,
            printerTemplateList: []
        };
    },
    async created() {
        this.user_id = getStore("user_id");
        if (this.user_id == null) {
            this.$router.push({ path: "/login" });
        }

        //获取打印机ID，存在为修正，不存在追加
        if (this.$route.query.printerId != undefined) {
            this.printerInfo.printerId = this.$route.query.printerId;
            this.printerInfo.printerName = this.$route.query.printerName;
            this.printerInfo.printerCode = this.$route.query.printerCode;
            this.printerInfo.printerKey = this.$route.query.printerKey;
            this.printerInfo.selectModel = this.$route.query.selectModel;
            this.printerInfo.auto = this.$route.query.auto;
            this.printerInfo.close = this.$route.query.close;
            this.autoflag = this.printerInfo.auto === 1;
            //显示模版图片
            this.getModelImage();
        } else {
            //新增时默认为启用状态;
            this.printerInfo.close = 0;
        }
    },
    mounted() {
        this.initData();
    },
    mixins: [loadMore],
    components: {
        headTop,
        loading,
        alertTip
    },
    computed: {
        ...mapState([])
    },
    methods: {
        //删除按钮
        async delPrinter(id) {
            if (id == "") {
                this.eventFlag = false;
                this.showAlert = true;
                this.alertText = "no printer";
                return;
            }
            let res = "";
            try {
                //删除
                res = await deletePrinter(id);
                if (res.status == 1) {
                    this.showAlert = true;
                    this.alertText = "削除成功";
                }
                this.eventFlag = true;
                this.showLoading = false;
            } catch (error) {
                this.showAlert = true;
                this.alertText = "削除失敗";
                this.showLoading = false;
                this.eventFlag = false;
                throw new Error(error);
            }
        },
        //测试打印机连接状态
        async printPrinter() {
            this.eventFlag = false;
            if (!this.printerInfo.printerCode) {
                this.showAlert = true;
                this.alertText = "端末番号を入力してください！";
                return;
            } else if (!this.printerInfo.printerKey) {
                this.showAlert = true;
                this.alertText = "キーを入力してください！";
                return;
            }
            let res = "";
            try {
                // 打印机ID TODO
                res = await testPrinter(
                     this.printerInfo.printerCode
                );
                if (res.status == 1) {
                    this.showAlert = true;
                    this.alertText = res.message;
                }
                this.showLoading = false;
            } catch (error) {
                this.showAlert = true;
                this.alertText = "印刷失敗";
                this.showLoading = false;
                throw new Error(error);
            }
        },
        async changeAuto(_v) {
            this.autoflag = _v === 1;
        },
        //初始化获取信息
        async initData() {
            this.shopid = getStore("shopid");
            this.printerTemplateList = await getPrinterTemplateList();
            this.indexSelect();
            this.showLoading = false;
        },
        //添加打印机or修正
        async submitPrinter() {
            if (this.showLoading == true) {
                return;
            }
            if (!this.printerInfo.printerName) {
                this.showAlert = true;
                this.eventFlag = false;
                this.alertText = "名前を入力してください！";
                return;
            } else if (!this.printerInfo.printerCode) {
                this.showAlert = true;
                this.eventFlag = false;
                this.alertText = "端末番号を入力してください！";
                return;
            } else if (!this.printerInfo.printerKey) {
                this.showAlert = true;
                this.eventFlag = false;
                this.alertText = "キーを入力してください！";
                return;
            } else if (!this.printerInfo.selectModel) {
                this.showAlert = true;
                this.eventFlag = false;
                this.alertText = "印刷の型を選択してください！";
                return;
            }

            const params = {
                print_name: this.printerInfo.printerName,
                machine_code: this.printerInfo.printerCode,
                msign: this.printerInfo.printerKey,
                template_id: this.printerInfo.selectModel,
                auto: this.autoflag ? 1 : 0,
                close: this.printerInfo.close,

                restaurant_id: this.shopid
            };
            try {
                let res = "";
                // 打印机ID存在更新，不存在追加
                if (this.printerInfo.printerId) {
                    res = await setPrinterAuto(
                        params,
                        this.printerInfo.printerId
                    );
                } else {
                    res = await addPrinter(params);
                }
                this.showAlert = true;
                if (res.status == 1) {
                    this.alertText = "追加成功";
                    this.eventFlag = true;
                } else {
                    this.eventFlag = false;
                    this.alertText = res.message;
                }
            } catch (error) {
                this.showAlert = true;
                this.alertText = "追加失敗";
                this.showLoading = false;
                this.eventFlag = false;
                throw new Error(error);
            }
        },
        closeTip() {
            this.showAlert = false;
            if (this.eventFlag) {
                this.$router.go(-1);
            }
        },
        async indexSelect() {
            if (!this.printerInfo.selectModel) {
                this.imagePath = this.GLOBAL.defaults.imgNa;
            } else {
                this.getModelImage();
            }
        },
        async getModelImage() {
            //模版图片显示
            this.imageInfo = await getPrinterTemplateByRestaurantId(
                this.printerInfo.selectModel
            );
            this.imagePath = imgBaseUrl + this.imageInfo.template_desc;
        },
        ...mapMutations(["SAVE_ORDER"])
    }
};
</script>
  
<style lang="scss" scoped>
@import "src/style/mixin";

.add_printer {
    margin-bottom: 1.95rem;
    p,
    span {
        font-family: Helvetica Neue, Tahoma, Arial;
    }
}

.addPrinterForm {
    margin-top: 2.3rem;

    .input_container {
        background: $fc;
        display: flex;
        justify-content: space-between;
        padding: 0.6rem 0.8rem;
        border-bottom: 1px solid #f1f1f1;
        input {
            background-color: #fff;
            text-align: right;
            @include wh(6rem, 1rem);
            @include sc(0.6rem, rgb(0, 0, 0));
            width: 15rem;
        }
        select {
            @include sc(0.6rem, #666);
            width: 9rem;
        }
        img {
            //padding: 0rem 0rem 0rem 0rem;
            //margin-left: 0.1rem;
            //@include wh(1.1rem, 1.1rem);
            //width: 1.1rem;
            height: 1.1rem;
        }
        span {
            background-color: #fff;
            display: block;
            @include sc(0.6rem, #999);
            padding-top: 0rem;
            padding-left: 0.35rem;
            @include wh(25.8rem, 0.8rem);
        }
        p {
            color: #da2020;
            font-size: 0.6rem;
            position: relative;
            margin: auto;
        }
    }

    .imgStyle {
        @include wh(14rem, 8rem);
        display: block;
        padding-left: 0rem;
        padding-right: 0rem;
        background-color: #d8d8d8;
        margin: 0 auto;
        text-align: center;
        .printer_amount {
            margin: 0 auto;
            display: block;
            padding-top: 0.15rem;
            @include wh(14rem, 8rem);
        }
        .kong {
            margin: 0 auto;
            display: block;
            padding-top: 3rem;
            @include wh(1.5rem, 1.5rem);
        }
    }
}

//底部按钮
.confrim_order {
    display: flex;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 2rem;
    z-index: 999;
    p {
        line-height: 2rem;
        @include sc(0.75rem, #fff);
    }
    p:nth-of-type(1) {
        flex: 1;
        background-color: #da2020;
        text-align: center;
        border-right: 1px solid #f1f1f1;
    }
}
</style>
