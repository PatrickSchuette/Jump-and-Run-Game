class World {
    character;
    level = START;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    throwableObjects = [];
    statusPlayMode;

    constructor(canvas, keyboard) {

        const selected = localStorage.getItem("selectedCharacter");
        console.log(selected);

        switch (selected) { 
            case "knight": this.character = new CharacterKnight(); break; 
            case "mage": this.character = new CharacterMage(); break; 
            case "rouge": this.character = new CharacterRogue(); break; 
            default: this.character = new CharacterKnight(); 
        }

        // ⬇️ Statusbars ERST JETZT erzeugen!
        this.statusbarHealth = new HealthStatus();
        this.statusbarCoin = new CoinStatus(this.character);
        this.statusbarBottle = new BottleStatus(this.character);

        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.statusPlayMode = this.level.playMode;

        this.setWorld();
        this.draw();
        this.run();
    }



    setWorld() {
        this.character.world = this;
    }


    setLevel(newLevel) {
        this.level = newLevel;
        this.statusPlayMode = newLevel.playMode;
        this.character.hadFirstContact = this.statusPlayMode;

        this.level.enemies.forEach(enemy => enemy.world = this);
    }


    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);

        if (this.statusPlayMode) {
            this.ctx.translate(-this.camera_x, 0);

            this.addToMap(this.statusbarHealth);
            this.addToMap(this.statusbarCoin);
            this.addToMap(this.statusbarBottle);

            const boss = this.endboss();
            if (boss && boss.hadFirstContact) {
                if (!this.statusbarEndboss) {
                    this.statusbarEndboss = new EndbossStatus(boss);
                }
                this.addToMap(this.statusbarEndboss);
            }


            this.ctx.translate(this.camera_x, 0);

            this.addToMap(this.character);
            this.addObjectsToMap(this.level.enemies);
            this.addObjectsToMap(this.level.collectables);
            this.addObjectsToMap(this.throwableObjects);
        }
        this.ctx.translate(-this.camera_x, 0)


        //Draw() wird immerwieder aufgerufen
        self = this;
        requestAnimationFrame(function () {
            self.draw()
        });
    }

    addObjectsToMap(objects) {
        objects.forEach(obj => {
            this.addToMap(obj);
        });
    }

    addToMap(mo) {
        if (mo.otherDirection) this.flipImage(mo);

        mo.draw(this.ctx);
        //  mo.drawFrame(this.ctx);

        if (mo.otherDirection) this.flipImageBack(mo);
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

    run() {
        setInterval(() => {
            this.checkCollisionCollactable();
            this.checkCollisionEnemy();
            this.checkThrowObjects();
        }, 200);

        setInterval(() => { this.checkCollisionThrowable(); }, 25);
    }

    checkThrowObjects() {
        if (this.keyboard.D) {
            if (this.character.collectableObjects.bottle > 0) {
                let bottle = new ThrowableObject(this.character.x + 300, this.character.y + 350, this.character.otherDirection);
                bottle.parentArray = this.throwableObjects;
                this.throwableObjects.push(bottle);
                this.character.collectableObjects.bottle--;
                this.statusbarBottle.setPercentage(this.character.collectableObjects.bottle);
            }
        }
    }

    checkCollisionEnemy() {
        this.level.enemies.forEach((enemy) => {
            this.checkDeadEndboss(enemy)
            const col = this.character.isColliding(enemy);

            if (col.collision) {
                if (this.keyboard.ATTAC && !enemy.isDead) {
                    enemy.isDead = true;
                    enemy.hitEnergy = 0;
                }

                else if (!enemy.isDead) {
                    this.character.hit(enemy.hitEnergy, enemy.isDead);
                    this.statusbarHealth.setPercentage(this.character.energy);
                }
            }

            enemy.checkFirstContact(this.character);
        });
    }

    checkDeadEndboss(enemy) {
        if (!(enemy instanceof Endboss)) return;
        if (enemy.isDead) this.setLevel(WIN);
    }

    checkCollisionThrowable() {
        this.throwableObjects.forEach((bottle) => {

            this.level.enemies.forEach((enemy) => {

                if (bottle.isColliding(enemy).collision) {
                    enemy.hit(bottle.hitEnergy, enemy.isDead);
                    bottle.removeFromWorld();

                    if (enemy.isDead) {
                        enemy.isDead = true;
                        enemy.hitEnergy = 0;
                    }
                }

                enemy.checkFirstContact(bottle);
            });
        });
    }

    handleCollect(obj, type, max, statusbar) {
        if (this.character.collectableObjects[type] < max) {
            this.character.collectableObjects[type]++;
            statusbar.setPercentage(this.character.collectableObjects[type]);
            obj.removeFromWorld();
        }
    }

    checkCollisionCollactable() {
        this.level.collectables.forEach((obj) => {
            if (this.character.isColliding(obj).collision) {
                if (obj instanceof CollectableBottle) this.handleCollect(obj, "bottle", this.character.collectableObjects.maxBottle, this.statusbarBottle);
                if (obj instanceof CollectableCoin) this.handleCollect(obj, "coin", this.character.collectableObjects.maxCoin, this.statusbarCoin);
            }
        });
    }

    endboss() {
        return this.level.enemies.find(e => e instanceof Endboss);
    }
}