
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
    //  A simple background for our game
    var background = this.add.image(800, 100, 'sky');
    background.setScale(2, 1);

    // green rectangle, will replace with actual ground, and assests, and such.
    var platforms = this.physics.add.staticGroup();
    platforms.create(800, 870, 'ground').setScale(4, 30).refreshBody();

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


    //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    // stars = this.physics.add.group({
    //     key: 'star',
    //     repeat: 11,
    //     setXY: { x: 12, y: 0, stepX: 130 }
    // });
    
    // stars.children.iterate(function (child) {
    // });

    // bombs = this.physics.add.group();

    //  The score
    // scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //  Collide the player and the stars with the platforms
    // this.physics.add.collider(bombs, groundCollider);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    // this.physics.add.overlap(player, stars, collectStar, null, this);
    // this.physics.add.collider(player, bombs, hitBomb, null, this);
}

function update ()
{
    // if (gameOver)
    // {
    //     return;
    // }

    // TODO Bug that doesn't allow player to move right if left button is pressed down.
    // moves player left
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

/*
function collectStar (player, star)
{
    star.disableBody(true, true);

    //  Add and update the score
    score += 10;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0)
    {
        //  A new batch of stars to collect
        stars.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;

    }
}
*/

/*
function hitBomb (player, bomb)
{
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;
}
*/