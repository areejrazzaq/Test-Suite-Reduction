const chalk = require('chalk')
const { execFileSync } = require('child_process');


let args = process.argv.slice(2);
let pathToFile = args[1]
let alpha = parseFloat(args[2])
let runs = parseFloat(args[0])
let totalRunningTime = 0
let cummulativeReducedSetSize = 0

function createOutput() {
    if (!fs.existsSync("greedyEnsemble.csv")) {
        let row1 = ",,,Min,,,Max,, ,  ,";
        let row2 = "Package,Original Set Size,Runs, |T|,t(ms),loss,|T|,t(ms),loss,Avg Reduced Size, Avg Time, Avg Loss, S.D";
        fs.appendFileSync("greedyEnsemble.csv", row1 + "\n", 'utf8');
        fs.appendFileSync("greedyEnsemble.csv", row2 + "\n", 'utf8');
    }
}

function outputToCSV(str) {
    fs.appendFileSync("greedyEnsemble.csv", str, 'utf8');
}


function avg(arr) {
    let sum = 0;
    for (let el of arr) {
        sum += el
    }
    return sum / arr.length;
}

function standardDeviation(arr){
    let mean = arr.reduce((acc, curr)=>{
	return acc + curr
}, 0) / arr.length;
}




function convertToMs(time){
	// minutesR = new RegExp("[0-9]*m ","g");
	// secondsR = new RegExp("[0-9]*s ","g");
	// millisecondsR = new RegExp("[0-9]*ms","g");
	// minutes = time.match(minutesR)
	// seconds = time.match(secondsR)
	// milliseconds = time.match(millisecondsR)
	another = new RegExp("[0-9]+","g");
	match = time.match(another)
	minutes = parseFloat(match[0])
	seconds = parseFloat(match[1])
	milliseconds = parseFloat(match[2])
	// console.log(minutes,seconds,milliseconds)
	return minutes*60*1000 + seconds*1000 + milliseconds
}

function runScript(pathToFile,callback) {
    const output = execFileSync("node",["greedyMin.js",pathToFile,alpha])
    console.log(output.toString())
    lines = output.toString().split("\n");
    for (let line of lines){
  		if (line.includes("Reduced set Size :")){
    		size = parseFloat(line.split(":")[1])
    		cummulativeReducedSetSize += size
    	}
    	regex = new RegExp("[0-9]*m [0-9]*s [0-9]*ms","g");
    	match = line.match(regex);
    	if(match){
    		timeInMs = convertToMs(match.toString());
    		totalRunningTime += timeInMs;
    	}
    }
}

// var start = new Date().getTime();
for (var i=0; i<runs; i++){
    console.log(`${chalk.green("Executing Run#"+(i+1))}`)
    runScript(pathToFile,function (err) {
        if (err) throw err;
    });
}
// var end = new Date().getTime();
// var time = end - start;
time = Math.round(totalRunningTime/runs,2)
var seconds = Math.floor(time/1000);
var minutes = Math.floor(seconds/60);
averageTSSize = cummulativeReducedSetSize/runs
averageTSSize = averageTSSize.toFixed(2)
console.log(`${chalk.bgMagenta("Average Execution Time = "+minutes+"m "+ (seconds-minutes*60)+"s " + (time - seconds*1000)+ "ms" + "("+time+" ms)")}`)
console.log(`${chalk.bgMagenta("Average reduced test set size = "+averageTSSize)}`)
