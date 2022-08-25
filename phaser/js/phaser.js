
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

var player, mob;
var x;
// var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;

// background vars
var background, mainBack, multiBack;
var cloudsWhite, cloudsWhiteSmall;
var playerGround;

// hitbox vars
var slash;
var timedEvent;


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
    this.load.image('forestground', "assets/forest_ground.png");
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('girl', 'assets/girlwalk.png', { frameWidth: 67.5, frameHeight: 122 });
    this.load.spritesheet('girlidle', 'assets/mush_girl_idle.png', { frameWidth: 67.5, frameHeight: 122 });
    this.load.spritesheet('girlslash', 'assets/Slash_0x.png', { frameWidth: 240, frameHeight: 240 });
    this.load.spritesheet('girl2', 'assets/mush_walk.png', { frameWidth: 240, frameHeight: 240 });
    this.load.spritesheet('girlslashidle', 'assets/slash_still2.png', { frameWidth: 240, frameHeight: 240 });

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
    var platforms = this.physics.add.staticGroup();
    platforms.create(800, 870, 'ground').setScale(5, 30).refreshBody();

    // playerGround = this.physics.add.staticGroup();
    // playerGround.create(800, 650, 'forestground').setScale(2,1.5).refreshBody();

    // the actual colliders seperating the player from the sky, and the edge of the screen.
    var groundCollider = this.physics.add.staticGroup();
    // this isn't actually necessary, it is acting as a temporary visual cue.
    groundCollider.create(1, 1056).setScale(100, 10).refreshBody();
    // groundCollider.create(1, 400).setScale(100, 1).refreshBody();
    
    // The player and its settings
    // player = this.physics.add.sprite(600, 1050, 'dude');    // creates him near the bottom
    player = this.physics.add.sprite(600, 550, 'girlidle');    // creates him near the top
    mob = this.physics.add.sprite(1200, 350, 'dude');
    slash = this.physics.add.sprite(8000, 8000, 'girlslashidle');

    //  Player physics properties. Give the little guy a slight bounce.
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('girl2', { start: 1, end: 8 }),
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
        frames: this.anims.generateFrameNumbers('girl2', { start: 1, end: 8 }),
        frameRate: 12,
        repeat: -1
    });

    this.anims.create({
        key: 'space',
        frames: this.anims.generateFrameNumbers('girlslash', { start: 1, end: 2 }),
        frameRate: .5,
        repeat: -1
    });

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(player, groundCollider);
    this.physics.add.collider(player, mob);
    this.physics.add.collider(mob, groundCollider);
    // this.physics.add.collider(slash, mob);
    // this.physics.add.collider(player, slash);

    // Camera Work
    // follows the player at the center.
    this.cameras.main.startFollow(player);
    // this.cameras.main.followOffset.set(200, 200);
    this.cameras.main.setZoom(1.5);


    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    // this.physics.add.overlap(slash, mob, collectStar, null, this);
    timedEvent = this.time.delayedCall(1000, destroySlash, [], this);
}

function update ()
{
    // moves player left
    if (cursors.left.isDown)    {
        player.setVelocityX(-250);
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
    // FIXED IT!
    if (cursors.space.isDown && cursors.right.isDown && !cursors.left.isDown)   {
        player.setVelocityX(0);
        player.setVelocityY(0);
        player.anims.play('space', true);
        slash = this.physics.add.sprite(player.x + 30, player.y, 'girlslashidle');
        mob.setTint(0xff0000);

        this.physics.add.overlap(slash, mob, collectStar, null, this);
        // mob.clearTint();
        slash.setActive(false).setVisible(false);
    }
    if (cursors.space.isDown && cursors.left.isDown)   {
        player.setVelocityX(0);
        player.setVelocityY(0);
        player.anims.play('space', true);
        slash = this.physics.add.sprite(player.x - 30, player.y, 'girlslashidle');
        mob.setTint(0xff0000);
        // mob.clearTint();

        this.physics.add.overlap(slash, mob, collectStar, null, this);
        slash.setActive(false).setVisible(false);
    }

    // keeps player stationary, and in their idle position.
    if (!cursors.down.isDown && !cursors.up.isDown && !cursors.left.isDown && !cursors.right.isDown)   {
        player.setVelocityX(0);
        player.setVelocityY(0);
        player.anims.play('turn');
        slash.destroy();
    }

    if (score == 1000)  {
        this.physics.pause();
        var gameOverText = this.add.text(600, 450, 'VICTORY!', { fontSize: '64px', fill: '#000' });
        gameOver = true;
    }

    // gives us the parallax effect
    cloudsWhite.tilePositionX += 0.5;
    cloudsWhiteSmall.tilePositionX += 0.25;

    this.physics.accelerateToObject(mob, player, 75, 75, 75);
}

function collectStar (slash, mob)
{
    //  Add and update the score
    score += 10;
    scoreText.setText('Score: ' + score);
    mob.clearTint();
}

function destroySlash()   {
    console.log("destroyed");
    slash.destroy();
}

function gameOver() {
    if (score == 5000)  {
        this.physics.pause();
        gameOver = true;
    }
}