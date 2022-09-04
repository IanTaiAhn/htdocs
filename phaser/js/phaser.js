
var config = {
    type: Phaser.AUTO,
    width: 1600,
    height: 900,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// sprites
var player;

// Physical World objects
var mush1, mush2, bush1, bush2, dirt1;

// mobs
var mob, mob1, mob2, mob3;
// health
var mobH = 0;
var mob1H = 0;
var mob2H = 0;
var mob3H = 0;
var mobHText;
// var platforms;
var cursors;
var score = 0;
var gameOver = false;

// on screen text
var scoreText;
var gameSetText;
var gameStartText;

// background vars
var background, mainBack, multiBack;
var cloudsWhite, cloudsWhiteSmall;
var playerGround;

// stage colliders
var groundCollider, skyCollider, sideColliderL, sideColliderR;
// hitbox vars
var slash;

// timed events
var gameSetEvent;
var gameStartEvent;
var clearMobTintEvent;
var mobSetTintEvent;
var staggerMobEvent, staggerMobEvent1, staggerMobEvent2, staggerMobEvent3;

// hit event (test)
var slashEvent;
var timer;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.image('cloudsmain', 'assets/main_sky_background.png');
    this.load.image('cloudsmulti', 'assets/multi_clouds_background.png');
    this.load.image("clouds-white", "assets/clouds-white.png");
    this.load.image("clouds-white-small", "assets/clouds-white-small.png");
    this.load.image('background01', "assets/background01.png");
    this.load.image('bush01', "assets/bush01.png");
    this.load.image('bush02', "assets/bush02.png");
    this.load.image('dirt01', "assets/dirt01.png");
    this.load.image('mushroom01', "assets/mushroom01.png");
    this.load.image('mushroom02', "assets/mushroom02.png");
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    // this.load.spritesheet('girl', 'assets/girlwalk.png', { frameWidth: 67.5, frameHeight: 122 });
    this.load.spritesheet('girlidle', 'assets/mush_girl_idle.png', { frameWidth: 67.5, frameHeight: 122 });
    // this.load.spritesheet('girl2', 'assets/mush_walk.png', { frameWidth: 240, frameHeight: 240 });
    this.load.spritesheet('girl2', 'assets/walkanims64C.png', { frameWidth: 90.9, frameHeight: 118 });

    this.load.spritesheet('girlslashstatic', 'assets/slash_still2.png', { frameWidth: 240, frameHeight: 240 });
    // this.load.spritesheet('girlslash', 'assets/mush_girl_slash_copy.png', { frameWidth: 82, frameHeight: 62 });
    this.load.spritesheet('girlslash', 'assets/slashanims.png', { frameWidth: 319, frameHeight: 240 });

}

function create ()
{
    this.cameras.main.setBounds(0,0, 1600, 900);
    // sets hard world bounds.. Probably better to use this instead of colliders to seperate the player from other things.
    this.physics.world.setBounds(0,0, 1600, 900);

    //  A simple background for our game
    background = this.add.image(800, 100, 'sky');
    background.setScale(2, 1);

    // some background testing stuff
    // mainBack = this.add.image(800, 100, 'cloudsmain');
    // mainBack.setScale(3,2);
    // multiBack = this.add.image(800, 100, 'cloudsmulti');
    // multiBack.setScale(1,1);
    // mainBack = this.add.tileSprite(800, 100, 1600, 289, 'cloudsmain');
    // mainBack.setScale(1,2);
    // multiBack = this.add.tileSprite(800, 100, 1600, 780, 'cloudsmulti');

    // these are transparent pngs
    cloudsWhite = this.add.tileSprite(800, 200, 1600, 400, "clouds-white");
    cloudsWhiteSmall = this.add.tileSprite(800, 200, 1600, 400, "clouds-white-small");

    // green rectangle, will replace with actual ground, and assests, and such.
    // var platforms = this.physics.add.staticGroup();
    // platforms.create(800, 870, 'ground').setScale(5, 30).refreshBody();


    // Actual drawn background... It looks so good!
    playerGround = this.physics.add.staticGroup();
    playerGround.create(800, 650, 'background01').setScale(1,1.15).refreshBody();

    // the actual colliders seperating the player from the sky, and the edge of the screen.
    groundCollider = this.physics.add.staticGroup();
    groundCollider.create(1, 1056).setScale(100, 9.8).refreshBody();

    skyCollider = this.physics.add.staticGroup();
    skyCollider.create(550, 390).setScale(80, .05).refreshBody();

    sideColliderL = this.physics.add.staticGroup();
    sideColliderL.create(0, 420).setScale(.05, 30).refreshBody();
    sideColliderR = this.physics.add.staticGroup();
    sideColliderR.create(1600, 420).setScale(.05, 30).refreshBody();
    
    // Physical world objects
    mush1 = this.physics.add.sprite(400,400, 'mushroom01').setScale(.2,.2);

    // The player and its settings
    // player = this.physics.add.sprite(600, 1050, 'dude');    // creates him near the bottom
    player = this.physics.add.sprite(800, 550, 'girlidle');    // creates him near the top
    mob = this.physics.add.sprite(1400, 400, 'dude');
    mob1 = this.physics.add.sprite(100, 500, 'dude');
    mob2 = this.physics.add.sprite(600, 550, 'dude');
    mob3 = this.physics.add.sprite(400, 600, 'dude');

    slash = this.physics.add.sprite(8000, 8000, 'girlslashstatic');

    //  Player physics properties. Give the little guy a slight bounce.
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('girl2', { start: 0, end: 7 }),
        frameRate: 12,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'girlidle' } ],
        // frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('girl2', { start: 0, end: 7 }),
        frameRate: 12,
        repeat: -1
    });

    this.anims.create({
        key: 'space',
        // frames: this.anims.generateFrameNumbers('girlslash', { start: 0, end: 1 }),
        frames: [ { key: 'girlslashstatic' } ]
        // frameRate: 20
        // repeat: -1
    });

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(player, skyCollider);
    this.physics.add.collider(player, mob);
    this.physics.add.collider(player, mob1);
    this.physics.add.collider(player, mob2);
    this.physics.add.collider(player, mob3);

    this.physics.add.collider(mob, groundCollider);
    this.physics.add.collider(mob1, groundCollider);
    this.physics.add.collider(mob2, groundCollider);
    this.physics.add.collider(mob3, groundCollider);

    this.physics.add.collider(mob, skyCollider);
    this.physics.add.collider(mob1, skyCollider);
    this.physics.add.collider(mob2, skyCollider);
    this.physics.add.collider(mob3, skyCollider);

    this.physics.add.collider(mob, sideColliderL);
    this.physics.add.collider(mob1, sideColliderL);
    this.physics.add.collider(mob2, sideColliderL);
    this.physics.add.collider(mob3, sideColliderL);

    this.physics.add.collider(mob, sideColliderR);
    this.physics.add.collider(mob1, sideColliderR);
    this.physics.add.collider(mob2, sideColliderR);
    this.physics.add.collider(mob3, sideColliderR);

    this.physics.add.collider(player, mush1);

    mush1.setPushable(false);

    this.physics.add.collider(player, mob, function (player, mob) {
        // console.log("lower player health bar");
        // cool I can set up my health bar here now.
    });

    // this.physics.add.collider(slash, mob);
    // this.physics.add.collider(player, slash);

    // Camera Work
    // follows the player at the center.
    // this.cameras.main.followOffset.set(200, 200); 

    // this.cameras.main.startFollow(player);
    // this.cameras.main.setZoom(1.5);

    // this.physics.add.overlap(slash, mob, collectStar, null, this);
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    mobHText = this.add.text(16, 45, 'mobH: 0', { fontSize: '32px', fill: '#000' });

    gameStartText = this.add.text(630, 300, 'Game Set', { fontSize: '64px', fill: '#000' });
    gameSetText = this.add.text(630, 300, 'Start!', { fontSize: '64px', fill: '#000' });
    gameSetText.setVisible(false);
    // console.log("started");
    this.physics.pause();
    gameSetEvent = this.time.delayedCall(3000, gameStart, [], this);
    gameStartEvent = this.time.delayedCall(5000, gameSet, [], this);
    clearMobTintEvent = this.time.delayedCall(100, mobClearTint, [], this);

    // slashEvent = this.time.delayedCall(1100, slashEventM, [], this);
    
    // timer = scene.time.addEvent({
    //     delay: 500,                // ms
    //     callback: callback,
    //     //args: [],
    //     callbackScope: thisArg,
    //     loop: true
    // });
    // var clock = new Clock(this);
}

function update ()
{
    // console.log(slashEvent.getElapsed());
    // if (slashEvent.getElapsed() > 1000)    {
        // slashEvent = this.time.delayedCall(100, slashEventM, [], this);
        // slashEvent.reset();
        // console.log('Thing done');
        // console.log(slashEvent.get)
    // }

    // gives us the parallax effect
    // console.log(gameSetEvent.getElapsed());
    cloudsWhite.tilePositionX += 0.5;
    cloudsWhiteSmall.tilePositionX += 0.25;

    // moves player left
    if (cursors.left.isDown)    {
        player.setVelocityX(-250);
        // player.setX(50);
        player.anims.play('left', true);
        player.flipX=true;
    } 
    // moves player right
    else if (cursors.right.isDown)   {
        player.setVelocityX(250);
        player.anims.play('right', true);
        player.flipX=false;
    }
    // moves player up
    if (cursors.up.isDown)
    {
        player.setVelocityY(-250);
        slash.destroy();

    }   else    {
        player.setVelocityY(0);
        slash.destroy();

    }
    // moves player down
    if (cursors.down.isDown)   {
        player.setVelocityY(250);
         slash.destroy();

    } 
    // do i need this? theres a lot I may not need in these update if statments.
    if (cursors.space.isDown)   {
        player.setVelocityX(0);
        player.setVelocityY(0);
        player.anims.play('space', true);
        slash.destroy();
    }

    // I use my weird logic to activate the slash animation, and havve a real hit box that is used.
    if (cursors.space.isDown && cursors.right.isDown && !cursors.left.isDown)   {
        player.setVelocityX(0);
        player.setVelocityY(0);
        // player.anims.play('space', true);
        slash = this.physics.add.sprite(player.x + 30, player.y, 'girlslashstatic');

        this.physics.add.overlap(slash, mob, mobHit, null, this);
        this.physics.add.overlap(slash, mob1, mobHit1, null, this);
        this.physics.add.overlap(slash, mob2, mobHit2, null, this);
        this.physics.add.overlap(slash, mob3, mobHit3, null, this);

        slash.setActive(false).setVisible(false);
        
        // gameSetEvent = this.time.delayedCall(200, slashEvent, [], this);
    }

    // mob tint triggers when they're not overlapping, so fix that.
    if (cursors.space.isDown && cursors.left.isDown)   {
        player.setVelocityX(0);
        player.setVelocityY(0);
        // player.anims.play('space', true);
        slash = this.physics.add.sprite(player.x - 30, player.y, 'girlslashstatic');
        this.physics.add.overlap(slash, mob, mobHit, null, this);
        this.physics.add.overlap(slash, mob1, mobHit1, null, this);
        this.physics.add.overlap(slash, mob2, mobHit2, null, this);
        this.physics.add.overlap(slash, mob3, mobHit3, null, this);

        slash.setActive(false).setVisible(false);
    }

    // Keeps mush girl in idle pose when no inputs are being pressed down.
    if (!cursors.down.isDown && !cursors.up.isDown && !cursors.left.isDown && !cursors.right.isDown)   {
        player.setVelocityX(0);
        player.setVelocityY(0);
        player.anims.play('turn');
        slash.destroy();
    }
    // Clears the mobs tint when out of the hitbox.
    // clearMobTintEvent = this.time.delayedCall(100, mobClearTint, [], this);

    // this.physics.accelerateToObject(mob1, player, 100, 100, 100);
    if (mobH < 1000)    {
        this.physics.accelerateToObject(mob, player, 100, 100, 100);
    }
    if (mob1H < 1000)    {
        this.physics.accelerateToObject(mob1, player, 100, 100, 100);

    }
    if (mob2H < 1000)    {
        this.physics.accelerateToObject(mob2, player, 100, 100, 100);

    }
    if (mob3H < 1000)    {
        this.physics.accelerateToObject(mob3, player, 100, 100, 100);

    }
     
    // I need to make each mob independant of each other.
    if (mobH >= 1000)  {
        mob.setActive(false).setVisible(false);
        mob.destroy();
    }
    if (mob1H >= 1000)  {
        mob1.setActive(false).setVisible(false);
        mob1.destroy();
    }
    if (mob2H >= 1000)  {
        mob2.setActive(false).setVisible(false);
        mob2.destroy();
    }
    if (mob3H >= 1000)  {
        mob3.setActive(false).setVisible(false);
        mob3.destroy();
    }

    // Victory if statment
    if (score == 4000)  {
        this.physics.pause();
        var gameOverText = this.add.text(630, 300, 'VICTORY!', { fontSize: '64px', fill: '#000' });
        gameOver = true;
    }
}

function slashEventM()   {
    
    // player.setVelocityX(0);
    // player.setVelocityY(0);
    // player.anims.play('space', true);
    // slash = this.physics.add.sprite(player.x + 30, player.y, 'girlslashidle');

    // this.physics.add.overlap(slash, mob, mobHit, null, this);
    // this.physics.add.overlap(slash, mob1, mobHit1, null, this);
    // this.physics.add.overlap(slash, mob2, mobHit2, null, this);
    // this.physics.add.overlap(slash, mob3, mobHit3, null, this);

    // slash.setActive(false).setVisible(false);
}

function mobHit (slash, mob)
{
    score += 10;
    scoreText.setText('Score: ' + score);
    mobHText.setText('mobH: ' + mobH);
    mobH += 10;
    mobSetTintEvent = this.time.delayedCall(0, mobSetTint, [mob], this);
    clearMobTintEvent = this.time.delayedCall(1000, mobClearTint, [], this);

    staggerMobEvent = this.time.delayedCall(0, staggerMob, [mob], this);
}

function mobHit1 (slash, mob)
{
    score += 10;
    scoreText.setText('Score: ' + score);
    mobHText.setText('mobH: ' + mobH);
    mob1H += 10;
    mobSetTintEvent = this.time.delayedCall(0, mobSetTint, [mob], this);
    clearMobTintEvent = this.time.delayedCall(1000, mobClearTint, [], this);

    staggerMobEvent1 = this.time.delayedCall(0, staggerMob1, [mob], this);
}

function mobHit2 (slash, mob)
{
    score += 10;
    scoreText.setText('Score: ' + score);
    mobHText.setText('mobH: ' + mobH);
    mob2H += 10;
    mobSetTintEvent = this.time.delayedCall(0, mobSetTint, [mob], this);
    clearMobTintEvent = this.time.delayedCall(1000, mobClearTint, [], this);

    staggerMobEvent = this.time.delayedCall(0, staggerMob2, [mob], this);
}

function mobHit3 (slash, mob)
{
    score += 10;
    scoreText.setText('Score: ' + score);
    mobHText.setText('mobH: ' + mobH);
    mob3H += 10;
    
    mobSetTintEvent = this.time.delayedCall(0, mobSetTint, [mob], this);
    clearMobTintEvent = this.time.delayedCall(1000, mobClearTint, [], this);

    staggerMobEvent = this.time.delayedCall(0, staggerMob3, [mob], this);
}

function mobClearTint()    {
    mob.clearTint();
    mob1.clearTint();
    mob2.clearTint();
    mob3.clearTint();
}

function mobSetTint(mob)   {
    mob.setTint(0xff0000);
}

function gameStart()    {
    this.physics.resume();
    gameStartText.setVisible(false);
    gameSetText.setVisible(true);
}

function gameSet()  {
    gameSetText.setVisible(false);
}

function staggerMob(mob)   {
    if (mobH < 1000)    {
        mob.setVelocityX(0);
        mob.setVelocityY(0);
    }

}


function staggerMob1(mob)   {
    if (mob1H < 1000)    {
        mob.setVelocityX(0);
        mob.setVelocityY(0);
    }

}

function staggerMob2(mob)   {
    if (mob2H < 1000)    {
        mob.setVelocityX(0);
        mob.setVelocityY(0);
    }

}

function staggerMob3(mob)   {
    if (mob3H < 1000)    {
        mob.setVelocityX(0);
        mob.setVelocityY(0);
    }

}