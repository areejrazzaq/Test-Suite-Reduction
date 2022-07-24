const chalk = require('chalk');
const fs = require('fs');
const { execFileSync } = require('child_process');
let { time } = require('console');

let args = process.argv.slice(2);
let pathToFile = args[1];
let alpha = args[2];
let runs = parseFloat(args[0])
let totalRunningTime = 0
let cummulativeReducedSetSize = 0
let fileName = pathToFile.split('/')
fileName = fileName[fileName.length - 1]
fileName = fileName.replace(".csv", "");
let msize;
let osize;
let execTime = [];
let reducedSize = [];
let loss = [];

function createOutput() {
    if (!fs.existsSync("hgs-ensemble.csv")) {
        let row1 = ",,,Min,,,Max,, ,  ,";
        let row2 = "Package,Original Set Size,Runs, |T|,t(ms),loss,|T|,t(ms),loss,Avg Reduced Size, Avg Time, Avg Loss, S.D";
        fs.appendFileSync("hgs-ensemble.csv", row1 + "\n", 'utf8');
        fs.appendFileSync("hgs-ensemble.csv", row2 + "\n", 'utf8');
    }
}

function outputToCSV(str) {
    fs.appendFileSync("hgs-ensemble.csv", str, 'utf8');
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


arr = arr.map((el)=>{
	return (el - mean) ** 2
})

let total = arr.reduce((acc, curr)=> acc + curr, 0);

return Math.sqrt(total / arr.length)
}

function convertToMs(time) {
    another = new RegExp("[0-9]+", "g");
    match = time.match(another)
    minutes = parseFloat(match[0])
    seconds = parseFloat(match[1])
    milliseconds = parseFloat(match[2])
    return minutes * 60 * 1000 + seconds * 1000 + milliseconds
}

function runScript(pathToFile, callback) {
    const output = execFileSync("node", ["hgs-alpha.js", alpha ,pathToFile])
    console.log(output.toString())
    lines = output.toString().split("\n");
    for (let line of lines) {
        if (line.includes("Reduced set Size :")) {
            size = parseFloat(line.split(":")[1])
            cummulativeReducedSetSize += size;
            reducedSize.push(size);
        }
        if (line.includes("Mutation Score for originalSet=  ")) {
            msize = parseFloat(line.split("=")[1]);
        }
        if (line.includes("Original set Size: ")) {
            osize = parseFloat(line.split(":")[1]);
        }
        if (line.includes("Mutation Score for reducedSet= ")) {
            rscore = parseFloat(line.split("=")[1])
            score = (msize - rscore) * 100 / msize;
            loss.push(score);
        }
        regex = new RegExp("[0-9]*m [0-9]*s [0-9]*ms", "g");
        match = line.match(regex);
        if (match) {
            timeInMs = convertToMs(match.toString());
            totalRunningTime += timeInMs;
            execTime.push(timeInMs)
        }

    }
}


for (var i = 0; i < runs; i++) {
    console.log(`${chalk.green("Executing Run#"+(i+1))}`)
    runScript(pathToFile, function(err) {
        if (err) throw err;
    });
}

time = Math.round(totalRunningTime / runs, 2)
var seconds = Math.floor(time / 1000);
var minutes = Math.floor(seconds / 60);
averageTSSize = cummulativeReducedSetSize / runs;
averageTSSize = averageTSSize.toFixed(2);
console.log("Time:", execTime);
console.log("RS: ", reducedSize);
console.log("Loss: ", loss);
console.log(`${chalk.bgMagenta("Average Execution Time = "+minutes+"m "+ (seconds-minutes*60)+"s " + (time - seconds*1000)+ "ms" + "("+time+" ms)")}`)
console.log(`${chalk.bgMagenta("Average reduced test set size = "+averageTSSize)}`)



let str = `${fileName},${osize},${runs},${Math.min(...reducedSize)},${Math.min(...execTime)},${Math.min(...loss)},${Math.max(...reducedSize)},${Math.max(...execTime)},${Math.max(...loss)},${avg(reducedSize)},${avg(execTime)},${avg(loss)},${standardDeviation(reducedSize)} \n`;

createOutput()
outputToCSV(str)