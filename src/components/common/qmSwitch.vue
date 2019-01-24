<template>
    <div>
        <span
            class="qmenu-switch"
            :class="{'qmenu-switch-on' : me_checked}"
            :value="value"
            @click="toggle"
        ></span>
    </div>
</template>

<script>
export default {
    props: {
        value: {
            type: Boolean,
            default: true
        },
        data: {
            type: Object,
            default: null
        },
        printer_id: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            me_checked: this.value
        };
    },
    watch: {
        me_checked(val) {
            this.$emit("input", val);
        }
    },
    methods: {
        toggle() {
            this.me_checked = !this.me_checked;
            if (this.printer_id != "") {
                this.$emit("switchEvent", this.me_checked, this.printer_id);
            } else {
                this.$emit("switchEvent", this.me_checked, this.data);
            }
        }
    }
};
</script>

<style lang="scss" scoped>
@import "../../style/mixin";
.qmenu-switch {
    display: block;
    position: relative;
    width: 2rem;
    height: 1rem;
    margin-top: 0.08rem;
    margin-left: 0.25rem;
    border: 0rem solid #dfdfdf;
    outline: 0;
    border-radius: 0.9rem;
    box-sizing: border-box;
    background-color: #dfdfdf;
    transition: background-color 0.1s, border 0.1s;
    cursor: pointer;
}
.qmenu-switch:before {
    content: " ";
    position: absolute;
    top: 0.05rem;
    left: 0;
    width: 0.9rem;
    height: 0.9rem;
    border-radius: 2rem;
    background-color: #fdfdfd;
    transition: transform 0.35s cubic-bezier(0.45, 1, 0.4, 1);
}
.qmenu-switch:after {
    content: " ";
    position: absolute;
    top: 0.05rem;
    left: 0;
    width: 0.9rem;
    height: 0.9rem;
    border-radius: 2rem;
    background-color: #ffffff;
    box-shadow: 0 1px 3px rgba(192, 180, 180, 0.4);
    transition: transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
}
.qmenu-switch-on {
    border-color: #1aad19;
    background-color: #1aad19;
}
.qmenu-switch-on:before {
    border-color: #1aad19;
    background-color: #1aad19;
}
.qmenu-switch-on:after {
    transform: translateX(1rem);
}
</style>
