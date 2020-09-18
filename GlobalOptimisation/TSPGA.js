
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
// What if there are more meetingIndexes than rooms available? Can you select rooms in a way such that other meetings are left out and dont get a chance ? 
// 
// Follow on with the SA process thereafter 

// Constraints
// 1. min ave weights from emp nodes to meeting node
// 2. meeting node must have amenity match 
// 3. meeting node must have capacity match 

// Begin process
// Note Phenotype means a specific array of solutions. 
// Global variables -> should ideally get them from the DB directly
var numOfMeetingRooms = 5;
var numOfMeetings = 10; // This value should come from a SELECT * FROM meetings WHERE DATE = CurrentDate [].length
const graph = new Graph(); // Load default graph from gexf or json as a copy, needs to be populated and initialised
var bestPhenotype = [];
var bestPhenotypeScore = 0;
//Simulated annealing global variables
var TEMP = 0.1;
var COOLING_RATE = 0.9;


// The simulated annealing function, needs abit more adjustment.
function simulatedAnnealing()
{
    if(TEMP > 1e-4) // check if js can read 1e-4 as a float
    {

    
    var phenotype = initPopulation(numOfMeetings);
    var score = testFitness(phenotype);

    var newPhenotype = mutationFunction(phenotype);
    var newScore = testFitness(newPhenotype);

    if (newScore < score)
    {
        phenotype = newPhenotype;
        bestPhenotype = newPhenotype;
        return 1; // Accept new solution, Note the graph needs to be changed to depict the new employee locatiosn 
    }
    else if (newScore > score)
    {
        var prob = Math.exp((score-newScore)/TEMP);
        return prob; // Probability of changing to a different phenotype
    }
    TEMP*=COOLING_RATE;
}

}



// This function takes in list of meeting indexes as input parameters 
function initPopulation (numOfMeetings){
    var phenotype = [];
    for ( var i=1 ; i<=numOfMeetings; i++)
    {
        phenotype.push(i); // [meetingIndexi]
        var rnd = Math.random();
        var j = Math.floor(rnd*numOfMeetingRooms);
        phenotype.push(j); // [roomIndexj]
    }
}

function testFitness (phenotype){
    var fitnessScore  = 100*(phenotype.length/2); // i.e) 100 * numberOfmeetings 
    // Formulas - Each meeting contributes upto a max of 100 points
   
    var fitnessScore = 0; // Higher score is better 
    for(var k =0; k<phenotype.length-2;k+=2){   //test every pair 
        var i = k;
    var capScore = getCapScore(i,i+1);
    var amenityScore = getAmenityScore(i,i+1);
    var timeScore = getTimeScore(i,i+1);
        indivCost = 100 - (capScore + amenityScore + timeScore);    // in total worst case scenario it will go to -10 for indivCost. 
        fitnessScore +=indivCost;
    }
    return fitnessScore;
}


// This function checks if capacity is within constraints and applies penalties based on that. 
// Input parameters i = node ID, j = meetingIndex
function getCapScore(i,j)
{
    var meetingCap = meetings[i].capacity;
    var roomCap = graph.getNodeAttribute(i).capacity; 
    if (meetingCap==roomCap){ // No penalty if capacity matches
        return 0;
    }
    else if(meetingCap<roomCap){ // Penalty based on not full room
        var difference = roomCap - meetingCap;

        if (difference > 0.5 * roomCap) // Worst case scenario where room is less than half full.
        {
            return 30;
        }
        else if (difference > 0.25 * roomCap)
        {
            return 15;
        }
        else if (difference > 0.1 * roomCap) // Best case scenario
        {
            return 5;
        }
    }

    else if(meetingCap>roomCap){ // Penalty based on over full room
        var difference = meetingCap - roomCap;

        if (difference < 0.05 * roomCap ) // Bestcase scenario
        {
            return 5;
        }

        else if (difference < 0.15 * roomCap)
        {
            return 20;
        }
        else if (difference > 0.2 * roomCap) // Worst case scenario
        {
            return 50;
        }
    }
        
    
}

// This function checks if amenity matches in both roomVenue and meeting requirements. 
function getAmenityScore (i,j){
    var meetingAmenity = meetings[i].amenity;   
    var roomAmenity = graph.getNodeAttribute(i).amenity;  // Should possibly change graph to indicate amenities present using an array for convenience. 
    // Adjust cases below accordingly based on the changed implementation 
    
    if (meetingAmenity == roomAmenity){ // Exact match so no penalty, best case scenario
        return 0; 
    }

    else if (meetingAmenity != roomAmenity)
    {
        if (meetingAmenity == 'Projector')
        {
            if (roomAmenity == 'Whiteboard') // worst case scenario
            {
                return 20;
            }
            else if (roomAmenity == 'Monitor') // Amenity is still possible to be used in the meeting.
            {
                return 5;
            }
        }
        else if (meetingAmenity == 'Whiteboard')
        {
            return 20; // There is no possible 2nd best solution if there is no whiteboard like in the other amenities which are slightly the same.
        }
        else if (meetingAmenity == 'Monitor')
        {
            if (roomAmenity == 'Whiteboard') // worst case scenario
            {
                return 20;
            }
            else if (roomAmenity == 'Projector') // Amenity is still possible to be used in the meeting.
            {
                return 5;
            }
        }
    }


}

// This function returns the average time taken for all employees. It does not work the same way as in the above scores.
// This is not a penalty application scenario. 
// TODO : Need to adjust code to consider time of meetings. 
function getTimeScore (i,j){
    var roomNode = graph.getNodeAttribute(i); 
    var totalTime; 
    for( var count = 0 ; count<meetings[i].employees.length; count++)
    {
        currEmpNode = getEmpNode(meetings[i].employees[count].id);  // based on emp ID get the location of which node the employee is currently in. 
        totalTime += getTimeBetween(currEmpNode,roomNode);
    }
    var avgTime = totalTime/count;
    
    if(avgTime<240) // Best case scenario where avgTime is less than 5 mins 
    {
        return 0; // No penalty
    }

    else if (avgTime>240 && avgTime < 600)
    {
        return 15;
    }
    else if (avgTime > 600 ) // worst case scenario, over 10 mins avg
    {
        return 40;
    }
}

// This function returns the node where an employee is currently present
function getEmpNode(id){
    graph.forEachNode(node => {
        if (node.EmployeesPresent.contains(id))
        {
            return node;
        }
        else 
        {
            console.warn("Employee with ID: " + id +" was not found present in any of the room nodes.");
        }
      });
}

// This function returns the time between an employee office room and the meeting room as an edge with a weighted value.
function getTimeBetween(src,dest){
var timeTaken = graph.getEdgeAttribute(src,dest).timeWeight;
return timeTaken;
}



// -------------------------------------------------------------- //
// -------------------------------------------------------------- //


// Template GA functions below. 
var mutationFunction = function( phenotype ) {
    var gene1_index = Math.floor(Math.random() * phenotype.length )
    var gene2_index = Math.floor(Math.random() * phenotype.length )
    var temp = phenotype[ gene1_index ]
    phenotype[ gene1_index ] = phenotype[ gene2_index ]
    phenotype[ gene2_index ] = temp
    //console.log("mutant = " + JSON.stringify(phenotype))
    return phenotype;
};

function helper_concat(index, phenotypeA, phenotypeB) {
    return phenotypeA.slice(0, index).concat(phenotypeB.slice(index)).concat(phenotypeA.slice(index));
}

function helper_removeDuplicates(phenotype) {
    var duplicates = {};
    return phenotype.filter(function (item) {
        if (duplicates[JSON.stringify(item)]) {
            return false;
        } else {
            duplicates[JSON.stringify(item)] = true;
            return true;
        }
    });
}

function crossoverFunction(phenotypeA, phenotypeB) {
    var index = Math.round(Math.random() * phenotypeA.length);
    var phenotypeX = helper_removeDuplicates(helper_concat(index, phenotypeA, phenotypeB));
    var phenotypeY = helper_removeDuplicates(helper_concat(index, phenotypeB, phenotypeA));

    // move, copy, or append some values from a to b and from b to a
    return [phenotypeX, phenotypeY];
}

var fitnessFunction = function (phenotype) {
    var calculateDistance = function (b, c) {
        return Math.sqrt(Math.pow(b.x - c.x, 2) + Math.pow(b.y - c.y, 2));
    };

    var prev = phenotype[0];
    //console.log("The phenotype are " + JSON.stringify(phenotype))
    var distances = phenotype.slice(1).map(function (item) {
        var result = [prev, item];
        prev = item;
        return result;
    });
    //console.log("The distances are " + JSON.stringify(distances))
    var distance = distances.reduce(function (total, item) {
        //console.log("item = " + JSON.stringify(item) )
        return total + calculateDistance(item[0], item[1]);
    }, 0);
    //console.log("total = " + distance )
    return -1 * distance;
};

// outline a large square but not in order.
var firstPhenotype = [];
for (i = 2; i < 10; i++) {
    firstPhenotype.push({ x: i, y: 1 });
    firstPhenotype.push({ x: 1, y: i });
    firstPhenotype.push({ x: i, y: 10 });
    firstPhenotype.push({ x: 10, y: i });
}

const { time } = require('console');
const { default: Graph } = require('graphology');
var geneticAlgorithmConstructor = require('../index')
var geneticAlgorithm = geneticAlgorithmConstructor({
    mutationFunction: mutationFunction,
    crossoverFunction: crossoverFunction,
    fitnessFunction: fitnessFunction,
    population: [firstPhenotype],
    populationSize: 1000,
});

console.log("Starting with: ");
console.log(firstPhenotype);
var best = [];
var previousBestScore = 0;
for (var a = 0; a < 100; a++) {
    for (var i = 0; i < 25; i++) geneticAlgorithm.evolve();
    var score = geneticAlgorithm.bestScore();
    if (score == previousBestScore) {
        break;
    }
    previousBestScore = score;
    console.log("Distance is " + -1 * score);
}

best = geneticAlgorithm.best();
console.log("Finished with: ");
console.log(best);
console.log("Distance is " + -1 * fitnessFunction(best));
