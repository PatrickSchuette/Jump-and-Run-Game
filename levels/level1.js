function level1() {
    return new Level({
        background: {
            count: 12,
            layers: [

                './img/world/clouds_back_layer1.png',
                './img/world/clouds_back_layer2.png',
                './img/world/sky.png',
                './img/world/mountains.png',
                './img/world/trees.png'
            ]
        },

        clouds: 6,
        enemies: {
            enemyGoblin: 3,
            enemyDino: 3,
            enemyPlant: 5,
            enemySpider: 4
        },
        collactableObjects: {
            coins: 6,
            bottle: 10
        },
        playMode: true
    });
}