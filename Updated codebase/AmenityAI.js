const bayes = require("classificator");
const classifier = bayes();
var fs = require("fs");

//Training
//var data = []
//var Presentation = ["","",""];
//Presentation.forEach(function(inputText) {

//data.push({text:inputText,category:"Presentation screen"});

//});

// Same for next category
/*
fs.readFile('trainedDataAmenity.txt', function(err,data){
    if(err)
    return console.log(err);
    var trained = JSON.parse(data);
    console.log(trained);
    //loadedData = bayes.fromJson(trained);
    setTimeout(3000000,classify(trained));
   // var prediction = classifier.categorize("A brainstorming event needs to be conducted");
})
// Function to run the below from file? 
function classify(trained){
    loadedData = bayes.fromJson(trained);
    var prediction = classifier.categorize("A brainstorming event needs to be conducted");
}

/*
*/
classifier.learn("We will be having a brainstorming session today", "Whiteboard");
classifier.learn("brainstorm", "Whiteboard");
classifier.learn("discussion meeting", "Whiteboard");
classifier.learn("A brainstorming session will be held today", "Whiteboard");
classifier.learn("slideshow", "Monitor");
classifier.learn("on screen", "Monitor");
classifier.learn("A slideshow of certain tasks that need to be completed", "Monitor");
classifier.learn("A video presentation will be held", "Monitor");
classifier.learn("Video", "Monitor");
classifier.learn("Visual projection", "Projector");
classifier.learn("projection", "Projector");
classifier.learn("projector", "Projector");
classifier.learn("Projector", "Projector");
classifier.learn("wall", "Projector");

//classifier.categorize("Slideshow presentation will be held");
//console.log(classifier.categorize("Slideshow presentation will be held"));
//var prediction = classifier.categorize("A brainstorming event needs to be conducted");
//console.log(prediction);
/*
var saveMe  = classifier.toJson();
fs.writeFile('trainedDataAmenity.txt',saveMe,function (err){
    if(err)
    throw err;
    console.log('Training saved.');

})
*/
/*fs.readFile('trainedDataAmenity.txt', function(err,data){
    if(err)
    return console.log(err);
    var trained = JSON.parse(data);
    console.log(trained);
    loadedData = bayes.fromJson(trained);
})
*/
//console.log(saveMe);
module.exports = {
    identify: async function (eventDescription) {
        var res = classifier.categorize(eventDescription);
        //console.log(res);
        return res.predictedCategory;
    },
};
