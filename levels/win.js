function win() {
    return new Level({
        background: {
            count: 3,
            layers: [
                './img/win.png',
            ]
        },
        clouds: 0,
        enemies: {
            enemyDino: 0,
            enemyGoblin: 0
        },
        collactableObjects: {
            coins: 0,
            bottle: 0
        },
        playMode: false,
        imagePlayButton : './img/button/restart.png'
    });
}