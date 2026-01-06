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

    /** * Creates a new Level instance.  
     * @param {Object} config Level configuration object. 
     * */
    constructor(config) {
        this.generateBackground(
            config.background.count,
            config.background.layers
        );

        this.level_end_x = this.calculateLevelEndX(config.background.count);
        this.playMode = config.playMode;

        this.generateClouds(config.clouds);
        this.generateEnemies(config.enemies);
        this.generateCollectables(config.collactableObjects);
    }


    /** Generates background objects for the level. */
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
      * Generates cloud objects. 
      * @param {number} amount - Number of clouds to create. 
    */
    generateClouds(amount) {
        for (let i = 0; i < amount; i++) {
            this.clouds.push(new Cloud());
        }
    }

    /** 
      * Generates enemy objects (chickens and optionally endboss). 
      * @param {number} amount - Number of chickens to create. 
    */
    generateEnemies(enemyConfig) {
        if (!enemyConfig) return;

        for (const [enemyName, count] of Object.entries(enemyConfig)) {
            const EnemyClass = this.EnemyTypes[enemyName];

            for (let i = 0; i < count; i++) {
                this.spawnEnemy(EnemyClass, this.level_end_x - 200);
            }
        }

        if (this.playMode) {
            this.spawnEnemy(Endboss, this.level_end_x + 150);
        }
    }


    spawnEnemy(ClassRef, x) {
        const enemy = new ClassRef(x);

        enemy.parentArray = this.enemies;
        if (this.world) enemy.world = this.world;
        this.enemies.push(enemy);
    }

    generateCollectables(config) {
        if (!config) return;

        // Coins
        for (let i = 0; i < (config.coins || 0); i++) {
            this.spawnCollectable(CollectableCoin);
        }

        // Bottles
        for (let i = 0; i < (config.bottle || 0); i++) {
            this.spawnCollectable(CollectableBottle);
        }
    }

    spawnCollectable(ClassRef) {
        const x = 200 + Math.random() * this.level_end_x;
        const y = 100 + Math.random() * 200;

        const obj = new ClassRef(x, y);

        obj.parentArray = this.collectables;
        this.collectables.push(obj);
    }

    /** * Calculates the x-position where the level ends. 
     * @param {number} backgroundCount - Number of background segments. 
     * @returns {number} 
     */
    calculateLevelEndX(backgroundCount) {
        return (backgroundCount - 2) * this.segmentWidth - 150;
    }
}
