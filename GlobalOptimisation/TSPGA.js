
// Sources: http://abdulfatir.com/tutorials/tsp-simulatedannealing.html
// https://github.com/dzhang55/travelling-salesman
// https://github.com/GigaMatt/ai-room-scheduleing
// 
// Strategy 

// Input sources: 

// 1. Database entries of all events of a certain day. Store in an object array/ JSON object.
// 2. Network graph. 
// Chromosome representation : [ MeetingIndex roomVenue .. ..  ]

// Initial population assignment : 
// 1. Assign random rooms to each meeting taking place. 
// 2, Selection criteria -> Amenity must match, capacity must match, time available.
// 3. Time available how to check -> if there is another possible meeting that will have the same venue as its lowest time
// then what will happen is there will be multiple of same venueIndex. However Once that occurs check if the meetings take place around
// the same time.  If so then one of them needs to drop that venueIndex. 

// With initial population now we start the process 
// mutation function swaps every roomVenue based on simulated annealing algo
// SA uses fitness function 

// Fitness function 
// Given meetingIndex and roomVenue calculate average minimal weights from each employee (NODE) to the specific roomVenue (NODE)
// getEmployeeLocation will return the location around the time of the meeting 
// How? 
// 1.) Check other meetings within the day and if you identify another meetingIndex
// where it has the same employee, then check the times. If the time is not within 15 mins i.e 
// not 15 mins to next meeting then assume they are in their office location and use that otherwise you use the current
// solutions as the starting point. 
// See other acceptance funtions we may use, minimise all weights or sum of all weights for each pair of meetingIndex and roomVenue
// What if there are more meetingIndexes than rooms available? Can you select rooms such that others dont get a chance ? 
// 
// Follow on with the SA process thereafter 
// 
 








var mutationFunction = function( phenotype ) {
    var gene1_index = Math.floor(Math.random() * phenotype.length )
    var gene2_index = Math.floor(Math.random() * phenotype.length )
    var temp = phenotype[ gene1_index ]
    phenotype[ gene1_index ] = phenotype[ gene2_index ]
    phenotype[ gene2_index ] = temp
    //console.log("mutant = " + JSON.stringify(phenotype))
    return phenotype
}

function helper_concat(index,phenotypeA,phenotypeB) {
    return phenotypeA.slice(0,index).concat( phenotypeB.slice(index) ).concat( phenotypeA.slice(index) )
}

function helper_removeDuplicates(phenotype) {
    var duplicates = {}
    return phenotype.filter( function( item ) { 
        if ( duplicates[JSON.stringify(item)] ) { return false }
        else { duplicates[JSON.stringify(item)] = true ; return true }
    })
}

function crossoverFunction(phenotypeA, phenotypeB) {
    var index = Math.round( Math.random() * phenotypeA.length )


    phenotypeX = helper_removeDuplicates( helper_concat(index,phenotypeA,phenotypeB) )
    phenotypeY = helper_removeDuplicates( helper_concat(index,phenotypeB,phenotypeA) )

    // move, copy, or append some values from a to b and from b to a
    return [ phenotypeX , phenotypeY ]
}


var fitnessFunction = function( phenotype ) {

    var calculateDistance = function( a , b ) {
        return Math.sqrt( Math.pow( a.x - b.x , 2 ) + Math.pow( a.y - b.y , 2 ) )
    }

    var prev = phenotype[ 0 ]
    //console.log("The phenotype are " + JSON.stringify(phenotype))
    var distances = phenotype.slice(1).map( function( item ) { result = [prev,item] ; prev = item ; return result } )
    //console.log("The distances are " + JSON.stringify(distances))
    var distance = distances.reduce( function( total, item ) { 
        //console.log("item = " + JSON.stringify(item) )
        return total + calculateDistance(item[0],item[1])
    } , 0 )
    //console.log("total = " + distance )
    return -1 * distance
}

// outline a large square but not in order.
var firstPhenotype = []
for (i=2;i<10;i++) {
    firstPhenotype.push( {x:i,y:1} )
    firstPhenotype.push( {x:1,y:i} )
    firstPhenotype.push( {x:i,y:10} )
    firstPhenotype.push( {x:10,y:i} )
}

var geneticAlgorithmConstructor = require('../index')
var geneticAlgorithm = geneticAlgorithmConstructor({
    mutationFunction: mutationFunction,
    crossoverFunction: crossoverFunction,
    fitnessFunction: fitnessFunction,
    population: [ firstPhenotype ],
    populationSize:1000
});

console.log("Starting with:")
console.log( firstPhenotype )
var best = []
var previousBestScore = 0
for( var a = 0 ; a < 100 ; a++ ) {
    for( var i = 0 ; i < 25 ; i++ ) geneticAlgorithm.evolve()
    var score = geneticAlgorithm.bestScore()
    if ( score == previousBestScore ) {
        break;
    }
    previousBestScore = score
    console.log("Distance is " + -1 * score)
    
}
best = geneticAlgorithm.best()
console.log("Finished with:")
console.log(best)
console.log("Distance is " + -1 * fitnessFunction(best))