<template>
    <section id='foot_guide'>
        <section @click="jumpTo(0)" class="guide_item">
            <img v-if='homeStatus' :src="GLOBAL.defaults.homechoose" class="icon_style">
            <img v-else :src="GLOBAL.defaults.home" class="icon_style">
            <span>{{home_label}}</span>
        </section>
        <section @click="jumpTo(1)" class="guide_item">
            <img v-if='orderStatus' :src="GLOBAL.defaults.orderlistchoose" class="icon_style">
            <img v-else :src="GLOBAL.defaults.orderlist" class="icon_style">
            <span>{{order_label}}</span>
        </section>
        <section @click="jumpTo(2)" class="guide_item">
            <img v-if='moneyStatus' :src="GLOBAL.defaults.moneychoose" class="icon_style">
            <img v-else :src="GLOBAL.defaults.money" class="icon_style">
            <span>{{money_label}}</span>
        </section>
        <section @click="jumpTo(3)" class="guide_item">
            <img v-if='profileStatus' :src="GLOBAL.defaults.mychoose" class="icon_style">
            <img v-else :src="GLOBAL.defaults.my" class="icon_style">
            <span>{{profile_label}}</span>
        </section>
    </section>
</template>

<script>
    export default {
        data(){
            return{
                home_label: 'メニュー',
                order_label: '注文履歴',
                money_label: '売上金額',
                profile_label: '本人',
                jump_list: [
                    '/shop',
                    '/orderMain',
                    '/moneyManage',
                    '/profile'
                ]
            }
        },
        props: ['homeStatus', 'orderStatus', 'moneyStatus', 'profileStatus'],
        methods: {
        	jumpTo(index) {
        		this.$router.push(this.jump_list[index])
        	}
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../style/footer';
</style>
