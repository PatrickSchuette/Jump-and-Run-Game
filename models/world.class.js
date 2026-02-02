class World {
    character;
    level = start();
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    throwableObjects = [];
    statusPlayMode;
    statusShowFrame;
    intervals;

    /**
     * Creates a new game world instance. Initializes character, canvas, level, UI, intervals and rendering loop.
     * @param {HTMLCanvasElement} canvas - Canvas used for rendering.
     * @param {Keyboard} keyboard - Keyboard handler instance.
     */
    constructor(canvas, keyboard) {
        this.character = this.initCharacter();
        this.initCanvas(canvas);
        this.initStatusBars();
        this.ensureDDrawingFrame();
        this.level = start();
        this.initWorldState(keyboard);
        this.updateMusic();
        this.draw();
        this.run();
        this.intervals = IntervalManager.intervals;
    }

    /** Creates the player character based on the selected character stored in localStorage. Defaults to the knight if no valid selection exists. */
    initCharacter() {
        const selected = localStorage.getItem("selectedCharacter");

        switch (selected) {
            case "knight": return new CharacterKnight();
            case "mage": return new CharacterMage();
            case "rouge": return new CharacterRogue();
            default: return new CharacterKnight();
        }
    }

    /** Initializes all status bars for health, coins, bottles and endboss. */
    initStatusBars() {
        this.statusbarHealth = new HealthStatus();
        this.statusbarCoin = new CoinStatus(this.character);
        this.statusbarBottle = new BottleStatus(this.character);
    }

    /**
     * Initializes canvas and rendering context.
     * @param {HTMLCanvasElement} canvas - The canvas element used for rendering.
     */
    initCanvas(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    /**
     * Initializes world state such as keyboard input, play mode and world references for character and enemies.
     * @param {Keyboard} keyboard - The keyboard handler instance.
     */
    initWorldState(keyboard) {
        this.keyboard = keyboard;
        this.statusPlayMode = this.level.playMode;
        this.setWorld();
    }

    /** Assigns the world reference to the character, level and all enemies, enabling them to access world‑level properties such as camera and collisions.    */
    setWorld() {
        this.character.world = this;
        this.level.world = this;
        this.level.enemies.forEach(enemy => enemy.world = this);
    }

    /**
     * Replaces the current level with a new one, resets world intervals, updates play mode and repositions the character.
     * @param {Level} newLevel - The new level instance.
     */
    setLevel(newLevel) {
        IntervalManager.clearByOwner("world");
        this.run();
        this.level = newLevel;
        this.statusPlayMode = newLevel.playMode;
        this.character.hadFirstContact = this.statusPlayMode;
        this.level.enemies.forEach(enemy => enemy.world = this);
        this.character.x = 105;
        this.updateMusic();
    }

    /**Draws all background-related objects such as terrain and clouds. */
    drawBackground() {
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
    }

    /**Draws all status bars including player health, coins, bottles and the endboss bar if applicable.*/
    drawUI() {
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
    }

    /** Draws all active world objects including the player, enemies, collectables and throwable objects. */
    drawWorldObjects() {
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.collectables);
        this.addObjectsToMap(this.throwableObjects);
    }

    /** Resets the canvas translation to its original state.*/
    resetCamera() {
        this.ctx.translate(-this.camera_x, 0);
    }

    /** Main rendering loop of the game world. Handles camera movement, background rendering, UI rendering and world object drawing. Uses requestAnimationFrame for continuous rendering. */
    draw() {
        if (this.animationStopped) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.drawBackground();
        if (this.statusPlayMode) {
            this.ctx.translate(-this.camera_x, 0);
            this.drawUI();
            this.ctx.translate(this.camera_x, 0);
            this.drawWorldObjects();
        }
        this.resetCamera();
        requestAnimationFrame(() => this.draw());
    }

    /**
     * Draws an array of drawable objects onto the canvas.
     * @param {DrawableObject[]} objects - The objects to render.
     */
    addObjectsToMap(objects) {
        objects.forEach(obj => {
            this.addToMap(obj);
        });
    }

    /**
     * Draws a single drawable object onto the canvas. Handles horizontal flipping and optional hitbox rendering.
     * @param {DrawableObject} mo - The object to draw.
     */
    addToMap(mo) {
        if (mo.otherDirection) this.flipImage(mo);
        mo.draw(this.ctx);
        if (this.statusShowFrame) mo.drawFrame(this.ctx);
        if (mo.otherDirection) this.flipImageBack(mo);
    }

    /**
     * Flips the rendering context horizontally for mirrored drawing.
     * @param {DrawableObject} mo - The object being flipped.
     */
    flipImage(mo) {
        this.ctx.save();
        const hb = mo.getHitbox();
        const centerX = hb.left + (hb.right - hb.left) / 2;
        this.ctx.translate(centerX, 0);
        this.ctx.scale(-1, 1);
        this.ctx.translate(-centerX, 0);
    }

    /** Flip Image back to default view */
    flipImageBack(mo) {
        this.ctx.restore();
    }

    /** Starts all recurring world logic such as collision checks and throwable object detection. Uses IntervalManager to register intervals. */
    run() {
        IntervalManager.setInterval(() => {
            this.checkCollisionCollactable();
            this.checkThrowObjects();
            this.updateDynamicLevelEnd();
        }, 200, `World:collision-check`, 'world');
        IntervalManager.setInterval(() => { this.checkCollisionEnemy(); }, 25, 'World: CheckEnemyCollision', 'world');
        IntervalManager.setInterval(() => { this.checkCollisionThrowable(); }, 25, 'World: CheckThrowableObject', 'world');
    }

    /**Stops all world activity by clearing intervals and halting rendering. */
    stop() {
        this.animationStopped = true;
        IntervalManager.clearAll();
    }

    /** update the Status of playing Music Sound*/
    updateMusic() {
        if (typeof startSound === "function") { startSound(); }
    }

    /**
     * Determines whether the player is allowed to throw a bottle.
     * @returns {boolean} True if the throw key is pressed and at least one bottle is available.
     */
    canThrowBottle() {
        return (
            this.keyboard.D &&
            this.character.collectableObjects.bottle > 0 &&
            this.character.canThrow
        );
    }

    /**
     * Calculates the spawn position for a thrown bottle based on the character's hitbox and facing direction.
     * @returns {{x:number, y:number}} The calculated throw coordinates.
     */
    calculateThrowPosition() {
        const hitboxWidth = this.character.width - this.character.offset.left - this.character.offset.right;
        const hitboxHeight = this.character.height - this.character.offset.top - this.character.offset.bottom;
        const centerX = this.character.x + this.character.offset.left + hitboxWidth / 2;
        const centerY = this.character.y + this.character.offset.top + hitboxHeight / 2;
        const offsetX = this.character.otherDirection ? -40 : 40;
        return { x: centerX + offsetX, y: centerY };
    }

    /**
     * Spawns a new throwable bottle at the given coordinates and registers it inside the world's throwable object list.
     * @param {number} x - The x-coordinate of the bottle spawn.
     * @param {number} y - The y-coordinate of the bottle spawn.
     */
    spawnBottle(x, y) {
        const bottle = new ThrowableObject(x, y, this.character.otherDirection);
        bottle.parentArray = this.throwableObjects;
        this.throwableObjects.push(bottle);
    }

    /** Decreases the player's bottle count and updates the bottle status bar.*/
    consumeBottle() {
        this.character.collectableObjects.bottle--;
        this.statusbarBottle.setPercentage(this.character.collectableObjects.bottle);
    }

    /** Handles bottle throwing logic. If the player has bottles available and the throw key is pressed, a new throwable object is spawned and the inventory is updated. */
    checkThrowObjects() {
        if (!this.canThrowBottle()) return;
        const pos = this.calculateThrowPosition();
        this.spawnBottle(pos.x, pos.y);
        this.consumeBottle();
        this.character.startThrowCooldown(); // Cooldown starten
    }

    /**
     * Handles the player's melee attack interaction with an enemy. Applies damage only when the player is actively attacking.
     * @param {enemy} enemy - The enemy being hit.
     * @returns {boolean} True if a melee hit was applied.
     */
    handlePlayerAttack(enemy) {
        if (!this.character.isAttacking || enemy.dead) return false;
        enemy.hit(this.character.hitEnergy, enemy.dead);
        return true;
    }

    /**
     * Applies damage to the player if the enemy collides with them and the enemy is still alive.
     * @param {enemy} enemy - The enemy being checked.
     */
    handleEnemyAttack(enemy) {
        if (!enemy.dead) {
            if (enemy.isAttacking) {
                this.character.hit(enemy.hitEnergy, enemy.dead);
                this.statusbarHealth.setPercentage(this.character.energy);
            }
        }
    }

    /**
     * Handles all collision-related interactions between the player and a single enemy, including attack damage, enemy damage and endboss death checks.
     * @param {enemy} enemy - The enemy to process.
     */
    processEnemyCollision(enemy) {
        enemy.distanceEnemy = Math.abs(this.character.x - enemy.x);
        const col = this.character.isColliding(enemy);
        if (col.collision) {
            if (this.checkCollisionSpike(enemy)) return;
            if (this.handleStomp(enemy)) return;
            if (this.handlePlayerAttack(enemy)) return;
            this.handleEnemyAttack(enemy);
        }
        this.checkEndbossDeath(enemy);
        enemy.checkFirstContact(this);
    }

    /**
     * Handles all collision-related interactions between the player and a single enemy, including attack damage, enemy damage and endboss death checks.
     * @param {enemy} enemy - The enemy to process.
     */
    checkCollisionSpike(enemy) {
        if (!(enemy instanceof SpikeWave)) return false;
        if (this.character.isColliding(enemy).collision) {
            this.character.hit(enemy.damage, false);
            this.statusbarHealth.setPercentage(this.character.energy);
            enemy.removeFromWorld();
            return true;
        }
        return false;
    }

    /**Iterates over all enemies and processes collision logic for each one.*/
    checkCollisionEnemy() {
        this.level.enemies.forEach(enemy => {
            this.processEnemyCollision(enemy);
        });
    }

    /** Check if Character is hitting enemy during jump. */
    isStompHit(player, enemy) {
        const CHARACTER = player.getHitbox();
        const ENEMY = enemy.getHitbox();
        if (player.speedY > 1) return false;
        let isAbove = CHARACTER.bottom <= ENEMY.top + 95;
        if (!isAbove) return false;
        let playerCenter = (CHARACTER.left + CHARACTER.right) / 2;
        let enemyCenter = (ENEMY.left + ENEMY.right) / 2;
        let enemyWidth = ENEMY.right - ENEMY.left;
        let stompRange = enemyWidth * 1.6;
        let distance = Math.abs(playerCenter - enemyCenter);
        return distance <= stompRange;
    }

    /**
     * Handles the stomp interaction when the player lands on top of an enemy. Applies damage to the enemy and triggers a bounce effect for the player.
     * @param {enemy} enemy - The enemy being stomped.
     * @returns {boolean} True if a stomp was successfully executed.
     */
    handleStomp(enemy) {
        if (!this.isStompHit(this.character, enemy) || enemy.dead) return false;
        enemy.hit(this.character.hitEnergy, false);
        return true;
    }

    /**
     * Checks whether the enemy is an endboss and triggers the win condition if the boss has died.
     * @param {enemy} enemy - The enemy being checked.
     */
    checkEndbossDeath(enemy) {
        if (enemy instanceof Endboss && enemy.dead) {
            this.setLevel(win());
        }
    }

    /** Dynamically adjusts the level's end boundary based on the endboss position, preventing the player from walking past the boss.  */
    updateDynamicLevelEnd() {
        const boss = this.endboss();
        if (!boss) return;
        const hb = boss.getHitbox();
        const newEnd = hb.left - 20;
        if (newEnd < this.level.level_end_x) {
            this.level.level_end_x = newEnd + 120;
        }
    }

    /** Checks collisions between throwable objects and enemies.Applies damage, removes bottles on impact and triggers enemy death. */
    checkCollisionThrowable() {
        this.throwableObjects.forEach((bottle) => {
            this.level.enemies.forEach((enemy) => {
                if (bottle.isColliding(enemy).collision) {
                    enemy.hit(this.character.throwEnergy, enemy.dead);
                    if (enemy.energy <= 0) { enemy.dead = true; }
                    bottle.removeFromWorld();
                }
                enemy.checkFirstContact(this);
            });
        });
    }

    /**
     * Handles collection of coins or bottles. Increases the character's inventory and updates the status bar.
     * @param {MoveableObject} obj - The collectable object.
     * @param {string} type - The inventory type ("coin" or "bottle").
     * @param {number} max - Maximum allowed amount.
     * @param {StatusBar} statusbar - The status bar to update.
     */
    handleCollect(obj, type, max, statusbar) {
        if (this.character.collectableObjects[type] < max) {
            this.character.collectableObjects[type]++;
            statusbar.setPercentage(this.character.collectableObjects[type]);
            obj.removeFromWorld();
        }
    }

    /**Checks collisions between the character and all collectable objects. Handles coin and bottle pickup. */
    checkCollisionCollactable() {
        if (this.character.isAttacking) return;
        this.level.collectables.forEach((obj) => {
            if (this.character.isColliding(obj).collision) {
                if (obj instanceof CollectableBottle) this.handleCollect(obj, "bottle", this.character.collectableObjects.maxBottle, this.statusbarBottle);
                if (obj instanceof CollectableCoin) this.handleCollect(obj, "coin", this.character.collectableObjects.maxCoin, this.statusbarCoin);
            }
        });
    }

    /**
     * Returns the endboss instance of the current level, if present.
     * @returns {Endboss|undefined} The endboss or undefined if none exists.
     */
    endboss() {
        return this.level.enemies.find(e => e instanceof Endboss);
    }

    /** Resumes world rendering and interval logic after a pause. */
    resume() {
        this.animationStopped = false;
        this.draw();
        this.run();
    }

    /** Loads the hitbox drawing setting from localStorage and updates the world state accordingly. */
    ensureDDrawingFrame() {
        let existing = localStorage.getItem("drawingFrame");
        if (existing === null) {
            localStorage.setItem("drawingFrame", "false");
            existing = "false";
        }
        this.statusShowFrame = (existing === "true");
    }
}