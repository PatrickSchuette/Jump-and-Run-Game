const LEVEL1 = new Level({
    background: {
        count: 8,
        layers: [

            '../img/World/clouds_back_layer1.png',
            '../img/World/clouds_back_layer2.png',
            '../img/World/sky.png',
            '../img/World/mountains.png',
            '../img/World/trees.png'
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