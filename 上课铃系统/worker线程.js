let TimeTable;
let high_speed_model = true;
const cycle = 100;
const radius = 669.159236;
let C_B_Timestamp;
let C_E_Timestamp;
let Plan_Timestamp;

let performance_analysis = {
    T_P_List: [],
    Record_T_P: ()=>{
        let list = performance_analysis.T_P_List
        list.push(performance.now());
        if (list.length > 10)
            list.shift();
        },
    S_T_M_R_T_Interval: ()=>{
        let list = performance_analysis.T_P_List;
        console.log((list.length).toString() + ": " + performance_analysis.C_T_Interval(list.length - 1).toString());
    },
    C_T_Interval: (Ordinal)=>{
        let list = performance_analysis.T_P_List;
        return list[Ordinal] - list[Ordinal - 1];
    },
    C_T_I_A_V: (list_length)=>{
        let average_value = 0;
        const list = performance_analysis.T_P_List
        list_length = list_length || list.length
        for (let i = list_length - 1;i > 0;i--)
            average_value = performance_analysis.C_T_Interval(i) / (list_length - 1) + average_value;
        return average_value;
    },
    C_T_I_Variance: (E_A_V)=>{
        let Variance = 0;
        let list = performance_analysis.T_P_List;
        const list_length = list.length;
        E_A_V = E_A_V || performance_analysis.C_T_I_A_V(list_length);
        for (let i = list_length - 1;i > 0;i--)
            Variance = Math.pow(E_A_V - performance_analysis.C_T_Interval(i),2) / (list_length - 1) + Variance;
        return Variance;
    },
}

onmessage = (e)=>{
    TimeTable = e.data;
}

performance_analysis.Record_T_P();
setTimeout(timer,cycle,performance.now());


function Calculation_progress_bar(current_time){ //计算进度条
    current_time = current_time || Date.now()
    return ((current_time - C_B_Timestamp) / (C_E_Timestamp - C_B_Timestamp)) * radius;
}

function Get_C_C(current_time){ //获取当前内容
    current_time = current_time || new Date();
    let index = 0;
    let a_s = TimeTable[TimeTable.length-1]

    if(TimeTable[0].time > current_time) return {time: new Date(new Date(a_s.time).setDate(a_s.time.getDate() - 1)),content: a_s.content,bell: a_s.bell}; //如果早于整个时间表

    while (TimeTable[index].time < current_time){
        index++;
        if(index > TimeTable.length - 1) return a_s; //如果晚于整个时间表
    }

    return TimeTable[index-1];
}

function Get_N_C(current_time){ //获取下一内容
    current_time = current_time || new Date();
    let index = 0;
    let a_s = TimeTable[0]

    // if(TimeTable[0].time > current_time) return a_s; //如果早于整个时间表

    while (TimeTable[index].time < current_time){
        index++;
        if(index > TimeTable.length - 1) return {time: new Date(new Date(a_s.time).setDate(a_s.time.getDate() + 1)),content: a_s.content,bell: a_s.bell}; //如果晚于整个时间表
    }

    return TimeTable[index];
}

function timer(last_time){
    let C_T = new Date();

    let massage = {
        phase:Calculation_progress_bar(C_T),
        status_bar_text:null,
        bell:null,
    }

    if(!((C_E_Timestamp >= C_T) && (C_T >= C_B_Timestamp))){
        let C_C = Get_C_C(C_T);
        let N_C = Get_N_C(C_T);
        C_B_Timestamp = C_C.time.valueOf();
        C_E_Timestamp = N_C.time.valueOf();
        Plan_Timestamp = C_C.time.valueOf();

        massage.phase = Calculation_progress_bar(C_T);
        massage.status_bar_text = C_C.content;
        massage.bell = C_C.bell;
    }

    postMessage(massage);

    if(high_speed_model){
        setTimeout(timer,cycle);
    }else {

        let C_T = new Date();
        let C_C = Get_C_C(C_T);
        let N_C = Get_N_C(C_T);

        let massage = {
            phase: null,
            status_bar_text: null,
            bell: null,
        }

        massage.phase = Calculation_progress_bar(C_T);

        if (C_C.time.valueOf() !== Plan_Timestamp) {
            Plan_Timestamp = C_C.time.valueOf();
            massage.bell = C_C.bell
            massage.status_bar_text = C_C.content;

            C_B_Timestamp = C_C.time.valueOf();
            C_E_Timestamp = N_C.time.valueOf();
            // console.count();
        }

        postMessage(massage);
    }
        performance_analysis.Record_T_P();
        // performance_analysis.S_T_M_R_T_Interval();
        let average_value = performance_analysis.C_T_I_A_V();
        // console.log(average_value);
        let current_time = performance.now()
        setTimeout(timer,(cycle * 1.4) - ((current_time - last_time) * 0.4) + ((cycle - average_value) * 0.2 ), current_time);
}
