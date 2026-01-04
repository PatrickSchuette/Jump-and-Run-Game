const LEVEL1 = new Level({
    background: {
        count: 8,
        layers: [

            './img/world/clouds_back_layer1.png',
            './img/world/clouds_back_layer2.png',
            './img/world/sky.png',
            './img/world/mountains.png',
            './img/world/trees.png'
        ]
    },

    clouds: 3,
    enemies: {
        enemyGoblin: 1,
        enemyDino: 1,
        enemyPlant: 3,
        enemySpider: 1
    },
    collactableObjects: {
        coins: 5,
        bottle: 5
    },
    playMode: true
});