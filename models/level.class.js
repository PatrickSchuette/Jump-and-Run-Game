class Level {
    enemies = [];
    clouds = [];
    backgroundObjects = [];
    collectables = [];
    level_end_x = 0;
    segmentWidth = 719;
    playMode;
    EnemyTypes = {
        enemyDino,
        enemyGoblin,
        enemySpider,
        enemyPlant,
        Endboss
    };
    imagePlayButton = null;

    /** * Creates a new Level instance.  
     * @param {Object} config Level configuration object. 
     * */
    constructor(config) {
        this.imagePlayButton = config.imagePlayButton || null;
        this.generateBackground(config.background.count, config.background.layers);

        this.level_end_x = this.calculateLevelEndX(config.background.count);
        this.playMode = config.playMode;

        this.generateClouds(config.clouds);
        this.generateEnemies(config.enemies);
        this.generateCollectables(config.collactableObjects);
        this.selectPlayButton();
    }


    /**
     * Generates background objects for the level by repeating layered images.
     * @param {number} count - Number of background segments.
     * @param {string[]} layers - Image paths for each background layer.
     */
    generateBackground(count, layers) {
        const startOffset = -1;

        for (let i = 0; i < count; i++) {
            const x = this.segmentWidth * (i + startOffset);

            for (const path of layers) {
                this.backgroundObjects.push(new BackgroundObject(path, x));
            }
        }
    }

    /**
     * Generates cloud objects and adds them to the level.
     * @param {number} amount - Number of clouds to create.
     */
    generateClouds(amount) {
        for (let i = 0; i < amount; i++) {
            this.clouds.push(new Cloud());
        }
    }

    /**
     * Spawns a group of enemies of the same type.
     * @param {Function} EnemyClass - The enemy class constructor.
     * @param {number} count - Number of enemies to spawn.
     */
    spawnEnemyGroup(EnemyClass, count) {
        for (let i = 0; i < count; i++) {
            this.spawnEnemy(EnemyClass, this.level_end_x - 200);
        }
    }

    /**
     * Spawns the endboss if the level is in play mode.
     */
    spawnEndbossIfNeeded() {
        if (!this.playMode) return;

        const bossX = this.level_end_x + 150;
        const boss = this.spawnEnemy(Endboss, bossX);

        // Levelgrenze direkt vor den Boss setzen
        const bossHitbox = boss.getHitbox();
        this.level_end_x = bossHitbox.left - 20; // kleiner Puffer
    }
    

    /**
     * Generates all enemies for the level based on the provided configuration.
     * Spawns enemy groups and the endboss if required.
     *
     * @param {Object<string, number>} enemyConfig - Mapping of enemy types to spawn counts.
     */
    generateEnemies(enemyConfig) {
        if (!enemyConfig) return;

        for (const [enemyName, count] of Object.entries(enemyConfig)) {
            const EnemyClass = this.EnemyTypes[enemyName];
            this.spawnEnemyGroup(EnemyClass, count);
        }

        this.spawnEndbossIfNeeded();
    }

    /**
     * Spawns a single enemy instance at a given x-position.
     * @param {Function} ClassRef - The enemy class constructor.
     * @param {number} x - The x-position where the enemy should spawn.
     */
    spawnEnemy(ClassRef, x) {
        const enemy = new ClassRef(x);

        enemy.parentArray = this.enemies;
        if (this.world) enemy.world = this.world;
        this.enemies.push(enemy);

        return enemy;
    }

    /**
     * Generates collectable objects (coins, bottles) based on configuration.
     * @param {Object} config - Collectable configuration.
     * @param {number} config.coins - Number of coins to spawn.
     * @param {number} config.bottle - Number of bottles to spawn.
     */
    generateCollectables(config) {
        if (!config) return;

        for (let i = 0; i < (config.coins || 0); i++) {
            this.spawnCollectable(CollectableCoin);
        }

        for (let i = 0; i < (config.bottle || 0); i++) {
            this.spawnCollectable(CollectableBottle);
        }
    }

    /**
     * Spawns a collectable object at a random position within the level.
     * @param {Function} ClassRef - The collectable class constructor.
     */
    spawnCollectable(ClassRef) {
        const x = 200 + Math.random() * this.level_end_x;
        const y = 100 + Math.random() * 200;

        const obj = new ClassRef(x, y);

        obj.parentArray = this.collectables;
        this.collectables.push(obj);
    }

    /**
     * Calculates the x-position where the level ends based on background count.
     * @param {number} backgroundCount - Number of background segments.
     * @returns {number} The x-position marking the end of the level.
     */
    calculateLevelEndX(backgroundCount) {
        return (backgroundCount - 2) * this.segmentWidth - 150;
    }

    selectPlayButton(){
        const revButton = document.getElementById('btnStart');
        if (this.imagePlayButton == null) return;
        revButton.style.backgroundImage = `url('${this.imagePlayButton}')`;
    }
}
