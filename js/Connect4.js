var Connect4 = (function() {
    var ConnectFourBoard,
        currentPlayer,
        player1Score,
        player2Score;

    var init = function() {
        currentPlayer = 'red';
        player1Score = 0;
        player2Score = 0;

        ConnectFourBoard  = new Board(6, 7);
    };

    var start = function() {

    };

    var resetScore = function() {
        player1Score = 0;
        player2Score = 0;

        document.getElementById("score_p1").value = player1Score;
        document.getElementById("score_p2").value = player2Score;
    };

    var createTile = function(type) {
        var tile = document.createElement('img');

        if(type == 'blue') {
            tile.src = '/Connect-4/res/c4fillblu.gif';
        } else if(type == 'red') {
            tile.src = '/Connect-4/res/c4fillred.gif';
        } else {
            tile.src = '/Connect-4/res/c4fillempty.gif';
        }

        return tile;
    };

    var changeActivePlayer = function() {
        if(currentPlayer == 'red') {
            currentPlayer = 'blue';
        } else {
            currentPlayer = 'red';
        }
    };

    var Board = function(rows, columns) {
        self = this;
        this.firstRun = true;

        this.board = document.createElement('table');
        this.board.id = 'board';
        this.board.style.margin = '80px auto';
        this.board.style.backgroundColor = '#FFFF99';

        for(var i = 0; i < rows; i++) {
            var blankRow = document.createElement('tr');
            blankRow.id = 'row_' + i;

            for(var j = 0; j < columns; j++) {
                var blankTile = document.createElement('td');
                blankTile.id = i + 'x' + j;
                //blankTile.style.backgroundColor = '#808080';
                blankTile.style.width = '50px';
                blankTile.style.height = '50px';
                blankTile.style.color = '#F3102E';
                blankTile.style.fontSize= '24px';
                blankTile.style.textAlign = 'center';
                blankTile.style.cursor = 'pointer';

                blankTile.appendChild(createTile());
                blankRow.appendChild(blankTile);

                /*blankTile.onclick = function(e) {
                 this.style.backgroundColor = '#808080';
                 this.style.width = '50px';
                 this.style.height = '50px';
                 this.style.color = '#F3102E';
                 this.style.fontSize= '24px';
                 this.style.border = '';
                 this.innerHTML = '';

                 if(this.className == 'wall') {
                 this.className = 'grass';
                 } else if(this.className == 'grass') {
                 this.className = 'water';
                 } else if(this.className == 'water') {
                 this.className = '';
                 } else {
                 this.className = 'wall';
                 }
                 };*/
            }

            blankRow.onclick = function(e) {
                var target = e.target;

                if(e.target.id == "") {
                    target = e.target.parentNode;
                }

                var column = target.id.split('x')[1];

                insertPiece(column);

                var fourConnected = has4PiecesConnected();
                if(fourConnected) {

                    alert(currentPlayer + "has won!")
                    return;
                }

                changeActivePlayer();
            };

            this.board.appendChild(blankRow);
        }

        var has4PiecesConnected = function() {
            return false;
        };

        var insertPiece = function(column) {
            for (var i = rows - 1; i >= 0; i--) {
                var tile = document.getElementById(i + 'x' + column);

                if(tile.className == '') {
                    var newTile = currentPlayer == 'red' ? createTile('red') : createTile('blue');
                    tile.childNodes[0].parentElement.removeChild(tile.childNodes[0]);
                    tile.appendChild(newTile);
                    tile.className = currentPlayer;

                    break;
                }
            }
        };

        document.body.appendChild(this.board);

        var NodeUtilities = {
            insertLengthValue: function(node, distance) {
                var lengthVal = document.createElement("span");
                lengthVal.className = "pathValue";
                lengthVal.innerHTML = distance;
                node.appendChild(lengthVal);
            },
            insertCameFrom: function(node, cameFrom) {
                var cameFromHTML = document.createElement("span");
                cameFromHTML.className = "cameFrom";
                cameFromHTML.innerHTML = cameFrom;
                node.appendChild(cameFromHTML);
            }
        };

        var Heuristics = {
            // TODO Opisati u diplomskom ovu vrstu Matematike i Manhattan distance
            //Manhattan distance on a square grid - Taxi cab mathematics
            manhattanDistance: function(to, from) {
                var paramTo = to.split('x'),
                    toX = parseInt(paramTo[0]),
                    toY = parseInt(paramTo[1]),
                    paramFrom = from.split('x'),
                    fromX = parseInt(paramFrom[0]),
                    fromY = parseInt(paramFrom[1]);

                return Math.abs(toX - fromX) + Math.abs(toY - fromY);
            }
        };

        var highlightFrontNode = function(node) {
            document.getElementById(node).style.backgroundColor = 'blue';
        };

        var highlightCurrentNode = function(node) {
            document.getElementById(node).style.backgroundColor = 'green';
        };

        var highlightVisitedNode = function(node) {
            document.getElementById(node).style.backgroundColor = 'black';
        };

        var highlightGoalNodeCheck = function(node) {
            document.getElementById(node).style.backgroundColor = 'purple';
        };

        var highlightGoal = function(node) {
            document.getElementById(node).style.backgroundColor = 'yellow';
        };

        var highlightStart = function(node) {
            document.getElementById(node).style.backgroundColor = 'white';
        };

        var highlightGoalRoad = function(node) {
            document.getElementById(node).style.border = '4px solid yellow';
        };

        var clearNodeStyle = function(node) {
            document.getElementById(node).style.backgroundColor = '#808080';
        };

        var createGoalRoad = function(road, goalNode) {
            var from = road[goalNode];


            if(road[goalNode] != "") {
                highlightGoalRoad(from);
                createGoalRoad(road, from);
            }
        };

        var contains = function(a, obj) {
            var i = a.length;
            while (i--) {
                if (a[i] === obj) {
                    return true;
                }
            }
            return false;
        };

        var getFrontLine = function(node) {
            var params = node.split('x'),
                i = parseInt(params[0]),
                j = parseInt(params[1]),
                fl = [],
                tempNode = '';

            var isWall = function(node) {
                return document.getElementById(node).className == 'wall';
            };

            if((i-1) >= 0) {
                tempNode = (i-1) + 'x' + j;
                if(!isWall(tempNode))
                    fl.push(tempNode);
                //highlightFrontNode(tempNode);
            }

            if((j-1) >= 0) {
                tempNode = i + 'x' + (j - 1);
                if(!isWall(tempNode))
                    fl.push(tempNode);
                //highlightFrontNode(tempNode);
            }

            if((i+1) < rows) {
                tempNode = (i+1) + 'x' + j;
                if(!isWall(tempNode))
                    fl.push(tempNode);
                //highlightFrontNode(tempNode);
            }

            if((j+1) < columns) {
                tempNode = i + 'x' + (j+1);
                if(!isWall(tempNode))
                    fl.push(tempNode);
                //highlightFrontNode(tempNode);
            }

            return fl;
        };

        var movementCost = function(a, b) {
            var tileType = document.getElementById(b).className;

            if(tileType == 'grass') {
                return 5;
            } else if(tileType == 'water') {
                return 10;
            } else {
                return 1;
            }
        };

        this.reset = function() {
            this.frontLine = [];
            this.history = [];

            var blankTile;

            if(!this.firstRun) {
                for(var i = 0; i < rows; i++) {
                    for(var j = 0; j < columns; j++) {
                        blankTile = document.getElementById(i + 'x' + j);
                        blankTile.style.backgroundColor = '#808080';
                        blankTile.style.width = '50px';
                        blankTile.style.height = '50px';
                        blankTile.style.color = '#F3102E';
                        blankTile.style.fontSize= '24px';
                        blankTile.style.textAlign = 'center';
                        blankTile.style.border = '';
                        blankTile.innerHTML = '';
                    }
                }

            } else {
                this.firstRun = false;
            }
        };

        this.start = function(option) {
            this.startNode = start;
            this.goalNode = goal;
            this.currentNode = start;

            this.reset();

            this.depthOptions = {
                depthVal: 3,
                nodeBeingChecked : '',
                found : false,
                iteration : 0,
                distance : {},
                cameFrom : {},
                unlimited : false
            };

            this.depthOptions.distance[this.startNode] = 0;
            this.depthOptions.cameFrom[this.startNode] = "";

            switch(option){
                case 1:
                    this.Dijkstra(this.startNode);
                    break;
                case 2:
                    this.GreedyBestFirst(this.startNode);
                    break;
                case 3:
                    this.A_Star(this.startNode);
                    break;
            }
        };

        this.sleep = function (miliseconds) {
            var currentTime = new Date().getTime();
            console.log("Sleeping for " + miliseconds + " ms...ZZZzzzzzzzzzzzzzz");
            while (currentTime + miliseconds >= new Date().getTime()) {
            }
        };

        this.Dijkstra = function(startNode) {
            var frontier = [],
                nodeBeingChecked,
                found = false,
                costSoFar = {},
                cameFrom = {};

            highlightStart(startNode);
            frontier.push({
                node : startNode,
                priority: 0
            });
            costSoFar[startNode] = 0;
            cameFrom[startNode] = "";

            while(frontier.length > 0 && !found) {
                var currentNode = frontier.shift().node,
                    currentNodeHTML = document.getElementById(currentNode),
                    neighbours = getFrontLine(currentNode),
                    oldStyle = '',
                    newCost = 0;

                //this.history.push(currentNode);
                highlightCurrentNode(currentNode);
                currentNodeHTML.innerHTML = currentNode;

                if(currentNode == this.goalNode) {
                    highlightGoal(currentNode);
                    found = true;

                    //cameFrom[currentNode] = currentNode;

                    createGoalRoad(cameFrom, currentNode);

                    break;
                }

                // Od node iz frontier-a uzmi neighbours
                for(var i = 0; i < neighbours.length; i++) {
                    nodeBeingChecked = neighbours[i];
                    newCost = costSoFar[currentNode] + movementCost(currentNode, nodeBeingChecked);

                    oldStyle = document.getElementById(nodeBeingChecked).style.backgroundColor;
                    highlightGoalNodeCheck(nodeBeingChecked);

                    if(typeof costSoFar[nodeBeingChecked] == 'undefined' || newCost < costSoFar[nodeBeingChecked]) {
                        costSoFar[nodeBeingChecked] = newCost;
                        frontier.push({
                            node: nodeBeingChecked,
                            priority: newCost
                        });

                        cameFrom[nodeBeingChecked] = currentNode;
                    }

                    if(!found) {
                        document.getElementById(nodeBeingChecked).style.backgroundColor = oldStyle;
                    }
                }

                // Priority que pa sortiramo po najnizoj vrijednosti puta
                frontier.sort(function(a, b){
                    return a.priority - b.priority;
                });

                NodeUtilities.insertLengthValue(currentNodeHTML, costSoFar[currentNode]);
                NodeUtilities.insertCameFrom(currentNodeHTML, cameFrom[currentNode]);
                highlightVisitedNode(currentNode);
            }
        };

        this.GreedyBestFirst = function(startNode) {
            var frontier = [],
                nodeBeingChecked,
                found = false,
                costSoFar = {},
                cameFrom = {};

            highlightStart(startNode);
            frontier.push({
                node : startNode,
                priority: 0
            });
            costSoFar[startNode] = 0;
            cameFrom[startNode] = "";

            while(frontier.length > 0 && !found) {
                var currentNode = frontier.shift().node,
                    currentNodeHTML = document.getElementById(currentNode),
                    neighbours = getFrontLine(currentNode),
                    oldStyle = '',
                    priority = 0;
                //newCost = 0;

                //this.history.push(currentNode);
                highlightCurrentNode(currentNode);
                currentNodeHTML.innerHTML = currentNode;

                if(currentNode == this.goalNode) {
                    highlightGoal(currentNode);
                    found = true;

                    //cameFrom[currentNode] = currentNode;

                    createGoalRoad(cameFrom, currentNode);

                    break;
                }

                // Od node iz frontier-a uzmi neighbours
                for(var i = 0; i < neighbours.length; i++) {
                    nodeBeingChecked = neighbours[i];
                    //newCost = costSoFar[currentNode] + movementCost(currentNode, nodeBeingChecked);

                    oldStyle = document.getElementById(nodeBeingChecked).style.backgroundColor;
                    highlightGoalNodeCheck(nodeBeingChecked);

                    if(typeof cameFrom[nodeBeingChecked] == 'undefined') {
                        // For tracking - not used in calculations
                        costSoFar[nodeBeingChecked] = costSoFar[currentNode] + movementCost(currentNode, nodeBeingChecked);;

                        priority = Heuristics.manhattanDistance(this.goalNode, nodeBeingChecked);
                        frontier.push({
                            node: nodeBeingChecked,
                            priority: priority
                        });

                        cameFrom[nodeBeingChecked] = currentNode;
                    }

                    if(!found) {
                        document.getElementById(nodeBeingChecked).style.backgroundColor = oldStyle;
                    }
                }

                // Priority que pa sortiramo po najnizoj vrijednosti puta
                frontier.sort(function(a, b){
                    return a.priority - b.priority;
                });

                NodeUtilities.insertLengthValue(currentNodeHTML, costSoFar[currentNode]);
                NodeUtilities.insertCameFrom(currentNodeHTML, cameFrom[currentNode]);
                highlightVisitedNode(currentNode);
            }
        };

        this.A_Star = function(startNode) {
            var frontier = [],
                nodeBeingChecked,
                found = false,
                costSoFar = {},
                cameFrom = {};

            highlightStart(startNode);
            frontier.push({
                node : startNode,
                priority: 0
            });
            costSoFar[startNode] = 0;
            cameFrom[startNode] = startNode;

            while(frontier.length > 0 && !found) {
                var currentNode = frontier.shift().node,
                    currentNodeHTML = document.getElementById(currentNode),
                    neighbours = getFrontLine(currentNode),
                    oldStyle = '',
                    priority = 0,
                    newCost = 0;

                //this.history.push(currentNode);
                highlightCurrentNode(currentNode);
                currentNodeHTML.innerHTML = currentNode;

                if(currentNode == this.goalNode) {
                    highlightGoal(currentNode);
                    found = true;

                    //cameFrom[currentNode] = currentNode;

                    createGoalRoad(cameFrom, currentNode);

                    break;
                }

                // Od node iz frontier-a uzmi neighbours
                for(var i = 0; i < neighbours.length; i++) {
                    nodeBeingChecked = neighbours[i];
                    newCost = costSoFar[currentNode] + movementCost(currentNode, nodeBeingChecked);

                    oldStyle = document.getElementById(nodeBeingChecked).style.backgroundColor;
                    highlightGoalNodeCheck(nodeBeingChecked);

                    if(typeof costSoFar[nodeBeingChecked] == 'undefined' || newCost < costSoFar[nodeBeingChecked]) {
                        costSoFar[nodeBeingChecked] = newCost;
                        priority = newCost + Heuristics.manhattanDistance(this.goalNode, nodeBeingChecked);
                        frontier.push({
                            node: nodeBeingChecked,
                            priority: priority
                        });

                        cameFrom[nodeBeingChecked] = currentNode;
                    }

                    if(!found) {
                        document.getElementById(nodeBeingChecked).style.backgroundColor = oldStyle;
                    }
                }

                // Priority que pa sortiramo po najnizoj vrijednosti puta
                frontier.sort(function(a, b){
                    return a.priority - b.priority;
                });

                NodeUtilities.insertLengthValue(currentNodeHTML, costSoFar[currentNode]);
                NodeUtilities.insertCameFrom(currentNodeHTML, cameFrom[currentNode]);
                highlightVisitedNode(currentNode);
            }
        }

        this.iterativeDeepeningSearch = function(currentNode) {
            var depth = 0;

            while(!self.depthOptions.found) {
                depth++;
                self.depthLimitSearch(currentNode, depth);

                this.reset();

                if(self.depthOptions.found) {
                    console.log("Found him on Depth Level: " + depth);
                }
            }
        };
    };

    return {
        init: init,
        start: start,
        resetScore: resetScore
    }
})();

Connect4.init();
//XOI.start();