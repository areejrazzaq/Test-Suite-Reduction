const chalk = require('chalk');
const fs = require('fs');

//Reading the file
const args = process.argv.slice(2);
const path = args[1];
let alpha = parseFloat(args[0])
const data = fs.readFileSync(path,'utf8');
const lines = data.split("\n")
const start = new Date().getTime();
let fileName = args[0].split('/')
fileName = fileName[fileName.length - 1]
fileName = fileName.replace(".csv","");

// MUTATION SCORE
let header = lines.slice(0,1)[0].split('|').splice(2);
let linesExceptFirst = lines.slice(1,lines.length-1); //uptil the last item(exclusive) since it is empty string
let linesArr = linesExceptFirst.map(line=>line.split('|').splice(2));

for(let i=0; i<linesArr.length; i++){
    for(let j=linesArr[i].length-1 ; j>linesArr[i].length-2 ;j--){
        linesArr[i][j] = (linesArr[i][j]).replace('\r','');
    }
}

linesReduced = linesArr.filter(line=>
    (line.indexOf(-1) === -1 && line.indexOf(-2) === -1)
)
const totalMutants = linesReduced.length;

// INPUT
const req = getMutantContext();
const testCases = getTestCases();
const testSets = getTestSets();
const mutationScore = getMutationScore(testCases, linesReduced,totalMutants);
let opMutationScore;


// DECLARATION
const optimizedSuite = [];
let marked = mark();
let markedReq = markReq();
let curCard = 1;
let mayReduce;
let maxCurd = max();
// step 2 helper function
let arr = ()=>{
    let counter = [];
    for(let i=0; i<testCases.length; i++){
        counter[i] = 0;
    }
    return counter;
}



// INITIALIZATION
// STEP 1

for (const r in req){
    if(card(req[r])==1 && !optimizedSuite.includes(req[r][0])){
        optimizedSuite.push(req[r][0]);
        marked[req[r][0]] = true;
        markReqTrue(req[r][0]);
    }
    curCard = 1;
}
if(tolerate(alpha,optimizedSuite)){
    output();
    return;
}
let stop = false;

// STEP 2
while(curCard<=maxCurd && !stop){
    curCard = curCard+ 1;
    let temp = curCard;
    while(!markFlag(temp)){
        let counter = arr();
        let nextTest = selectTest(curCard,getList(curCard),counter);
        if (nextTest!=null && !optimizedSuite.includes(nextTest) ){
            if(tolerate(alpha,optimizedSuite)){
                stop = true;
                break;
            }
            optimizedSuite.push(nextTest);
            mayReduce = false;
            marked[nextTest]= true;
            markReqTrue(nextTest);
        }
    }

    if(mayReduce){
        reduce();
    }
}
 

// reduce max cardinality
function reduce(){
    for(let i=maxCurd; i>0 ; i--){
        let list = getList(i);
        if(list.length!=0){
            maxCurd = i;
            return;
        }
    }
    
    
}


// check for marked requirements
function markFlag(size){
    let check = {};
    let flag ;

    if(size>maxCurd){
        return true;
    }

    // filtering list of current cardinality 
    for(let i=0; i<testSets.length; i++){
        if(testSets[i].length===size){
            check[i] = testSets[i];
        }
    }
    // checking for marked requirement
    for(let el in check){
        if(markedReq[parseInt(el)]){
            flag = true;
        } else {
            flag = false;
            break;
        }
    }
    return flag;
}


// OUTPUT
function createOutput(){
    if (!fs.existsSync("HGS.csv")){
        const header = "DateTime,Name,TotalMutants,ExecutionTime(ms),ExecutionTime,MutationScoreOriginal,MutationScoreReduced,ReducedSet,OriginalSetSize,ReducedSetSize"
        fs.appendFileSync("HGS.csv",header+"\n",'utf8')
    }
}

function outputToCSV(str){
    fs.appendFileSync("HGS.csv",str,'utf8')
}


// CREATING INPUT
//Returns a mapping from mutants to the test cases that detect each of the mutants
function getMutantContext(){
    let mutantToTest = {};
    let line;
    let outputs;

    for(let i = 1;i < lines.length;i++){

         line = lines[i]
         outputs = line.split("|")
         if(outputs[0] === ""){
             continue;
         }
         mutantToTest[outputs[0]] = []

         for(let j = 2; j < outputs.length; j++){
            if(parseInt(outputs[j]) == 0){
             mutantToTest[outputs[0]].push(j-2);
            }
            
         }
         for(let j = 2; j < outputs.length; j++){
            if(parseInt(outputs[j]) == -1 || parseInt(outputs[j]) == -2 ){
             delete mutantToTest[outputs[0]];
             break;
            }
         }
    }
    return mutantToTest

}

function getTestCases(){
    let line = lines[0];
    let cases = line.split("|")
    let testCases = []

    for (let i = 2;i < cases.length;i++){
        let test = parseInt(cases[i].split("-")[0])
        testCases.push(test)
    }
    return testCases

}

// HELPER FUNCTIONS FOR DECLARATIONS
// returns max cardinality from the set of requirements
function max(){
    let max = 0;
    for (const i in req){
        if(req[i].length>max){
            max = req[i].length;
        }
    }
    return max;
}

function card(set){
    return Object.values(set).length;
}

function mark(){
    let arr = [];
    for(let i=0; i<testCases.length; i++){
        arr.push(false);
    }
    return arr;
}

function markReq(){
    let markedReq = [];
    for(let i=0; i<card(req);i++){
        markedReq[i] = false;
    }
    return markedReq;
}

// mark requirements true if any of the test case is marked true or not
function markReqTrue(test){
    for(let i=0; i<testSets.length; i++){
        for(let j=0; j<testSets[i].length; j++){
            if(testSets[i][j]===test){
                markedReq[i] = true;
                if(testSets[i].length===maxCurd){
                    mayReduce = true;
                }
            }
        }
    }
    return markedReq;
}


// GET ONLY TEST CASES
function getTestSets(){
    return Object.values(req);
}


// STEP 2 HELPER FUNCTIONS
function getList(size){
    let check = {};
    let list = [];
    // filtering list of current cardinality 
    for(let i=0; i<testSets.length; i++){
        if(testSets[i].length===size){
            check[i] = testSets[i];
        }
    }

    for(let el in check){
        if(!markedReq[parseInt(el)]){
            list.push(check[el]);
        }
    }
    return list;
}


function selectTest(size,list,counter){
    // counting repetitions
    for(let i=0 ; i<list.length ; i++){
        for(let j=0 ; j<list[i].length ; j++){
            counter[list[i][j]] += 1;
        }
    }

    let max = Math.max(...counter) ;
    let testList = [];

    // adding max test appearence to testList
    for(let i=0 ; i<counter.length; i++){
        if(counter[i]===max){
            testList.push(i);
        }
    }

    // only one element in test List
    if(card(testList)===1){
        return testList[0];
    } 
    else if (size === maxCurd ){
        return testList[Math.floor(Math.random()*maxCurd)];
    } 
    else {
        counter = counter.map((el)=>{
            if(el===max){
                return el;
            }else {
                return 0;
            }
        });
        return selectTest(size+1,getList(size+1),counter);
    }
}

// MUTATION SCORE FUNCTION
function getMutationScore(testCases,lines,totalMutants){
    let killedMutants = 0;
    // console.log(lines);
			for (let line of lines){
				for (let idx of testCases){
					if (line[idx] === '0'){
						killedMutants += 1
						break;
					}
				}
			}
			return ((killedMutants/totalMutants)*100).toFixed(3);
}

function tolerate(alpha,suite){
    curScore = getMutationScore(suite,linesReduced,totalMutants);
    tolerance = mutationScore-alpha
    if (tolerance>=0 && tolerance<=curScore){
        return true;
    }
    return false;
}




// OUTPUT ON CONSOLE
function output(){
    let end = new Date().getTime();
    let time = end - start;
    let seconds = Math.floor(time / 1000);
    let minutes = Math.floor(seconds / 60);
    opMutationScore = getMutationScore(optimizedSuite, linesReduced,totalMutants);

    let datetime = ""
    let d = new Date();
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"]
    datetime = d.getDate() + " " + months[d.getMonth()] + ";" + d.getHours() + "h:" + d.getMinutes() + "min:" + d.getSeconds() + "sec";
    console.log(`${chalk.bgMagenta("Execution Time = "+minutes+"m "+ (seconds-minutes*60)+"s " + (time - seconds*1000)+ "ms")}`)


    console.log(`${chalk.bgMagenta("Mutation Score for originalSet= ",mutationScore," %")}`)
    console.log(`${chalk.bgMagenta("Mutation Score for reducedSet= ", opMutationScore," %")}`)
    console.log(`${chalk.bgMagenta("Reduced set :")}    ${optimizedSuite}`)
    console.log(`${chalk.bgMagenta("Reduced set Size :")}    ${optimizedSuite.length}`)
    console.log(`${chalk.bgMagenta("Original set Size: ",testCases.length)}`)

    let str = datetime + "," + fileName + "," + totalMutants + "," + time + "ms" + "," + minutes + "m " + (seconds - minutes * 60) + "s " + (time - seconds * 1000) + "ms" + "," + mutationScore + "," + opMutationScore + "," + optimizedSuite.join(" ") + "," + header.length + "," + optimizedSuite.length + "\n";

    // WRITING TO FILE
    createOutput()
    outputToCSV(str)
}

output();

