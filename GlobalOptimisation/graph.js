import Graph from "graphology";
import djikstra from "graphology-shortest-path";
import fs from "fs";
import gexf from "graphology-gexf";
const graph = new Graph();

// Employee office Rooms 
graph.addNode('Emp1_Office',{
    roomID: 'EO1', 
    meetingRoom: 0, 
    EmployeesPresent: [] 
});

graph.addNode('Emp2_Office',{
    roomID: 'EO2',
    meetingRoom: 0, 
    EmployeesPresent: []
});
graph.addNode('Emp3_Office',{
    roomID: 'EO3', 
    meetingRoom: 0,
    EmployeesPresent: [] 
});

graph.addNode('Emp4_Office',{
    roomID: 'EO4',
    meetingRoom: 0, 
    EmployeesPresent: []
});
graph.addNode('Emp5_Office',{
    roomID: 'EO5', 
    meetingRoom: 0, 
    EmployeesPresent: [] 
});

graph.addNode('Emp6_Office',{
    roomID: 'EO6',
    meetingRoom: 0, 
    EmployeesPresent: []
});
graph.addNode('Emp7_Office',{
    roomID: 'EO7', 
    meetingRoom: 0, 
    EmployeesPresent: [] 
});

graph.addNode('Emp8_Office',{
    roomID: 'EO8',
    meetingRoom: 0, 
    EmployeesPresent: []
});
graph.addNode('Emp9_Office',{
    roomID: 'EO9', 
    meetingRoom: 0, 
    EmployeesPresent: [] 
});

graph.addNode('Emp10_Office',{
    roomID: 'EO10',
    meetingRoom: 0, 
    EmployeesPresent: []
});


// Meeting Rooms 
graph.addNode('MeetingRoom_1',{
    roomID: 'MR1',
    meetingRoom: 1, // Indicates this node is a meeting room. 
    capacity: 3,
    Projector: 0,
    whiteboard:0,
    Monitor: 1,
    EmployeesPresent: [],
});
graph.addNode('MeetingRoom_2',{
    roomID: 'MR2',
    meetingRoom: 1,
    capacity: 5,
    Projector: 1,
    whiteboard: 0,
    Monitor: 0,
    EmployeesPresent: []
});
graph.addNode('MeetingRoom_3',{
    roomID: 'MR3',
    meetingRoom: 1,
    capacity: 8,
    Projector: 1,
    whiteboard:1,
    Monitor: 1,
    EmployeesPresent: [],
});
graph.addNode('MeetingRoom_4',{
    roomID: 'MR4',
    meetingRoom: 1,
    capacity: 5,
    Projector: 1,
    whiteboard: 1,
    Monitor: 0,
    EmployeesPresent: [],
});
graph.addNode('MeetingRoom_5',{
    roomID: 'MR5',
    meetingRoom: 1,
    capacity: 6,
    Projector: 0,
    whiteboard:1,
    Monitor: 1,
    EmployeesPresent: []
});


//Paths 50 edges -> 10 employees to 5 meeting rooms 

// All edges from EO1 
graph.addEdge('EO1', 'MR1',{
    timeWeight: 220
});
graph.addEdge('EO1', 'MR2',{
    timeWeight: 140
});
graph.addEdge('EO1', 'MR3',{
    timeWeight: 180
});
graph.addEdge('EO1', 'MR4',{
    timeWeight: 200
});
graph.addEdge('EO1', 'MR5',{
    timeWeight: 110
});

// All edges from EO2 
graph.addEdge('EO2', 'MR1',{
    timeWeight: 60
});
graph.addEdge('EO2', 'MR2',{
    timeWeight: 85
});
graph.addEdge('EO2', 'MR3',{
    timeWeight: 90
});
graph.addEdge('EO2', 'MR4',{
    timeWeight: 75
});
graph.addEdge('EO2', 'MR5',{
    timeWeight: 65
});

EO3
// All edges from EO3
graph.addEdge('EO3', 'MR1',{
    timeWeight: 200
});
graph.addEdge('EO3', 'MR2',{
    timeWeight: 180
});
graph.addEdge('EO3', 'MR3',{
    timeWeight: 120
});
graph.addEdge('EO3', 'MR4',{
    timeWeight: 85
});
graph.addEdge('EO3', 'MR5',{
    timeWeight: 30
});


// All edges from EO4
graph.addEdge('EO4', 'MR1',{
    timeWeight: 60
});
graph.addEdge('EO4', 'MR2',{
    timeWeight: 100
});
graph.addEdge('EO4', 'MR3',{
    timeWeight: 150
});
graph.addEdge('EO4', 'MR4',{
    timeWeight: 180
});
graph.addEdge('EO4', 'MR5',{
    timeWeight: 240
});


// All edges from EO5 
graph.addEdge('EO5', 'MR1',{
    timeWeight: 300
});
graph.addEdge('EO5', 'MR2',{
    timeWeight: 250
});
graph.addEdge('EO5', 'MR3',{
    timeWeight: 125
});
graph.addEdge('EO5', 'MR4',{
    timeWeight: 130
});
graph.addEdge('EO5', 'MR5',{
    timeWeight: 95
});  


console.log("Number of nodes ", graph.order);
console.log("Number of edges ", graph.size);
console.log("Details of Room1: ", graph.getNodeAttributes("Room1"));

graph.forEachNode((node) => {
    graph.forEachNeighbor(node, (neighbor) => console.log(node, neighbor));
});

const paths = djikstra.singleSource(graph, room1, "timeWeight");

console.log(paths);

fs.writeFileSync("networkGraph.json", JSON.stringify(graph.export()));
fs.writeFileSync("gexfGraph.gexf", gexf.write(graph));
