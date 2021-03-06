const fs = require('fs')
let args = process.argv.slice(2);
let pathToFile = args[0]
let mode = args[1];

let outputDirectoryName = pathToFile.split("/");
outputDirectoryName = outputDirectoryName[outputDirectoryName.length-1]
outputDirectoryName = outputDirectoryName.replace(".csv","-combinationsScorerOutput")
var deleteFileIfExists = function(path){
	if (fs.existsSync(path)){
		fs.unlinkSync(path);
	}

}
var CSVProcessor = (function(path){
	let header = null;
	let data = fs.readFileSync(path,'utf8');
    let templines = data.split('\n')
    header = templines.slice(0,1)[0].split('|').splice(2);
    let testCases = header.map(line=>line.split('-')[0]);
    let linesExceptFirst = templines.slice(1,templines.length-1); //uptil the last item(exclusive) since it is empty string
    let linesArr = linesExceptFirst.map(line=>line.split('|').splice(2));
    lines = linesArr.filter(line=>line.indexOf('-1') === -1 && line.indexOf('-2') === -1)
    totalmutants = lines.length;

	return{
		getTestCases : function(){
			return testCases;
		},
		getMutationScore : function(testCaseIndices){
			let killedMutants = 0;
			for (let line of lines){
				for (let idx of testCaseIndices){
					if (line[idx] === '0'){
						killedMutants += 1
						break;
					}
				}
			}
			return ((killedMutants/totalmutants)*100).toFixed(2);
		},
	};
})(pathToFile);



var combinations = function(array){
	var combi = [];
	for (var i = 0; i <= array.length; i++){
		combi.push([]);
	}
	var letLen = Math.pow(2, array.length);
	for (var i = 0; i < letLen ; i++){
    	temp= [];
    	for (var j=0;j<array.length;j++) {
        	if ((i & Math.pow(2,j))){ 
            	temp.push(array[j])
        	}
    	}
    	if (temp.length !== 0) {
    		combi[temp.length].push(temp);
    	}
	}
	return combi
}

var limitedCombinations = function(array,limit){
	var totalTestCases = array.length;
	var combi = [];
	for (var i = 0; i <= array.length; i++){
		combi.push([]);
	}
	var arr = []
	for (var i = 0; i < totalTestCases; i++){
		arr.push(i);
	}
	combi[combi.length-1].push(arr) //inserting manually, the combination of size equal to set size, only one available
	for (var i = 1; i < combi.length-1 ; i++){
		while(combi[i].length != limit){
			indices = getRandomIndices(i,totalTestCases);
			indices.sort(function(a,b) { return a - b; });
			let bool = combi[i].some(function(arr) {
  				return arr.every(function(prop, index) {
    				return indices[index] === prop
  				})
			});
			if (!bool){
				combi[i].push(indices)
			}
		}
	}
	return combi;
}



var output = function(str){
	console.log(str);
	fs.appendFileSync(outputDirectoryName+"/output.txt",str+"\n",'utf8')
}

var outputToDetailCSV = function(subsetSize,string){
	var filePath = outputDirectoryName+"/size"+subsetSize+".csv";
	fs.appendFileSync(filePath,string+"\n",'utf8');
}

var makeDirectory = function(){
	if (fs.existsSync(outputDirectoryName)){
		var files = fs.readdirSync(outputDirectoryName);
		for (const file of files) {
			fs.unlinkSync(outputDirectoryName+"/"+file);
		}
	}
	else{
		fs.mkdirSync(outputDirectoryName,'0777', true);
	}
}

var makeCSVHeader = function(subsetSize){
	var filePath = outputDirectoryName+"/size"+subsetSize+".csv";
	deleteFileIfExists(filePath);
	fs.appendFileSync(filePath,"Indices,Subset,MutationScore"+"\n",'utf8');
}
var makeMainCSVHeader = function(){
	fs.appendFileSync(outputDirectoryName+"/output.csv","Size,TotalCombinations,IndicesPicked,Max,Min,Avg"+"\n",'utf8')
}

var outputToMainCSV = function(str){
	fs.appendFileSync(outputDirectoryName+"/output.csv",str+"\n",'utf8')
}


var getRandomIndices = function(totalPicked,maxIndex){
	var arr = [];
	while(arr.length < totalPicked){
    	var r = Math.floor(Math.random() * maxIndex);
    		if(arr.indexOf(r) === -1) arr.push(r);
	}
	return arr
}

let upperLimit = 10;
let limited = false;
if (mode === "limited"){
	limited = true;
}
let list = CSVProcessor.getTestCases();
if (limited && list.length>upperLimit){
	combinations = limitedCombinations(list,upperLimit)
}
else{
	combinations = combinations(list);
}
makeDirectory();
makeMainCSVHeader();
output("Orignal test cases = "+ list);
var mainStr = ""
for (var idc = 1; idc < combinations.length; idc++){
	output("--------Size = "+idc+"--------")
	var indices = []
	if (combinations[idc].length > upperLimit && !limited){
		indices = getRandomIndices(upperLimit,combinations[idc].length);
	}
	else{
		for (var i = 0; i<combinations[idc].length; i++){
			indices.push(i);
		}
	}
	output("Total Combinations found = "+ combinations[idc].length)
	output("Indices picked = "+indices);

	makeCSVHeader(idc);
 	var scores = []
 	for (var i = 0; i < indices.length ; i++){
 		var temp = combinations[idc][indices[i]]
 		var score = CSVProcessor.getMutationScore(temp);
 		scores.push(score);
 		output(indices[i] +". Mutation Score for "+temp +" = "+score+ "%");
 		var temp2 = temp.join(" ")
 		outputToDetailCSV(idc,indices[i]+","+temp2+","+score);
 	}
	var sum = 0;
	for( var i = 0; i < scores.length; i++ ){
		scores[i] = parseFloat(scores[i]);
	    sum += scores[i]
	}
	var avg = sum/scores.length;
	output("Max mutation Score = "+ Math.max.apply(null,scores)+"%");
	output("Min mutation Score = "+ Math.min.apply(null,scores)+"%");
	output("Avg mutation Score = "+ avg+"%");
	mainStr = idc+","+combinations[idc].length+","+indices.join(" ")
		+","+Math.max.apply(null,scores)
		+","+Math.min.apply(null,scores)+","+avg;
	outputToMainCSV(mainStr);
}