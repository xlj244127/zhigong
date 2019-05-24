<template>
    <div data-page="attendManage" class="page navbar-fixed toolbar-fixed"> <!--固定导航栏-->
        <div class="navbar">
            <div class="navbar-inner">
                <div class="left sliding">
                    <a href="#" class="back link">
                        <i class="icon icon-back"></i>
                    </a>
                </div>
                <div class="center sliding">全部项目区间考勤</div>
            </div>
        </div>
        <div class="page-content">
            <div class="main">
                <div class="header">2017-01-01至2017-01-31</div>
                <div class="nav">
                    <div class="n-1">项目名称</div> <div class="n-2">总人数</div> <div class="n-2">异常次数</div> <div class="n-2">异常率</div>
                </div>
                <ul class="aul">
                    <li v-for="item in list">
                        <a href="/company/projRangeAttendDetail/">
                            <div class="ali-1">{{item.name}}</div> <div class="ali-2">88</div> <div class="ali-2">66</div> <div class="ali-2">20%</div>
                            <img src="../../../../../static/img/btn_right.png"/>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "",
        data(){
            return{
                list:[
                    {name: '前海湾项目'},
                    {name: '宝安西乡项目'},
                    {name: '西丽南山项目'},
                    {name: '湖北荆州项目'}
                ]
            }
        }
    }
</script>

<style scoped>
.page-content{
    width: 100%; height: 100%; background: #f4f4f4;
}
   .main{
       width: 100%; background: #fff; margin-top: 0.5rem; box-sizing: border-box; padding: 0 0.6rem;
   }
.main .header{
    width: 100%; height: 2rem; line-height: 2rem; font-size: 0.7rem; color: #666; border-bottom: 1px solid #f4f4f4;
}
.main .nav{
    width: 100%; height: 2rem; line-height: 2rem; display: flex; justify-content: space-around;
    border-bottom: 1px solid #f4f4f4; font-size: 0.7rem; color: #aaa;
}
.main .nav .n-1{
    width: 13.5rem;
}
.main .nav .n-2{
    width: 7.5rem; text-align: center;
}
.main .aul li{
    width: 100%; height: 2.5rem; line-height: 2.5rem; position: relative;
}
.main .aul li a{
    width: 100%; height: 100%; display: block; display: flex; font-size: 0.7rem; color: #666;
}
.main .aul li .ali-1{
    width: 13.5rem;
}
.main .aul li .ali-2{
    width: 7.5rem; text-align: center;
}
.main .aul li img{
    width: 0.9rem; height: 0.9rem; position: absolute; right: 0; top: 0.8rem;
}
</style>