
var config = {
    type: Phaser.AUTO,
    width: 1600,
    height: 900,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
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
    
}

function create ()
{
    this.cameras.main.setBounds(0,0, 3200, 900);
    // sets hard world bounds.. Probably better to use this instead of colliders to seperate the player from other things.
    this.physics.world.setBounds(0,0, 3200, 900);

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

    //  Player physics properties. Give the little guy a slight bounce.
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('girl', { start: 1, end: 3 }),
        frameRate: 7,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'girlidle' } ],
        // frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('girl', { start: 1, end: 3 }),
        frameRate: 7,
        repeat: -1
    });

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(player, groundCollider);
    this.physics.add.collider(player, mob);

    // Camera Work
    // follows the player at the center.
    // this.cameras.main.startFollow(player);
    // this.cameras.main.followOffset.set(200, 200);
    // this.cameras.main.setZoom(1.5);


    // interesting bit of code.. WIll study it more.
    // I think this is used for generating mobs.
    // for (var i=0; i < 10; i++)
    // {
    //     game.add.sprite(game.world.randomX, game.world.randomY, 'baddie');
    // }
    // mob.setVelocityX(100);

    // var ty = player.y
    // var tx = player.x

    // // enemy's x, y
    // var x = mob.x
    // var y = mob.y

    // var rotation = Phaser.Math.Angle.Between(x, y, tx, ty)

    // var curve

    // var rotation = Phaser.Math.Angle.Between(x, y, tx, ty)

    // var points = [ player.x, player.y, mob.x, mob.y];

    // var curve = new Phaser.Curves.Spline(points);

    // var graphics = this.add.graphics();

    // graphics.lineStyle(1, 0xffffff, 1);

    // curve.draw(graphics, 64);

    // graphics.fillStyle(0x00ff00, 1);

    // var mobFollow = this.add.follower(curve, player.x, player.y, 'dude');
    // mobFollow.startFollow(4000);

}

function update ()
{
    // TODO Bug that doesn't allow player to move right if left button is pressed down.
    // Bug also is prevalent in their example I found out, so this just may be how it is.
    // Probably can clean up if statements to be more readable as well.
    // moves player left
    // const cam = this.cameras.main;
    if (cursors.left.isDown)    {
        player.setVelocityX(-300);
        player.anims.play('left', true);
        player.flipX=true;
    } 
    // moves player right
    else if (cursors.right.isDown)   {
        player.setVelocityX(300);
        player.anims.play('right', true);
        player.flipX=false;
    }
    // moves player up
    if (cursors.up.isDown)
    {
        player.setVelocityY(-300);
        // player.anims.play('right', true);
        // player.flipX=false;
    }   else    {
        player.setVelocityY(0);
    }
    // moves player down
    if (cursors.down.isDown)   {
        player.setVelocityY(300);
        // player.anims.play('left', true);
        // player.flipX=true;
    } 

    // keeps player stationary, and in their idle position.
    if (!cursors.down.isDown && !cursors.up.isDown && !cursors.left.isDown && !cursors.right.isDown)   {
        player.setVelocityX(0);
        player.setVelocityY(0);
        player.anims.play('turn');
    }

    // gives us the parallax effect
    cloudsWhite.tilePositionX += 0.5;
    cloudsWhiteSmall.tilePositionX += 0.25;

    // console.log('working');
    // console.log(player.x);

    // var ty = player.y
    // var tx = player.x

    // // enemy's x, y
    // var x = mob.x
    // var y = mob.y
/*
    var rotation = Phaser.Math.Angle.Between(x, y, tx, ty)

    var points = [ player.x, player.y, mob.x, mob.y];

    var curve = new Phaser.Curves.Spline(points);

    // var graphics = this.add.graphics();

    // graphics.lineStyle(1, 0xffffff, 1);

    // curve.draw(graphics, 64);

    // graphics.fillStyle(0x00ff00, 1);

    var mobFollow = this.add.follower(curve, player.x, player.y, 'dude');
    mobFollow.startFollow(4000);
*/
    // mob.setX(player.x);
    // mob.setY(player.y);

    // mob.rotation = rotation;
    // mob.setAngle(rotation);
    // mob.setRotation(rotation);
    this.physics.accelerateToObject(mob, player, 50, 50, 50);

}


