 <template>
    <div class="rating_page">
        <head-top head-title="本人の情報" go-back='true'></head-top>
        <section class="profile-info">
            <section class="headportrait">
                <input type="file" class="profileinfopanel-upload" @change="uploadAvatar" :disabled="showLoading">
                <h2>写真</h2>
                <div class="headportrait-div">
                    <img  v-if="userInfo" :src="imgBaseUrl + userInfo.avatar" class="headportrait-div-top">
                    <span class="headportrait-div-top" v-else>
                        <svg>
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#avatar-default"></use>
                        </svg>
                    </span>
                    <span class="headportrait-div-bottom">
                        <svg fill="#d8d8d8">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                        </svg>
                    </span>
                </div>
            </section>
            <section @click="linksetusername" class="info-router">
                <section class="headportrait headportraitwo">
                    <h2>名前</h2>
                    <div class="headportrait-div">
                        <p>{{username}}</p>
                        <span class="headportrait-div-bottom">
                            <svg fill="#d8d8d8">
                                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                            </svg>
                        </span>
                    </div>
                </section>
            </section>
            <section @click="linkreset" class="info-router">
                <section class="headportrait headportraitwo">
                        <h2>パスワード</h2>
                        <div class="headportrait-div">
                            <p>パスワードリセット</p>
                            <span class="headportrait-div-bottom">
                                <svg fill="#d8d8d8">
                                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                                </svg>
                            </span>
                        </div>
                </section>
            </section>
            <section class="confrim_order">
                <p @click="exitlogin">ログアウト</p>
            </section>
        </section>

        <section class="coverpart" v-if="show">
            <section class="cover-background"></section>
            <section class="cover-content " :class="{'cover-animate' : isEnter, 'cover-animate-leave' : isLeave}">
                <div class="sa-icon">
                    <img :src='GLOBAL.defaults.infoico'>
                </div>
                <h2>ログアウトの確認</h2>
                <div class="sa-botton">
                    <div class="confrim" @click="waitingThing">キャンセル</div>
                    <div class="confrims" @click="outLogin">確認</div>
                </div>
            </section>
        </section>
        <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
        <transition name="loading">
            <loading v-show="showLoading"></loading>
        </transition>
        <transition name="router-slid" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
    import {mapMutations, mapState} from 'vuex'
    import headTop from 'src/components/header/head'
    import {signout} from 'src/service/getData'
    import alertTip from 'src/components/common/alertTip'
    import {imgBaseUrl} from 'src/config/env'
    import {getStore, removeStore} from 'src/config/mUtils'
    import loading from 'src/components/common/loading'

    export default {
        data(){
            return{
                username:'',    //用户名
                resetname:'', //重置用户名
                avatar:'',      //用户头像
                show:false,     //显示提示框
                isEnter:true,  //是否登录
                isLeave:false, //是否退出
                showAlert: false,
                alertText: null,
                imgBaseUrl,
                showLoading: false, //显示加载动画
                format: {bmp:'bmp',BMP:'BMP',jpg:'jpg',JPG:'JPG',png:'png',PNG:'PNG',jpeg:'jpeg',JPEG:'JPEG'}
            }
        },
        created(){
            this.user_id = getStore('user_id')
            if(this.user_id == null){
                this.$router.push({path: '/login'});
            }
            this.username = this.userInfo.username;
        },
        beforeDestroy(){
            clearTimeout(this.timer)
        },
        components: {
            headTop,
            alertTip,
            loading
        },
        computed:{
            ...mapState([
                'userInfo', 'imgPath'
            ]),
        },
        methods: {
            ...mapMutations([
                'OUT_LOGIN', 'SAVE_AVANDER', 'RECORD_USERINFO',
            ]),

            exitlogin(){
                if(this.showLoading == true){
                    return
                }
                this.show=true;
                this.isEnter=true;
                this.isLeave=false;
            },
            waitingThing(){
                //取消退出
                clearTimeout(this.timer)
                this.isEnter=false;
                this.isLeave=true;
                this.timer = setTimeout(() =>{
                    clearTimeout(this.timer)
                    this.show=false;
                },200)
            },
            //退出登录
            async outLogin(){
                this.OUT_LOGIN();
                this.waitingThing();
                removeStore('user_id');
                removeStore('shopid');
                await signout();
                this.$router.push({path: '/login'});
            },
            async uploadAvatar(){
                let input = document.querySelector('.profileinfopanel-upload')
                let data = new FormData();
                if(!input.files[0]){
                    return
                }
                if(this.showLoading == true){
                    return
                }
                this.showLoading = true;
                //上传头像
                if (this.userInfo) {
                    var one = input.files[0].name.split(".");
                    if(one[one.length - 1] in this.format) {
                        if(input.files[0].size > 1048576){
                            this.showAlert = true;
                            this.alertText = '画像の大きさは1MBを超えない！';
                            this.showLoading = false;
                            return
                        }
                        data.append('file', input.files[0]);
                        try{
                            let response = await fetch('/eus/users/' + this.userInfo.user_id + '/avatar', {
                                method: 'POST',
                                credentials: 'include',
                                body: data
                                })
                            let res = await response.json();
                            if (res.status == 1) {
                                this.userInfo.avatar = res.image_path;
                                this.RECORD_USERINFO(this.userInfo);
                                this.showAlert = true;
                                this.alertText = 'アップロード成功';
                            }
                        }catch (error) {
                            this.showAlert = true;
                            this.alertText = 'アップロード失敗';
                            throw new Error(error);
                        }
                    }
                    else{
                        this.showAlert = true;
                        this.alertText = '画像のフォーマットが正しくない！';
                    }
                }
                this.showLoading = false;
            },
            linksetusername(){
                if(this.showLoading == true){
                    return
                }
                this.$router.push({path: '/profile/info/setusername'});
            },
            linkreset(){
                if(this.showLoading == true){
                    return
                }
                this.$router.push({path: '/reset'});
            },
        },
        watch: {
            userInfo: function (value) {
                if (value && value.user_id) {
                    this.username = value.username;
                    this.avatar = value.avatar;
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import 'src/style/mixin.scss';

    .rating_page{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #f2f2f2;
        z-index: 202;
        padding-top: 1.95rem;
        p, span{
            font-family: Helvetica Neue,Tahoma,Arial;
        }
    }
    .profile-info{
        @include wh(100%,3.1rem);
        .profileinfopanel-upload{
            display: block;
            position: absolute;
            opacity: 0;
            top: 2.35rem;
            left: 0;
            @include wh(100%,3.1rem);
        }
        .headportrait{
            margin-top:.5rem;
            padding:.5rem .4rem;
            @include fj(space-between);
            align-items:center;
            //border-top:1px solid #ddd;
            background:#fff;

            h2{
                @include sc(.7rem,#333);
                font-weight:500;
                display:flex;
                align-items:center;
            }
            .headportrait-div{
                span{
                    display:inline-block;

                    svg{
                        @include wh(100%,100%);
                    }
                }
                .headportrait-div-top{
                    @include wh(2rem,2rem);
                    @include borderRadius(50%);
                    vertical-align:middle;
                }
                .headportrait-div-bottom{
                    @include wh(.66667rem,1.4rem);
                    position:relative;
                    top:0.44rem;
                }
            }
        }
        .headportraitwo{
            margin-top:0;
            padding:.3rem .4rem;
            .headportrait-div{
                @include fj(left);
                p{
                    text-align:left;
                    line-height:1.39rem;
                    @include sc(.7rem,#999);
                    margin-right:.2rem;
                    font-weight:100;
                    font-family:Arial;
                }
                .headportrait-div-bottom{
                    top:0;
                }
            }
        }
    }
    .info-router{
        margin-top:.1rem;
        display:block;
    }
    .coverpart{
        @include wh(100%,100%);
        @include allcover;
        .cover-background{
            @include wh(100%,100%);
            @include allcover;
            background:#000;
            z-index:100;
            opacity:.2;
        }
        .alet_container{
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 200;
        }
        .cover-content{
            width:90%;
            background:$fc;
            position:absolute;
            top:20%;
            left:5%;
            z-index:1000;
            @include borderRadius(7px);
            .sa-icon{
                text-align: center;
                padding-top: 1rem;
                img{
                    @include wh(4rem, 4rem);
                }
            }
            h2{
                width:100%;
                text-align:center;
                @include sc(30px,#575757);
                font-weight:500;
                margin:25px 0;
            }
            .sa-botton{
                width:100%;
                text-align:center;
                float: left;
            }

        }
    }
    .confrim{
        float: left;
        @include sc(.8rem, #fff);
        font-weight: bold;
        margin-top: .3rem;
        background-color: #979797;
        width: 50%;
        text-align: center;
        line-height: 2.3rem;
        border: 1px;
        border-bottom-left-radius: 0.25rem;
    }
    .confrims{
        float: left;
        @include sc(.8rem, #fff);
        font-weight: bold;
        margin-top: .3rem;
        background-color: rgb(221, 49, 49);
        width: 50%;
        text-align: center;
        line-height: 2.3rem;
        border: 1px;
        border-bottom-right-radius: 0.25rem;
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
    @-webkit-keyframes bounceIn {
  from, 20%, 40%, 60%, 80%, 100% {
    -webkit-animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
    animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
  }

  0% {
    opacity: 0;
    -webkit-transform: scale3d(.3, .3, .3);
    transform: scale3d(.3, .3, .3);
  }

  20% {
    -webkit-transform: scale3d(1.1, 1.1, 1.1);
    transform: scale3d(1.1, 1.1, 1.1);
  }

  40% {
    -webkit-transform: scale3d(.9, .9, .9);
    transform: scale3d(.9, .9, .9);
  }

  60% {
    opacity: 1;
    -webkit-transform: scale3d(1.03, 1.03, 1.03);
    transform: scale3d(1.03, 1.03, 1.03);
  }

  80% {
    -webkit-transform: scale3d(.97, .97, .97);
    transform: scale3d(.97, .97, .97);
  }

  100% {
    opacity: 1;
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
}

@keyframes bounceIn {
  from, 20%, 40%, 60%, 80%, 100% {
    -webkit-animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
    animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
  }

  0% {
    opacity: 0;
    -webkit-transform: scale3d(.3, .3, .3);
    transform: scale3d(.3, .3, .3);
  }

  20% {
    -webkit-transform: scale3d(1.1, 1.1, 1.1);
    transform: scale3d(1.1, 1.1, 1.1);
  }

  40% {
    -webkit-transform: scale3d(.9, .9, .9);
    transform: scale3d(.9, .9, .9);
  }

  60% {
    opacity: 1;
    -webkit-transform: scale3d(1.03, 1.03, 1.03);
    transform: scale3d(1.03, 1.03, 1.03);
  }

  80% {
    -webkit-transform: scale3d(.97, .97, .97);
    transform: scale3d(.97, .97, .97);
  }

  100% {
    opacity: 1;
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
}
@-webkit-keyframes zoomOut {
  from {
    opacity: 1;
  }

  50% {
    opacity: 0;
    -webkit-transform: scale3d(.3, .3, .3);
    transform: scale3d(.3, .3, .3);
  }

  100% {
    opacity: 0;
  }
}

@keyframes zoomOut {
  from {
    opacity: 1;
  }

  50% {
    opacity: 0;
    -webkit-transform: scale3d(.3, .3, .3);
    transform: scale3d(.3, .3, .3);
  }

  100% {
    opacity: 0;
  }
}
body .coverpart .cover-animate{
    transition:all 1s;
    animation:bounceIn .6s;
}
body .coverpart .cover-animate-leave{
    animation:zoomOut .4s;
}
.router-slid-enter-active, .router-slid-leave-active {
    transition: all .4s;
}
.router-slid-enter, .router-slid-leave-active {
    transform: translate3d(2rem, 0, 0);
    opacity: 0;
}
</style>
