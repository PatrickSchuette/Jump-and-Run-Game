class World {
    character = new CharacterKnight();
    level = START;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    statusbarHealth = new HealthStatus();
    statusbarCoin = new CoinStatus(this.character);
    statusbarBottle = new BottleStatus(this.character);
    throwableObjects = [];
    statusPlayMode;

    constructor(canvas, keyboard) {
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
            this.ctx.translate(this.camera_x, 0);

            this.addObjectsToMap(this.throwableObjects);

            this.addToMap(this.character);
            this.addObjectsToMap(this.level.enemies);
            this.addObjectsToMap(this.level.collectables);
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
        if (mo.otherDirection) {
            this.flipImage(mo);
        }

        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
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


    checkCollisionThrowable() {
        this.throwableObjects.forEach((bottle) => {

            this.level.enemies.forEach((enemy) => {

                if (bottle.isColliding(enemy).collision) {

                    // Gegner Schaden zufügen
                    enemy.hit(bottle.hitEnergy, enemy.isDead);

                    // Bottle entfernen
                    bottle.removeFromWorld();

                    // Gegner ggf. sterben lassen
                    if (enemy.isDead) {
                        enemy.isDead = true;
                        enemy.hitEnergy = 0;
                    }
                }

                enemy.checkFirstContact(bottle);
            });
        });
    }



    checkCollisionCollactable() {
        this.level.collectables.forEach((obj) => {
            if (this.character.isColliding(obj).collision) {
                if (obj instanceof CollectableBottle) {
                    if (this.character.collectableObjects.bottle < this.character.collectableObjects.maxBottle) {
                        this.character.collectableObjects.bottle++;
                        this.statusbarBottle.setPercentage(this.character.collectableObjects.bottle);
                        obj.removeFromWorld();
                    }
                }

                if (obj instanceof CollectableCoin) {
                    if (this.character.collectableObjects.coin < this.character.collectableObjects.maxCoin) {
                        this.character.collectableObjects.coin++;
                        this.statusbarCoin.setPercentage(this.character.collectableObjects.coin);
                        obj.removeFromWorld();
                    }
                }
            }
        });
    }

}