import Graph from "graphology";
import djikstra from "graphology-shortest-path";
import fs from "fs";
import gexf from "graphology-gexf";
const graph = new Graph();

//Rooms
var room1 = graph.addNode("Room1", {
    roomID: 1,
    capacity: 24,
    Projector: 1,
    whiteboard: 0,
    Monitor: 0,
    EmployeesPresent: [],
});

graph.addNode("Room2", {
    roomID: 2,
    capacity: 6,
    Projector: 0,
    whiteboard: 1,
    Monitor: 1,
    EmployeesPresent: [],
});

graph.addNode("Room3", {
    roomID: 3,
    capacity: 8,
    Projector: 1,
    whiteboard: 0,
    Monitor: 1,
    EmployeesPresent: [],
});

graph.addNode("Room4", {
    roomID: 4,
    capacity: 4,
    Projector: 1,
    whiteboard: 1,
    Monitor: 0,
    EmployeesPresent: [],
});

//Paths

// SRC Room 1
graph.addEdge("Room1", "Room2", {
    timeWeight: 300,
});
graph.addEdge("Room1", "Room3", {
    timeWeight: 240,
});
graph.addEdge("Room1", "Room4", {
    timeWeight: 180,
});

// SRC Room 2
graph.addEdge("Room2", "Room1", {
    timeWeight: 300,
});
graph.addEdge("Room2", "Room3", {
    timeWeight: 60,
});
graph.addEdge("Room2", "Room4", {
    timeWeight: 120,
});

// SRC Room 3
graph.addEdge("Room3", "Room1", {
    timeWeight: 240,
});
graph.addEdge("Room3", "Room2", {
    timeWeight: 60,
});

graph.addEdge("Room3", "Room4", {
    timeWeight: 320,
});

// SRC Room 4
graph.addEdge("Room4", "Room1", {
    timeWeight: 180,
});
graph.addEdge("Room4", "Room2", {
    timeWeight: 120,
});
graph.addEdge("Room4", "Room3", {
    timeWeight: 320,
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
