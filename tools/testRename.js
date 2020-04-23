var path = require('path'), fs=require('fs');
let args = process.argv.slice(2);
let pathToFolder = args[0];

function fromDir(startPath,filter){

	var paths = [];
    if (!fs.existsSync(startPath)){
        console.log("no dir ",startPath);
        return;
    }

    var files=fs.readdirSync(startPath);
    for(var i=0;i<files.length;i++){
        var filename=path.join(startPath,files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()){
            fromDir(filename,filter);
        }
        else if (filename.indexOf(filter)>=0) {
            paths.push(filename);
        };
    };
    return paths;
};

function doReplacementsForFile(path){
	var data = fs.readFileSync(path, 'utf-8')
	var splits = data.split('\n')
	var pat1 = / *it\('/ 
	var pat2 = / *test\('/
	for (var i = 0; i<splits.length; i++){
		// if (testCaseNumber === 5){
		// 	testCaseNumber = 37 
		// }
		// if (testCaseNumber === ){
		// 	testCaseNumber = 37 
		// }
		if (splits[i].trim().match(pat1)){
			console.log("match 1")
			console.log(splits[i])
			splits[i] = splits[i].trim().replace(pat1,'it(\'-'+testCaseNumber+'-');
			console.log(splits[i])
			testCaseNumber++;
		}
		else if (splits[i].trim().match(pat2)){
			console.log("match 2")
			console.log(splits[i])
			splits[i] = splits[i].trim().replace(pat2,'test(\'-'+testCaseNumber+'-');
			console.log(splits[i])
			testCaseNumber++;	
		}
	}
	
	data = splits.join("\n")
	fs.writeFileSync(path, data)	
}

var testCaseNumber = 607
var paths = fromDir(pathToFolder,'.js');
console.log(paths)
for (var path of paths){
	doReplacementsForFile(path)
}
