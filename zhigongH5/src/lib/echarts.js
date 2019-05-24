let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/pie')
require('echarts/lib/chart/bar')
require('echarts/lib/chart/line')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
import redImge from '../../static/img/hongsedianbiaoji.png'
import yellowImge from '../../static/img/huangsedianbiaoji.png'
import greenImge from '../../static/img/lusedianbiaoji.png'
var $$ = Dom7;
export function echart(id, normalAttend, lackAttend, noAttend, jingri, zuori, id2, typeNameList, typeDateList){
    //柱状图
    var myChart = echarts.init(document.getElementById(id));
    app.config = {
        rotate: 90,
        verticalAlign: 'middle',
        position: 'insideBottom',
        distance: 5,
        onChange: function () {
            var labelOption = {
                normal: {
                    rotate: app.config.rotate,
                    align: app.config.align,
                    verticalAlign: app.config.verticalAlign,
                    position: app.config.position,
                    distance: app.config.distance
                }
            };
            myChart.setOption({
                series: [{
                    label: labelOption
                }, {
                    label: labelOption
                }]
            });
        }
    };
    var labelOption = {
        normal: {
            show: true,
            position: "top",
            formatter: '{a} \n {c}人',
            fontSize: 6
        }
    };

    myChart.setOption({
        color: ['#05CB00', '#FF7200', 'red'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            orient: 'vertical',
            x: 'right',
            itemWidth:6,
            itemHeight:6,
            textStyle: {
                color: '#707070',
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontFamily: 'sans-serif',
                fontSize: 8,
            },
            itemGap:1,
            padding: [10, 0, 0, 0],
            data: ['正常考勤', '缺卡', '无考勤']
        },
        toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
                mark: {show: true},
                dataView: {show: true, readOnly: false},
                magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        calculable: true,
        grid: {
            top: '20%',
            left: '2%',
            bottom: '2%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            axisTick: {show: false},
            data: [jingri, zuori]
        },
        yAxis: {
            type: 'value',
            splitLine:{
                show:false
            }
        },
        series: [
            {
                name: '正常考勤',
                type: 'bar',
                barWidth : 20,
                label: labelOption,
                data: normalAttend
            },
            {
                name: '缺卡',
                type: 'bar',
                barWidth : 20,
                label: labelOption,
                data: lackAttend
            },
            {
                name: '无考勤',
                type: 'bar',
                barWidth : 20,
                barGap: '30%',
                label: labelOption,
                data: noAttend
            }
        ]
    })

    //饼状图  （工种人数）
    var myChart = echarts.init(document.getElementById(id2));
    myChart.setOption({
        legend: {
            orient: 'vertical',
            x: 'right',
            itemWidth:6,
            itemHeight:6,
            textStyle: {
                color: '#707070',
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontFamily: 'sans-serif',
                fontSize: 8,
            },
            itemGap:1,
            padding: [10, 0, 0, 0],
            data: typeNameList
        },
        tooltip : {
            trigger: 'item',
            formatter: "{c}人"
        },
        grid: {
            left: 20,
            containLabel: true
        },
        series: [
            {
                name:'访问来源',
                type:'pie',
                radius: ['20%', '70%'], // 内半径和外半径
                center: ['45%', '55%'], //饼图的位置
                labelLine: {
                    normal: {
                        length: 8,
                        length2: 8,
                        show: true
                    }
                },
                label: {
                    normal: {
                        formatter: '{b}\n{c}人'
                    }
                },
                data: typeDateList
            }
        ]
    })
}

export function echart2(id, everyDay, data, name){
    var chart = document.getElementById(id);
    chart.style.width = window.innerWidth+'px';
    var myChart = echarts.init(chart);
    myChart.setOption({
        tooltip: {
            trigger: 'axis',
            formatter: function (param) {
                var ming = param[0].seriesName;
                var formatterHtml;
                console.log(param[0]);
                if(ming == '考勤率' || ming == '异常考勤率'){
                    formatterHtml = param[0].axisValue + '日' + '<br/>' + param[0].data + '%'
                }else if(ming == '平均工时'){
                    formatterHtml = param[0].axisValue + '日' + '<br/>' + param[0].data + '小时'
                }else{
                    formatterHtml = param[0].axisValue + '日' + '<br/>' + param[0].data + '人'
                }
                return [
                    formatterHtml
                ].join('');
            },
            axisPointer: {
                type: 'cross'
            }
        },
        grid: {
            top: '5%',
            left: '7%',
            right: '7%',
            bottom: '10%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            splitNumber: 2,
            scale: true,
            splitLine:{
                show:false
            },
            axisLabel: {
                show: true,
                interval: 3
            },
            // axisTick:{         //刻度显示否
            //     show:false
            // },
            data: everyDay
        },
        yAxis: {
            type: 'value',
            // axisLabel: {
            //     show: false
            // },
            // axisTick:{
            //     show:false
            // },
            // splitLine:{                  //y轴线显示否
            //     show:false
            // }
        },
        series: [{
            name: name,
            type: 'line',
            data: data
        }]
    })
}

     //饼状图  （正常，缺卡，无考勤 考勤概况饼状图）
export function echart3(id, normalAttend, lackAttend, noAttend){
    var myChart= echarts.init(document.getElementById(id));
    myChart.setOption({
        title: { text: '', x:'center' },
        tooltip: {
        },
        legend:{
            orient: 'horizontal',
            itemWidth:12,
            itemHeight:6,
            show: true,
            x: 'right',
            textStyle:{
                fontSize:12,
                color:'#999',
            },
            itemHeight:12,
            data: ['正常考勤', '缺卡考勤', '无考勤']
        },
        color:['#0cca0c','#fd913a','#ed4444'],
        grid:{
            bottom:'0'
        },
        minAngel:'1',
        series: [{
            name: '班组日考勤',
            type: 'pie',
            radius:['30%','55%'],
            center:['45%','50%'],
            data:[{
                name:'正常考勤',
                value: normalAttend
            },{
                name:'缺卡考勤',
                value: lackAttend
            },{
                name:'无考勤',
                value: noAttend
            }],
            stillShowZeroSum:false,
            label:{
                normal:{
                    formatter: function (params) {
                        console.log('params',params);
                        let paramsRes = params.data.value+'人'+'\n'+params.percent+'%'
                        if(params.data.value != 0){
                            return [paramsRes].join('')
                        }else{
                            return ''
                        }
                    }
                }
            },
            labelLine:{
                normal:{
                    length:15,
                    length2:15,
                    smooth:false
                }
            }
        }]
    })
}

//地图多点显示
export function map(data){
    var map = new AMap.Map('container', {
        resizeEnable: true
    });

    var markers = [];
    //positions = [{'宝安项目_0': [113.90, 22.57]}, {'福田项目_1': [114.05, 22.53]}, {'南山项目_1': [113.92, 22.52]}, {'天津项目_0': [116.42, 38.33]}, {'湖北项目_0': [108.21, 29.01]}, {'济南项目_1': [117, 36.65]}];
    var machineStatus = ['空闲', '在用', '离线'];
    var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
    //打开地图地图上显示的点坐标
    var imge;
    for (var i = 0; i < data.length; i++) {
        for (var key in data[i]) {
            let status = key.split('_')[1];
            if(status==0){
                imge = yellowImge;
            }
            if(status==1){
                imge = greenImge;
            }
            if(status==2){
                imge = redImge;
            }

            var marker = new AMap.Marker({
                map: map,
                icon: imge,
                position: data[i][key]
            });

            markers.push(marker);

            console.log('正在使用', key.split('_')[1]);
            marker.content = "<ul style='box-sizing: border-box; padding: 0 10px'>" +
                "<li style='display: flex'><div style='width: 60px '>绑定项目:</div>&nbsp;&nbsp;<div style='flex: 1'>" + key.split('_')[0] + "</div></li>" +
                "<li style='display: flex'><div>考勤机状态:</div>&nbsp;&nbsp;<div>"+machineStatus[key.split('_')[1]]+"</div></li>" +
                "</ul>";

            marker.on('click', markerClick);
            marker.emit('click', {target: marker});
        }
    }

    function markerClick(e) {
        infoWindow.setContent(e.target.content);
        infoWindow.open(map, e.target.getPosition());
    }
    map.setFitView();
    // 添加事件监听, 使地图自适应显示到合适的范围
    AMap.event.addDomListener(document.getElementById('setFitView'), 'click', function () {
        var newCenter = map.setFitView();
    });
}

//单点显示
export function map2(data) {
    var map, geocoder;
    map = new AMap.Map('containe', {
        resizeEnable: true
    });
    var marker = new AMap.Marker({  //加点
        map: map,
        position: data
    });
    map.setFitView();

    console.log(1);
    //加载地理编码插件
    map.plugin(["AMap.Geocoder"],function() {
        console.log(2);
        var geocoder = new AMap.Geocoder({
            radius: 1000, //以已知坐标为中心点，radius为半径，返回范围内兴趣点和道路信息
            extensions: "all"//返回地址描述以及附近兴趣点和道路信息，默认"base"
        });
        //逆地理编码
        geocoder.getAddress(data, function (status, result) {
            console.log(3);
            console.log(status, result);
            if (status === 'complete' && result.info === 'OK') {
                console.log(4);
                geocoder_CallBack(result);
            }
        });
    })
    function geocoder_CallBack(res) {
        console.log(5);
        console.log('数据',res);
        var address = res.regeocode.formattedAddress; //返回地址描述
        document.getElementById('f-2').innerHTML = address;
    }
}




