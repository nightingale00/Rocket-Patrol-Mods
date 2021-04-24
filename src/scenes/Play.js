class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.image('rocket', './assets/rocket2.png');
        this.load.image('spaceship', './assets/spaceship2.png');
        this.load.image('galaxy', './assets/galaxy2.png');
        this.load.spritesheet('explosion', './assets/explosion2.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {
        this.galaxy = this.add.tileSprite(0, 0, 640, 480, 'galaxy').setOrigin(0, 0);

        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);

        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);

        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0);
        

        //keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        mouse = this.input;

     
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        this.fire = 0; 
        
        let fireConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#FFD589',
            color: '#843605',
            align: 'center',
            padding: {
                top: 5, 
                bottom: 5, 
            },
            fixedWidth: 100
        }
        this.fire = this.add.text(250, 54, "FIRE", fireConfig).setOrigin(0,0);

        this.p1Score = 0;

        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }

        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
        
        this.gameClock = game.settings.gameTimer;
        let gameClockConfig =
        {
            fontFamily: "Courier",
            fontSize: "20px",
            backgroundColor: "#f3b141",
            color: "#843605",
            align: "left",
            padding: {top: 5, bottom: 5},
            fixedWidth: 140
        };

        this.timeLeft = this.add.text
        (
            400,
            54, 
            "Timer: " + this.formatTime(this.gameClock), 
            gameClockConfig 
        );
      
        this.timedEvent = this.time.addEvent
        (
            {
                delay: 1000,
                callback: () =>
                {
                    this.gameClock -= 1000; 
                    this.timeLeft.text = "Timer: " +
                        this.formatTime(this.gameClock);
                },
                scope: this,
                loop: true
            }
        );

        this.gameOver = false;

        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← to Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

        game.music.play()
    }

    update() {
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        this.galaxy.tilePositionX -= 4;  

        if(!this.gameOver) {
            this.p1Rocket.update();             
            this.ship01.update();              
            this.ship02.update();
            this.ship03.update();
        }
          
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
    
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);

        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
    }

    checkCollision(rocket, ship) {
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }
    
    shipExplode(ship) {
        ship.alpha = 0;                         
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             
        boom.on('animationcomplete', () => {    
            ship.reset();                        
            ship.alpha = 1;                       
            boom.destroy();                       
        });
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score; 
        
        this.sound.play('sfx_explosion');
    }

      formatTime(ms)
      {
          let s = ms/1000;
          let min = Math.floor(s/60);
          let seconds = s%60;
          seconds = seconds.toString().padStart(2, "0");
          return `${min}:${seconds}`;
      }
}