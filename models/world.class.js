class World {
    character;
    level = start();
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
        this.level.world = this;
        this.level.enemies.forEach(enemy => enemy.world = this);
    }



    setLevel(newLevel) {
        this.level = newLevel;
        this.statusPlayMode = newLevel.playMode;

        this.character.hadFirstContact = this.statusPlayMode;

        this.level.enemies.forEach(enemy => enemy.world = this);

        this.character.x = 105;
    }




    draw() {
        if (this.animationStopped) return;
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
        mo.drawFrame(this.ctx);

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
        IntervalManager.setInterval(() => {
            this.checkCollisionCollactable();
            this.checkCollisionEnemy();
            this.checkThrowObjects();
        }, 200);

        IntervalManager.setInterval(() => { this.checkCollisionThrowable(); }, 25);
    }

    stop() {
        this.animationStopped = true;
        IntervalManager.clearAll();
    }


    checkThrowObjects() {
        if (this.keyboard.D) {
            if (this.character.collectableObjects.bottle > 0) {

                // Hitbox-Breite und -Höhe
                const hitboxWidth = this.character.width - this.character.offset.left - this.character.offset.right;
                const hitboxHeight = this.character.height - this.character.offset.top - this.character.offset.bottom;

                // Mitte der Hitbox
                const centerX = this.character.x + this.character.offset.left + hitboxWidth / 2;
                const centerY = this.character.y + this.character.offset.top + hitboxHeight / 2;

                // Wurfpunkt abhängig von Blickrichtung
                const throwX = centerX + (this.character.otherDirection ? -40 : 40);
                const throwY = centerY;

                // Flasche erzeugen
                let bottle = new ThrowableObject(throwX, throwY, this.character.otherDirection);
                bottle.parentArray = this.throwableObjects;
                this.throwableObjects.push(bottle);

                // Verbrauch
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
                if (this.keyboard.ATTAC && !enemy.dead) {
                    enemy.hit(this.character.hitEnergy, enemy.dead);
                }

                else if (!enemy.dead) {
                    this.character.hit(enemy.hitEnergy, enemy.dead);
                    this.statusbarHealth.setPercentage(this.character.energy);
                }
            }

            enemy.checkFirstContact(this);
        });
    }

    checkDeadEndboss(enemy) {
        if (!(enemy instanceof Endboss)) return;
        if (enemy.dead) this.setLevel(win());
    }

    checkCollisionThrowable() {
        this.throwableObjects.forEach((bottle) => {

            this.level.enemies.forEach((enemy) => {

                if (bottle.isColliding(enemy).collision) {
                    enemy.hit(bottle.hitEnergy, enemy.dead);
                    if (enemy.energy <= 0) {
                        enemy.dead = true;
                    }
                    bottle.removeFromWorld();
                }

                enemy.checkFirstContact(this);
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

    resume() {
        this.animationStopped = false;
        this.draw();
        this.run();
    }

}