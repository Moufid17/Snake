/*  window.onload = function () {}
    Lorsque ka fenêtre se charge, il exécute cet évènement.
*/
window.onload = function () {

    var canvasWidth = 900; var canvasHeight = 600;
    var blockSize = 30;
    var ctx;
    var delay = 100; //en sec
    var widthinBlock = canvasWidth/blockSize;
    var heightinBlock = canvasHeight/blockSize;
    var score;
    var timeout; 
    init();

    function init(){
        /*
            Canvas permet de déssiner sur une fenêtre.
            Comme un JFrame en JAVA.
        */
        var canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "8px solid gray";
        canvas.style.margin = "50px Auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#ddd";
        document.body.appendChild(canvas);//Append means "Ajouter" or "Joindre" in french 
        
        //Besoin d'un context pour y dessiner. Comme un JPanel en JAVA
        ctx = canvas.getContext('2d');
        /*  ctx.fillStyle ="#ff0000"; //Red
            ctx.fillRect(30,30, 100,25); //fillRect(Origin Hor,origin Ver, width,height) 
        */
        apple = new  Apple([15,6]);
        snakee = new Snake([[6,4], [5,4], [4,4]],"right");
        score = 0;
        refreshCanvas();
    }

    function refreshCanvas()
    {   
        snakee.advance();
        if(snakee.checkCollision()){
            gameOver();
        }else{
            if(snakee.isEatApple(apple)){
                score++;
                //Make a new apple at a postion else
                snakee.ateApple = true;
                do
                {
                    apple.setPos();
                }while(apple.isOnSnake(snakee) || apple.isOutBlock());
                // || apple.isOutBlock() == true
            }
            ctx.clearRect(0,0,canvasWidth,canvasHeight);
            drawScore();
            snakee.draw();
            apple.drawApple();
            timeout = setTimeout(refreshCanvas,delay);//Effectue la modification temporelle observée.
        }
    }

    function gameOver()
    {
        ctx.save();
        ctx.fillStyle = "#000";
        ctx.font = "bold 80px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        var centerX = canvasWidth/2;
        var centerY = canvasHeight/2;
        ctx.strokeStyle ="#fff";
        ctx.fillText("Game Over", centerX, 80);
        ctx.strokeText("Game Over", centerX, 80);
        ctx.font = "normal 30px sans-serif";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#000";
        ctx.fillText("Appuyer sur la touche espace pour rejouer", centerX,170);
        ctx.strokeText("Appuyer sur la touche espace pour rejouer", centerX,170);
        ctx.restore();
        //Filltext before 
    }

    function restart()
    {
        score = 0;
        apple = new  Apple([15,6]);
        snakee = new Snake([[6,4], [5,4], [4,4]],"right");
        clearTimeout(timeout);
        refreshCanvas();
    }

    function drawScore()
    {
        ctx.save();
        ctx.fillStyle = "gray";
        ctx.font = "bold 200px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        var centerX = canvasWidth/2;
        var centerY = canvasHeight/2;
        ctx.fillText(score.toString(), centerX, centerY);
        ctx.restore();
    }
    function drawBlock(ctx, posBody)
    {
        var x = posBody[0] * blockSize;
        var y = posBody[1] * blockSize;
        ctx.fillRect(x,y,blockSize,blockSize);
    }

    function Apple(position){
        this.position = position;

        this.drawApple = function(){   
            ctx.save(); //Save current context
            ctx.fillStyle = "#33cc33";
            //To draw circle
            ctx.beginPath();
            var radius = blockSize/2;
            var x = this.position[0] * blockSize + radius;
            var y = this.position[1] * blockSize + radius;
            ctx.arc(x,y,radius,0,Math.PI*2,true);
            ctx.fill();
            ctx.restore();// Add modification and restore the last version
        }    

        this.setPos = function(){   
            var newX = Math.round(Math.random()* widthinBlock-1);//[0,29]
            var newY = Math.round(Math.random()* heightinBlock-1);
            this.position = [newX,newY];
            console.log("x: "+this.position[0]);
            console.log("y: "+this.position[1]);
        }

        this.isOnSnake = function(snakeToCheck){
            for(var i = 0;i < snakeToCheck.body.length;i++){
                if((this.position[0] === snakeToCheck.body[i][0]) && (this.position[1] === snakeToCheck.body[i][1]))
                {
                    return true;
                }
            }
            return false;
        }
        this.isOutBlock = function(){
            if(this.position[0] < 0 || this.position[0] > (widthinBlock-1)  || this.position[1] < 0 || this.position[1] > (canvasHeight-1))
                return  true;
            return false;
        }

    }

    function Snake(body, direction){
        this.body = body;
        this.direction =  direction;
        var ateApple = false;
        this.draw = function(){
            ctx.save(); //Sauvegarde le contenu précédant
            ctx.fillStyle="#ff0000";
            for(var i = 0;i < this.body.length;i++){
                drawBlock(ctx, this.body[i])
            }
            ctx.restore(); //Applique les modifications et on a la nouvelle version.
        };

        this.advance = function(){
            //slice() on array to copy it.
            var nextpos = this.body[0].slice();
            // nextpos[0]++;
            switch(this.direction){
                case "left":
                        nextpos[0]--;
                    break;
                case "right":
                        nextpos[0]++;
                    break;
                case "up":
                        nextpos[1]--;
                    break;
                case "down":
                        nextpos[1]++;
                    break;
                default:
                    throw("Invalid Direction");
            }
            //Error: this.body[i] = nextpos;
            this.body.unshift(nextpos); //Add elt at the biginning and shift remove
            if(!this.ateApple)
                this.body.pop();
            else 
                this.ateApple = false;
        };

        this.setDirection = function(newDirection){
            var allowDirection;
            switch(this.direction){
                case("left"):
                case("right"):
                    allowDirection = ["up","down"];
                    break;
                case("up"):
                case("down"):
                    allowDirection = ["left","right"];
                    break;
                default:
                    throw("Invalid Direction");
            }
            //Index dans cet array est >= 0 ?
            if(allowDirection.indexOf(newDirection) > -1)
            {
                this.direction = newDirection;
            }
        }

        this.checkCollision = function(){
            var wallCollission = false;
            var snakeCollision = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0; var minY = 0;
            var maxX = widthinBlock -1;
            var maxY = heightinBlock -1;
            var isNotinHorizontalBlocks = snakeX < minX || snakeX > maxX;
            var isNotinVerticalBlocks = snakeY < minY || snakeY > maxY;

            if(isNotinHorizontalBlocks || isNotinVerticalBlocks) 
                wallCollission = true;

            for(var i= 0;i < rest.length;i++)
            {
                if(snakeX === rest[i][0] && snakeY === rest[i][1])
                    snakeCollision = true;
            }

            return wallCollission || snakeCollision;
        }

        this.isEatApple = function(AppletoEat){
            var head = this.body[0];
            var snakeX = head[0];
            var snakeY = head[1];
            if(snakeX === AppletoEat.position[0] && snakeY === AppletoEat.position[1])
            {
                return true;
            }else{
                return false;
            }
        }
    }
    document.onkeydown = function handlekeyDown(e){
        var key = e.keyCode;
        var newDirection;
        switch(key){
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39:
                newDirection = "right";
                break;
            case 40:
                newDirection = "down";
                break;
            case 32:
                restart();
                return;
            default:
                return;
        }
        snakee.setDirection(newDirection);
    }
}
