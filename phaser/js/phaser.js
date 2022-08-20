
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

var player;
var stars;
var bombs;
// var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('girl', 'assets/girlwalk.png', { frameWidth: 67.5, frameHeight: 122 });

}

function create ()
{
    this.cameras.main.setBounds(0,0, 3200, 1800);
    this.physics.world.setBounds(0,0, 1600, 900);

    //  A simple background for our game
    var background = this.add.image(800, 100, 'sky');
    background.setScale(2, 1);

    // green rectangle, will replace with actual ground, and assests, and such.
    var platforms = this.physics.add.staticGroup();
    platforms.create(800, 870, 'ground').setScale(5, 30).refreshBody();

    // the actual colliders seperating the player from the sky, and the edge of the screen.
    var groundCollider = this.physics.add.staticGroup();
    groundCollider.create(1, 1056).setScale(100, 10).refreshBody();
    groundCollider.create(1, 400).setScale(100, 1).refreshBody();
    
    // The player and its settings
    player = this.physics.add.sprite(600, 1050, 'dude');

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
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
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

    // Camera Work
    // follows the player at the center.
    this.cameras.main.startFollow(player);
    // this.cameras.main.followOffset.set(200, 200);
    this.cameras.main.setZoom(1.5);


    // interesting bit of code.. WIll study it more.
    // I think this is used for generating mobs.
    // for (var i=0; i < 10; i++)
    // {
    //     game.add.sprite(game.world.randomX, game.world.randomY, 'baddie');
    // }

}

function update ()
{
    // TODO Bug that doesn't allow player to move right if left button is pressed down.
    // Bug also is prevalent in their example I found out, so this just may be how it is.
    // Probably can clean up if statements to be more readable as well.
    // moves player left
    // const cam = this.cameras.main;
    if (cursors.left.isDown)    {
        player.setVelocityX(-200);
        player.anims.play('left', true);
        player.flipX=true;
    } 
    // moves player right
    else if (cursors.right.isDown)   {
        player.setVelocityX(200);
        player.anims.play('right', true);
        player.flipX=false;
    }
    // moves player up
    if (cursors.up.isDown)
    {
        player.setVelocityY(-200);
        // player.anims.play('right', true);
        // player.flipX=false;
    }   else    {
        player.setVelocityY(0);
    }
    // moves player down
    if (cursors.down.isDown)   {
        player.setVelocityY(200);
        // player.anims.play('left', true);
        // player.flipX=true;
    } 

    // keeps player stationary, and in their idle position.
    if (!cursors.down.isDown && !cursors.up.isDown && !cursors.left.isDown && !cursors.right.isDown)   {
        player.setVelocityX(0);
        player.setVelocityY(0);
        player.anims.play('turn');
    }
}


