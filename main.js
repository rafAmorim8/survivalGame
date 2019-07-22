// Variables //
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var canvasWidth = 600;
var canvasHeight = 600;

var playerName;
var playerScore = 0;
var gameLevel = 1;
var gameStatus = 1;
var gunMagazine = 7;

var timeCount = 0;
var timeStarted = Date.now();
var timeEnded;
var createEnemiesTimer = 120;
var speedBoost = 1.5;

var player = {
    x: canvasWidth / 2,
    y: canvasHeight / 2,
    hp: 30,
    w: 32,
    h: 48,
    moveDown: false,
    moveUp: false,
    moveRight: false,
    moveLeft: false,
    speedX: 10,
    speedY: 10,
    aimingDirection: 0,
    bulletSpeed: 1,
    bulletCount: 0,
    reload: false,
    shootingCount: 0,
    img: playerImg,
};

var enemiesList = {};

//load images

var gameStartUi = new Image();
gameStartUi.src = "images/gameStartUi.png";

var backgroundImgOne = new Image();
backgroundImgOne.src = "images/backgroundImgOne.png";

var playerImg = new Image();
playerImg.src = "images/playerImg.png";

var enemiesImg = new Image();
enemiesImg.src = "images/enemiesImg.png";

var firstAidImg = new Image();
firstAidImg.src = "images/firstAid.png";

var gameOverUi = new Image();
gameOverUi.src = "images/gameOverUi.png";

var projectileImg = new Image();
projectileImg.src = "images/projectileImg.png"

//load audio

var gunShotAudio = new Audio();
gunShotAudio.src = "audio/gunFire.mp3";

var gunReloadAudio = new Audio();
gunReloadAudio.src = "audio/gunReload.mp3";

var gunTriggerAudio = new Audio();
gunTriggerAudio.src = "audio/gunTrigger.mp3";

var hitByMonsterAudio = new Audio();
hitByMonsterAudio.src = "audio/hitByMonster.wav";

var gameOverAudio = new Audio();
gameOverAudio.src = "audio/gameover.wav";

var hpBoostAudio = new Audio();
hpBoostAudio.src = "audio/hpBoostAudio.wav";

var enemyHitAudio = new Audio();
enemyHitAudio.src = "audio/enemyHitAudio.wav";



// Draw and move the player
var spriteW = 32,
    spriteH = 48;
var spritePos = 0;

function drawCharacter(character) {
    ctx.save();

    if (player.moveUp) {
        spritePos = 144;
    } else if (player.moveLeft) {
        spritePos = 48;
    } else if (player.moveRight) {
        spritePos = 96;
    } else {
        spritePos = 0;
    }



    if (player.aimingDirection)

        ctx.drawImage(playerImg, 64, spritePos, 32, 48, character.x - (character.w / 2), character.y - (character.h / 2), 32, 48);
    ctx.restore();
}

document.addEventListener("keydown", pressKey, false);
document.addEventListener("keyup", releaseKey, false);

function pressKey(event) {
    // This function moves the player with the WASD keys
    if (event.keyCode == 87) {
        player.moveUp = true;
    } else if (event.keyCode == 65) {
        player.moveLeft = true;
    } else if (event.keyCode == 83) {
        player.moveDown = true;
    } else if (event.keyCode == 68) {
        player.moveRight = true;
    } else if (event.keyCode == 82){
        player.reload = true;
    }
}

function releaseKey(event) {
    if (event.keyCode == 87) {
        player.moveUp = false;
    } else if (event.keyCode == 65) {
        player.moveLeft = false;
    } else if (event.keyCode == 83) {
        player.moveDown = false;
    } else if (event.keyCode == 68) {
        player.moveRight = false;
    } else if (event.keyCode == 82){
        player.reload = false;
    }
}

function movePlayer() {

    if (player.moveUp == true && player.y > player.h - 25) {
        player.y -= player.speedY;
    } else if (player.moveDown == true && player.y < canvasHeight - 25) {
        player.y += player.speedY;
    } else if (player.moveLeft == true && player.x > player.w - 15) {
        player.x -= player.speedX;
    } else if (player.moveRight == true && player.x < canvasWidth - player.speedX) {
        player.x += player.speedX;
    }

    drawCharacter(player);
    requestAnimationFrame(drawCharacter);
}



// Draw and move enemies
function addEnemies(posX, posY, speedX, speedY, id, enemyw, enemyh, img) {
    var enemy = {
        x: posX,
        y: posY,
        speedX: speedX,
        speedY: speedY,
        w: enemyw,
        h: enemyh,
        id: id,
        img: enemiesImg,
    };

    enemiesList[id] = enemy;
}

function createEnemies() {
    var posX = Math.random() * canvasWidth;
    var posY = Math.random() * canvasHeight;
    var enemyh = 25;
    var enemyw = 25;
    var enemyId = Math.random();
    var speedX = speedBoost + Math.random() * 4;
    var speedY = speedBoost + Math.random() * 4;
    var color = 'red';
    addEnemies(posX, posY, speedX, speedY, enemyId, enemyw, enemyh, color);
}

function drawEnemies(enemies) {
    ctx.save();
    ctx.drawImage(enemies.img, 64, 0, 32, 48, enemies.x - (enemies.w / 2), enemies.y - (enemies.h / 2), 32, 48);
    ctx.restore();
}

function moveEnemies(enemies) {
    enemies.x += enemies.speedX;
    enemies.y += enemies.speedY;

    if (enemies.x < 0 || enemies.x > canvasWidth) {
        enemies.speedX = -enemies.speedX;
    }
    if (enemies.y < 0 || enemies.y > canvasHeight) {
        enemies.speedY = -enemies.speedY;
    }
}

function updateEnemies(enemies) {
    moveEnemies(enemies);
    drawEnemies(enemies);
}


//Health pack
var boostList = {};

function addHpBoost(posX, posY, id, hpBoostW, hpBoostH, img, timer) {
    var hpBoost = {
        x: posX,
        y: posY,
        w: hpBoostW,
        h: hpBoostH,
        id: id,
        img: firstAidImg,
        timer: 0,
    };

    boostList[id] = hpBoost;
}

function createHpBoost() {
    var posX = Math.random() * canvasWidth;
    var posY = Math.random() * canvasHeight;
    var h = 15;
    var w = 15;
    var id = Math.random();
    addHpBoost(posX, posY, id, w, h);
}

function drawIcons(icon) {
    ctx.save();
    ctx.drawImage(icon.img, 0, 0, 30, 30, icon.x - (icon.w / 2), icon.y - (icon.h / 2), 30, 30);
    ctx.restore();
}

//Aiming and Shooting 

var projectileList = {};

function addProjectile(posX, posY, speedX, speedY, id, projectileW, projectileH, img) {
    var projectile = {
        x: posX,
        y: posY,
        w: projectileW,
        h: projectileH,
        speedX: speedX,
        speedY: speedY,
        id: id,
        img: projectileImg,
    };
    gunShotAudio.play();
    projectileList[id] = projectile;
}

function createProjectile() {
    var posX = player.x;
    var posY = player.y;
    var h = 5;
    var w = 12;
    var id = Math.random();
    var angle = player.aimingDirection;
    var speedX = Math.cos(angle / 180 * Math.PI) * 2.5;
    var speedY = Math.sin(angle / 180 * Math.PI) * 2.5;
    if(gunMagazine > 0){
        addProjectile(posX, posY, speedX, speedY, id, w, h);
        // gunShotAudio.play();
        gunMagazine--;
    }
}

function moveProjectile(icon) {
    icon.x += icon.speedX;
    icon.y += icon.speedY;
}

function drawProjectile(icon) {
    ctx.save();
    ctx.drawImage(icon.img, 0, 0, 5, 8, icon.x - (icon.w / 2), icon.y - (icon.h / 2), 5, 8);    
    ctx.restore();
}

function updateProjectile(icon) {
    moveProjectile(icon);
    drawProjectile(icon);
}
document.onmousemove = function (e) {
    var mousePosX = e.clientX - canvas.getBoundingClientRect().left;
    var mousePosY = e.clientY - canvas.getBoundingClientRect().top;

    mousePosX -= player.x;
    mousePosY -= player.y;

    player.aimingDirection = Math.atan2(mousePosY, mousePosX) / Math.PI * 180;
}




// Gameplay

function collision(shape1, shape2) {
    if (shape1.x <= shape2.x + shape2.w &&
        shape1.x + shape1.w >= shape2.x &&
        shape1.y <= shape2.y + shape2.h &&
        shape1.h + shape1.y >= shape2.y) {
        return true;
    } else {
        return false;
    }
}

function testCollision(playerShape, enemyShape) {
    var playerShape = {
        x: playerShape.x - (playerShape.w / 2),
        y: playerShape.y - (playerShape.h / 2),
        w: playerShape.w,
        h: playerShape.h,
    }

    var enemyShape = {
        x: enemyShape.x - (enemyShape.w / 2),
        y: enemyShape.y - (enemyShape.h / 2),
        w: enemyShape.w,
        h: enemyShape.h,
    }

    return collision(playerShape, enemyShape);
}


// Canvas //
function resetGame() {
    timeCount = 0;
    createEnemiesTimer = 120;
    enemiesList = {};
    boostList = {};
    projectileList = {};
    timeStarted = Date.now();
    timeEnded = 0;
    player.hp = 30;
    playerScore = 0;
    gunMagazine = 7;
    gameStatus = 2;
}

function drawHpBar() {
    ctx.save();
    ctx.font = "25px Unlock";
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'orange';
    ctx.strokeText(player.hp + "Hp", 510, 30);
    ctx.fillStyle = 'black';
    ctx.fillText(player.hp + "Hp", 510, 30);
    ctx.restore();
}

function drawScore() {
    ctx.save();
    ctx.font = "25px Unlock";
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'orange';
    ctx.strokeText("Score: " + playerScore, 10, 30);
    ctx.fillStyle = 'black';
    ctx.fillText("Score: " + playerScore, 10, 30);
    ctx.restore();
}

function drawBulletCount() {
    ctx.save();
    ctx.font = "18px Unlock";
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'orange';
    ctx.strokeText("Bullets: " + gunMagazine, 500, 575);
    ctx.fillStyle = 'black';
    ctx.fillText("Bullets: " + gunMagazine, 500, 575);
    ctx.restore();
}


function reloadMagazine(){
    gunMagazine = 7;
}

function reloadGun(){
    if (player.reload == true && gunMagazine == 0) {
        gunReloadAudio.play();
        setTimeout(reloadMagazine, 2500);
    }
}



function updateCanvas() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    if (gameLevel == 1) {
        ctx.drawImage(backgroundImgOne, 0, 0, 600, 600);
    }
    
    timeCount++;

    if (createEnemiesTimer > 10) {
        if (timeCount % 500 == 0) {
            createEnemiesTimer -= 10;
            console.log("boost speed");
            speedBoost += 1;
        }
    }

    if (timeCount % createEnemiesTimer == 0) {
        createEnemies();
    }

    for (var i in enemiesList) {
        updateEnemies(enemiesList[i]);

        var collided = testCollision(player, enemiesList[i]);
        if (collided) {
            player.hp -= 1;
            hitByMonsterAudio.play();
            if (player.hp <= 0) {
                gameOverAudio.play();
                timeEnded = Date.now();
                playerScore += Math.round((timeEnded - timeStarted) / 1000);
                gameStatus = 3;
                break;
            }
        }
    }

    if (timeCount % 850 == 0) {
        createHpBoost();
    }

    for (var i in boostList) {
        drawIcons(boostList[i]);
        boostList[i].timer++;
        var toDelete = false;

        if (boostList[i].timer > 60) {
            toDelete = true;
        }

        var collided = testCollision(player, boostList[i]);
        if (collided && player.hp <= 20) {
            hpBoostAudio.play();
            player.hp += 10;
            delete boostList[i];
        } else if (collided && player.hp > 20) {
            hpBoostAudio.play();
            player.hp = 30;
            delete boostList[i];
        }

        if (toDelete == true) {
            delete boostList[i];
        }
    }

    for (var i in projectileList) {
        updateProjectile(projectileList[i]);

        var needToDelete = false;

        if (projectileList[i].x < 0 || projectileList[i].x > canvasWidth) {
            needToDelete = true;
        } else if (projectileList[i].y < 0 || projectileList[i].y > canvasHeight) {
            needToDelete = true;
        }

        for (var j in enemiesList) {
            var collided = testCollision(projectileList[i], enemiesList[j]);
            if (collided) {
                enemyHitAudio.play();
                delete projectileList[i];
                delete enemiesList[j];
                playerScore += 10;
                break;
            }
        }

        if (needToDelete == true) {
            delete projectileList[i];
        }
    }
    drawBulletCount();
    drawScore();
    drawHpBar();
    movePlayer();
    drawCharacter(player);
    reloadGun();

}

// Running the game

function mainMenu(){

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(gameStartUi, 0, 0, 600, 600);

   
}

function gameOver(){
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(gameOverUi, 0, 0, 600, 600);

    ctx.save();
    ctx.font = "50px Unlock";
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.strokeText("Final Score: " + playerScore, 100, 350);
    ctx.fillStyle = 'rgb(228, 168, 34)';
    ctx.fillText("Final Score: " + playerScore, 100, 350);
    ctx.restore();

 }

 //mouse behaviour





function startGame(){
    document.onmousedown = function(e){
        if(gameStatus == 1){
            var mouseX = e.clientX;
            var mouseY = e.clientY;
            
    
            if(mouseX >= 0 && mouseX <= 2000 && mouseY >= 0 && mouseY <= 2000){
                gameStatus = 2; 
            }
        }else if(gameStatus == 2){
            createProjectile();
            console.log("shoot");
        }else if(gameStatus == 3){
            var mouseX = e.clientX;
            var mouseY = e.clientY;
    
            if(mouseX >= 0 && mouseX <= 2000 && mouseY >= 0 && mouseY <= 2000){
                resetGame();
            }
        }
    }

    if(gameStatus == 1){
        mainMenu();
    }else if(gameStatus == 2){
        updateCanvas();
    }else if(gameStatus == 3){
        gameOver();
    }
}

setInterval(startGame, 40);