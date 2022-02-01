let TimeTable;
const radius = 669.159236;
let worker;
const bell_1 = new Audio("上课铃.wav");
const bell_2 = new Audio("下课铃.wav");
const bell_3 = new Audio("上课铃.wav");
let load_finished = false;

function initialization(){ //初始化
    $("#状态栏").height($("#圆形进度槽").height());
    new Promise(
        (resolve)=>{
            $.ajax({
                url: "timetable.json",
                success: (result)=>{TimeTable = result; resolve();}
            });
        }
    ).then(()=>{
        for (let i in TimeTable) {
            let its_time = TimeTable[i].time.split(":");
            TimeTable[i].time = new Date(new Date().setHours(its_time[0],its_time[1],0,0));
        }
        load_finished = true;
    })
}

function Onmessage(e){
    if (e.data.phase)
        $('.st').css("stroke-dasharray", e.data.phase + ", " + radius);
    if (e.data.status_bar_text)
        $(".状态栏文本").text(e.data.status_bar_text);
    if (e.data.bell)
        switch (e.data.bell){
            case "上课铃":
                bell_1.play();
                break;
            case "下课铃":
                bell_2.play();
                break;
        }
}

window.onresize = ()=>{ //高度同步
    $("#状态栏").height($("#圆形进度槽").height());
}

function Switch(){
    if(!load_finished)
        return;
    let Switches = $(".开关");
    if(Switches.text() === "开始开始"){
        Switches.text("结束");
        worker = new Worker("worker线程.js");
        worker.postMessage(TimeTable);
        worker.onmessage = Onmessage;
    }
    else if(Switches.text() === "结束结束"){
        worker.terminate();
        Switches.text("开始");
    }
}

function Have_a_test(){ //测试按钮按下事件
    bell_3.play();
}