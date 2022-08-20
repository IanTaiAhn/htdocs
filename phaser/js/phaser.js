
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

    //  The platforms group contains the ground and the 2 ledges we can jump on
    var platforms = this.physics.add.staticGroup();

    //  Here we create the ground.

    // green rectangle, will replace with actual ground, and assests, and such.
    platforms.create(800, 870, 'ground').setScale(4, 30).refreshBody();

    var groundCollider = this.physics.add.staticGroup();
    groundCollider.create(100, 1056).setScale(100, 10).refreshBody();

    //  Now let's create some ledges
    // platforms.create(600, 400, 'ground');
    // platforms.create(50, 250, 'ground');
    // platforms.create(150, 420, 'ground');

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

    //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 130 }
    });

    stars.children.iterate(function (child) {

        //  Give each star a slightly different bounce
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    bombs = this.physics.add.group();

    //  The score
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //  Collide the player and the stars with the platforms
    this.physics.add.collider(player, groundCollider);
    this.physics.add.collider(stars, groundCollider);
    this.physics.add.collider(bombs, groundCollider);
    // this.physics.add.collider(girlPlayer, platforms);
    // this.physics.add.collider(girlPlayerR, platforms);
    

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.physics.add.overlap(player, stars, collectStar, null, this);

    this.physics.add.collider(player, bombs, hitBomb, null, this);
}

function update ()
{
    if (gameOver)
    {
        return;
    }




    // move left
    if (cursors.left.isDown)    {
        player.setVelocityX(-300);
        player.anims.play('left', true);
        player.flipX=true;
    } 
    else if (cursors.right.isDown)   {
        player.setVelocityX(300);
        player.anims.play('right', true);
        player.flipX=false;
    }
    else if (cursors.up.isDown)
    {
        player.setVelocityY(-330);
        player.anims.play('right', true);
        player.flipX=false;
    }  
    else if (cursors.down.isDown)   {
        player.setVelocityY(300);
        player.anims.play('left', true);
        player.flipX=true;
    } 
    else    {
        player.setVelocityX(0);
        player.setVelocityY(0);
        player.anims.play('turn');
    }


    



}

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

function hitBomb (player, bomb)
{
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;
}