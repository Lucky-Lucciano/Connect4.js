/**
 * Created by Luka on 26-Nov-15.
 */
var Board = function(rows, columns, start, goal) {
    self = this;
    this.firstRun = true;

    this.board = document.createElement('table');
    this.board.id = 'board';
    this.board.style.margin = '80px auto';

    for(var i = 0; i < rows; i++) {
        var blankRow = document.createElement('tr');
        blankRow.id = 'row_' + i;

        for(var j = 0; j < columns; j++) {
            var blankTile = document.createElement('td');
            blankTile.id = i + 'x' + j;
            blankTile.style.backgroundColor = '#808080';
            blankTile.style.width = '50px';
            blankTile.style.height = '50px';
            blankTile.style.color = '#F3102E';
            blankTile.style.fontSize= '24px';
            blankTile.style.textAlign = 'center';
            blankTile.style.cursor = 'pointer';
            blankTile.onclick = function(e) {
                this.style.backgroundColor = '#808080';
                this.style.width = '50px';
                this.style.height = '50px';
                this.style.color = '#F3102E';
                this.style.fontSize= '24px';
                this.style.border = '';
                this.innerHTML = '';

                if(this.className == 'wall') {
                    this.className = '';
                } else {
                    this.className = 'wall';
                }
            };
            blankRow.appendChild(blankTile);
        }

        this.board.appendChild(blankRow);
    }

    document.body.appendChild(this.board);

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

    highlightGoal(goal);
    highlightStart(start);

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

            highlightGoal(goal);
            highlightStart(start);
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

        // Ovo sam koristio da bi svi nodovi dijelili jednu vrijednost umjesto da idem po nivoima
        //this.depthOptions.depth = this.depthOptions.depthVal;

        switch(option){
            case 1:
                this.realBreadthSearch(this.startNode);
                break;
            case 2:
                var depthLevel = document.getElementById('depthValue').value;

                if(depthLevel  == "") {
                    depthLevel = -1;
                    this.depthOptions.unlimited = true;
                }

                this.depthLimitSearch(this.startNode, depthLevel);
                break;
            case 3:
                this.iterativeDeepeningSearch(this.startNode);
                break;
        }
    };

    this.sleep = function (miliseconds) {
        var currentTime = new Date().getTime();
        console.log("Sleeping for " + miliseconds + " ms...ZZZzzzzzzzzzzzzzz");
        while (currentTime + miliseconds >= new Date().getTime()) {
        }
    };

    this.realBreadthSearch = function(startNode) {
        var que = [],
            nodeBeingChecked,
            found = false,
            iteration = 0,
            iterationLvl = 1,
            distance = {},
            cameFrom = {};

        highlightStart(startNode);
        que.push(startNode);
        distance[startNode] = 0;
        cameFrom[startNode] = "";

        while(que.length > 0 && !found) {
            var currentNode = que.shift(),
                currentNodeHTML = document.getElementById(currentNode),
                frontline = getFrontLine(currentNode),
                oldStyle = '';

            this.history.push(currentNode);
            highlightCurrentNode(currentNode);
            currentNodeHTML.innerHTML = currentNode;

            //this.sleep(1000);

            // prodji sve childove i provjeri je l goal
            for(var i = 0; i < frontline.length; i++) {
                nodeBeingChecked = frontline[i];
                oldStyle = document.getElementById(nodeBeingChecked).style.backgroundColor;
                highlightGoalNodeCheck(nodeBeingChecked);

                if(nodeBeingChecked == this.goalNode) {
                    highlightGoal(nodeBeingChecked);
                    found = true;

                    distance[nodeBeingChecked] = 1 + distance[currentNode];
                    cameFrom[nodeBeingChecked] = currentNode;

                    createGoalRoad(cameFrom, nodeBeingChecked);
                } else {
                    if(!contains(this.history, nodeBeingChecked) && !contains(que, nodeBeingChecked)) {
                        que.push(nodeBeingChecked);

                        distance[nodeBeingChecked] = 1 + distance[currentNode];
                        cameFrom[nodeBeingChecked] = currentNode;
                    }
                }
                if(!found) {
                    document.getElementById(nodeBeingChecked).style.backgroundColor = oldStyle;
                }
            }

            var lengthVal = document.createElement("span");
            lengthVal.className = "pathValue";
            lengthVal.innerHTML = distance[currentNode];
            currentNodeHTML.appendChild(lengthVal);

            var cameFromHTML = document.createElement("span");
            cameFromHTML.className = "cameFrom";
            cameFromHTML.innerHTML = cameFrom[currentNode];
            currentNodeHTML.appendChild(cameFromHTML);

            highlightVisitedNode(currentNode);
        }
    };

    this.depthLimitSearch = function(currentNode, depth) {
        if(currentNode == this.goalNode) {
            highlightGoal(currentNode);

            //self.depthOptions.cameFrom[currentNode] = currentNode;
            //self.depthOptions.distance[currentNode] = 1 + self.depthOptions.distance[currentNode];
            createGoalRoad(self.depthOptions.cameFrom, currentNode);

            self.depthOptions.found = true;

            return;
        }

        if(depth < 0 && !self.depthOptions.unlimited) {
            return;
        }/* else if(currentNode == self.startNode){
         self.depthOptions.depth = self.depthOptions.depthVal;
         self.depthLimitSearch(nodeBeingChecked);
         //return;
         }*/

        var frontline = getFrontLine(currentNode),
            currentNodeHTML = document.getElementById(currentNode),
            oldStyle = '',
            nodeBeingChecked;

        highlightCurrentNode(currentNode);
        currentNodeHTML.innerHTML = currentNode;

        var lengthVal = document.createElement("span");
        lengthVal.className = "pathValue";
        lengthVal.innerHTML = self.depthOptions.distance[currentNode];
        currentNodeHTML.appendChild(lengthVal);

        var cameFromHTML = document.createElement("span");
        cameFromHTML.className = "cameFrom";
        cameFromHTML.innerHTML = self.depthOptions.cameFrom[currentNode];
        currentNodeHTML.appendChild(cameFromHTML);

        this.history.push(currentNode);

        for(var i = 0; i < frontline.length; i++) {
            if(self.depthOptions.found)
                break;

            nodeBeingChecked = frontline[i];
            oldStyle = document.getElementById(nodeBeingChecked).style.backgroundColor;

            if(!contains(this.history, nodeBeingChecked)) {
                highlightGoalNodeCheck(nodeBeingChecked);
                self.depthOptions.cameFrom[nodeBeingChecked] = currentNode;
                self.depthOptions.distance[nodeBeingChecked] = 1 + self.depthOptions.distance[currentNode];

                self.depthLimitSearch(nodeBeingChecked, depth - 1);

                //highlightVisitedNode(nodeBeingChecked);
            } else {
                continue;
            }

            //clearNodeStyle(nodeBeingChecked);

            //if(!self.depthOptions.found)
            //highlightVisitedNode(nodeBeingChecked);// document.getElementById(nodeBeingChecked).style.backgroundColor = oldStyle;
        }

        highlightVisitedNode(currentNode);

        return;
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

var XOI = new Board(10, 20, '5x10', '2x5');
//XOI.start();