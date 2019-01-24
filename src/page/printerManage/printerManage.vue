<template>
    <div class="profile_page">
        <head-top go-back="true" head-title="プリンターの管理"></head-top>
        <section v-if="printStr" class="profile">
            <section class="profile-1reTe" v-for="item in printerList" :key="item._id">
                <section class="myorder" @click="editPrinter(item)">
                    <div class="myorder-div">
                        <span class="print-span">{{item.print_name}}</span>
                        <img
                            v-if="item.close==0"
                            :src="GLOBAL.defaults.open"
                            @click.stop="switchEvent(item)"
                        >
                        <img v-else :src="GLOBAL.defaults.close" @click.stop="switchEvent(item)">
                        <span class="myorder-divsvg">
                            <svg fill="#bbb">
                                <use
                                    xmlns:xlink="http://www.w3.org/1999/xlink"
                                    xlink:href="#arrow-right"
                                ></use>
                            </svg>
                        </span>
                    </div>
                </section>
            </section>

            <section class="confrim_order">
                <p @click="addPrinter">追加</p>
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
        </section>
        <section v-else>
            <p class="printer_no">まだプリンターを接続していません</p>
            <section class="confrim_order">
                <p @click="addPrinter">追加</p>
            </section>
        </section>
    </div>
</template>

<script>
import headTop from "src/components/header/head";
import { mapState, mapMutations } from "vuex";
import { getStore, setStore } from "src/config/mUtils";
import { getPrinterByRestaurantId, setPrinterAuto } from "src/service/getData";
import loading from "src/components/common/loading";
import alertTip from "src/components/common/alertTip";

export default {
    data() {
        return {
            printerList: [], //打印机列表
            shopDetailData: {
                table_num: null
            },
            restaurant_id: null,
            user_id: null,
            operation: "",
            value1: true, //组件的初始状态
            showLoading: true, //显示加载动画
            showAlert: false, //显示提示组件
            alertText: null, //提示的内容
            printStr: true,
            msg: ""
        };
    },
    created() {
        this.user_id = getStore("user_id");
        if (this.user_id == null) {
            this.$router.push({ path: "/login" });
        }
    },
    mounted() {
        this.initData();
    },
    components: {
        headTop,
        loading,
        alertTip
    },

    computed: {
        ...mapState(["userInfo"])
    },

    methods: {
        //设置打印机启用禁用
        async switchEvent(item) {
            this.shopid = getStore("shopid");
            const params = {
                close: item.close == 0 ? 1 : 0,
                auto: item.auto,
                restaurant_id: this.shopid,
                print_name: item.print_name,
                machine_code: item.machine_code,
                msign: item.msign,
                template_id: item.template_id
            };
            try {
                let res = await setPrinterAuto(params, item._id);

                item.close = item.close == 0 ? 1 : 0;
                this.showAlert = true;
                this.alertText =
                    res.status == 1
                        ? (item.close == 0 ? "プリンターオン" : "プリンターオフ")
                        : res.message;
                this.showLoading = false;
            } catch (error) {
                this.showAlert = true;
                this.alertText = "操作失敗";
                this.showLoading = false;
                throw new Error(error);
            }
        },
        //编辑打印机信息
        editPrinter(printer) {
            this.$router.push({
                path:
                    "/addPrinter?printerId=" +
                    printer._id +
                    "&printerName=" +
                    printer.print_name +
                    "&printerCode=" +
                    printer.machine_code +
                    "&printerKey=" +
                    printer.msign +
                    "&selectModel=" +
                    printer.template_id +
                    "&close=" +
                    printer.close +
                    "&auto=" +
                    printer.auto
            });
        },
        //追加打印机
        addPrinter() {
            this.$router.push({ path: "/addPrinter" });
        },
        ...mapMutations(["SAVE_AVANDER"]),
        async initData() {
            this.restaurant_id = getStore("shopid");
            this.printerList = await getPrinterByRestaurantId(
                this.restaurant_id
            );
            this.printCheck();
            this.hideLoading();
        },
        //未连接打印机时,文言显示
        async printCheck() {
            this.printStr = this.printerList.length > 0;
        },
        //生产环境与发布环境隐藏loading方式不同
        hideLoading() {
            this.showLoading = false;
        },
        closeTip() {
            this.showAlert = false;
        }
    },
    watch: {
        userInfo: function(value) {
            this.initData();
        }
    }
};
</script>

<style lang="scss" scoped>
@import "src/style/mixin";

.profile_page {
    p,
    span {
        font-family: Helvetica Neue, Tahoma, Arial;
    }
}
.profile {
    padding-top: 2.1rem;
    .profile-1reTe {
        background: $fc;
        .myorder {
            margin-top: 0.1rem;
            padding-left: 0.7rem;
            display: flex;
            // align-items: center;
            aside {
                @include wh(0.7rem, 0.7rem);
                margin-left: -0.866667rem;
                margin-right: 0.266667rem;
                display: flex;
                align-items: center;
                svg {
                    @include wh(100%, 100%);
                }
            }
            .myorder-div {
                width: 100%;
                border-bottom: 1px solid #f1f1f1;
                padding: 0.433333rem 0.266667rem 0.433333rem 0;
                @include sc(0.7rem, #333);
                display: flex;
                justify-content: space-between;
                span {
                    display: block;
                }
                .print-span {
                    @include wh(6.5rem, 0.8rem);
                }
                .myorder-divsvg {
                    margin-left: -1rem;
                    @include wh(0.46667rem, 0.466667rem);
                    svg {
                        @include wh(100%, 100%);
                    }
                }
                .myorder-divsvg-1 {
                    color: Lime;
                }
                img {
                    // pointer-events: none;
                    margin-left: 4rem;
                    //display: block;
                    @include wh(1.7rem, 1rem);
                    // margin-right:10rem
                    float: right;
                }
            }
        }
        .myorder:nth-of-type(3) .myorder-div {
            border: 0;
        }
    }
}
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
.printer_no {
    @include sc(0.6rem, #999);
    padding-top: 12.3rem;
    text-align: center;
    font-size: 0.85rem;
}
.coverpart {
    @include wh(100%, 100%);
    @include allcover;
    .cover-background {
        @include wh(100%, 100%);
        @include allcover;
        background: #000;
        z-index: 100;
        opacity: 0.2;
    }
    .alet_container {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 200;
    }
    .cover-content {
        width: 90%;
        background: $fc;
        padding: 0.5rem;
        position: absolute;
        top: 20%;
        left: 5%;
        z-index: 1000;
        @include borderRadius(0.7rem);
        .sa-icon {
            @include wh(2.4rem, 2.4rem);
            border: 4px solid #f8bb86;
            @include borderRadius(50%);
            margin: 20px auto;
            position: relative;
            .sa-body {
                @include wh(0.2rem, 0.99rem);
                @include borderRadius(10%);
                background: #f8bb86;
                @include cl;
                top: 0.3rem;
            }
            .sa-dot {
                @include wh(0.24rem, 0.24rem);
                @include borderRadius(30%);
                background: #f8bb86;
                @include cl;
                bottom: 0.3rem;
            }
        }
        h3 {
            width: 100%;
            text-align: center;
            @include sc(1.3rem, #575757);
            font-weight: 500;
            margin: 0.2rem 0;
        }
        .sa-botton {
            width: 100%;
            text-align: center;

            button {
                display: inline-block;
                padding: 0.4rem 1rem;
                @include borderRadius(5px);
                @include sc(0.6rem, $fc);
                letter-spacing: 1px;
                margin-top: 0.5rem;
            }
            .waiting {
                @include wh(6rem, 1.7rem);
                background: #f7744c;
                margin-right: 0.4rem;
            }
            .quitlogin {
                @include wh(6rem, 1.7rem);
                background: #56d176;
            }
        }
    }
}
</style>
