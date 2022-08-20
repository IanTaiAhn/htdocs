import MainScene from "./MainScene.js";

const config = {
    type: Phaser.AUTO,
    width: 1600,
    height: 900,
    backgroundColor: '#333333',
    parent: 'MushGame',
    scene:[MainScene],
    physics: {
        default: "matter"
      },
      // Install the scene plugin
      plugins: {
        scene: [
          {
            plugin: PhaserMatterCollisionPlugin, // The plugin class
            key: "matterCollision", // Where to store in Scene.Systems, e.g. scene.sys.matterCollision
            mapping: "matterCollision" // Where to store in the Scene, e.g. scene.matterCollision
          }
        ]
      }
    };

new Phaser.Game(config);