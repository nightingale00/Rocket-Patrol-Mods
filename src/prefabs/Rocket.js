class Rocket extends Phaser.GameObjects.Sprite
{
    constructor(scene, x, y, texture, frame)
    {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);

        this.isFiring = false;
        this.sfxRocket = scene.sound.add("sfx_rocket"); // add rocket sfx
    }

    create()
    {
        
    }

    update()
    {
        mouse.on
        (
            "pointermove", 
            (pointer) => 
            {
                if(!this.isFiring)
                {
                    this.x = Phaser.Math.Clamp(pointer.x, 47, 578);
                }
            },
            this
        );
       
        if(mouse.activePointer.leftButtonDown() && !this.isFiring) 
        {
          this.isFiring = true;
          this.sfxRocket.play(); // play the rocket sfx
        }
        if(this.isFiring && this.y >= 108) this.y -= 2;
        if(this.y <= 108)
        {
            this.isFiring = false;
            this.y = 431;
        }
    }

    reset()
    {
        this.isFiring = false;
        this.y = 431;
    }
}