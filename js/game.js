let canvas;
let ctx;
let world;
let keyboard = new Keyboard();
let elementRev = {
    btnLeft: document.getElementById("btnLeft"),
    btnRight: document.getElementById("btnRight"),
    btnJump: document.getElementById("btnJump"),
    btnThrow: document.getElementById("btnThrow"),
    btnStart: document.getElementById("btnStart"),
    btnSound: document.getElementById("btnSound"),
    btnFullscreen: document.getElementById("btnFullscreen"),
    btnFight: document.getElementById("btnFight"),
    btnOptions: document.getElementById("btnOptions"),
    gameArea: document.getElementById('game-container')
}
let configureMenu = null;

function init() {
    ensureDefaultControls();

    canvas = document.getElementById('canvas');

    const selected = localStorage.getItem("selectedCharacter");

    if (selected) {
        // Charakter existiert → Spiel starten
        world = new World(canvas, keyboard);
    } else {
        // Kein Charakter → Auswahl anzeigen
        world = new Option(canvas, keyboard);
    }

    console.log('My world is ', world);
}


window.addEventListener('keydown', (e) => {
    // console.log('key: ' + e.key + ' ; Keycode: ' + e.keyCode);

    if (e.keyCode == 80) playGameButton();//on startscreen start game with p
    if (world.statusPlayMode) {
        switch (e.keyCode) {
            case 39: keyboard.RIGHT = true; break;
            case 37: keyboard.LEFT = true; break;
            case 38: keyboard.UP = true; break;
            case 40: keyboard.DOWN = true; break;
            case 32: keyboard.SPACE = true; break;
            case 68: keyboard.D = true; break;
            case 70: keyboard.ATTAC = true; break;
        }
    }
});

window.addEventListener('keyup', (e) => {
    switch (e.keyCode) {
        case 39: keyboard.RIGHT = false; break;
        case 37: keyboard.LEFT = false; break;
        case 38: keyboard.UP = false; break;
        case 40: keyboard.DOWN = false; break;
        case 32: keyboard.SPACE = false; break;
        case 68: keyboard.D = false; break;
        case 70: keyboard.ATTAC = false; break;
    }
});


function bindButton(btn, key) {
    btn.addEventListener("pointerdown", () => {
        keyboard[key] = true;
    });

    btn.addEventListener("pointerup", () => {
        keyboard[key] = false;
    });

    btn.addEventListener("pointerleave", () => {
        keyboard[key] = false;
    });

    btn.addEventListener("mousedown", () => {
        keyboard[key] = true;
    });
    btn.addEventListener("mouseup", () => {
        keyboard[key] = false;
    });
}

elementRev.btnStart.addEventListener("click", () => {
    startGame();
});

function playGameButton() {
    if (world.level === START) startGame();
}


function startGame() {
    elementRev.btnStart.blur();

    if (world && world.stop) {
        world.stop();
    }

    world = new World(canvas, keyboard);
    world.setLevel(level1());
}

elementRev.btnOptions.addEventListener("click", () => {
    elementRev.btnOptions.blur();

    if (!configureMenu) {
        if (world && world.stop) world.stop();

        configureMenu = new Configure(canvas, keyboard);
        return;
    }

    configureMenu.close();
    configureMenu = null;

    world = new World(canvas, keyboard);
    world.setLevel(level1());
});


elementRev.btnFullscreen.addEventListener("click", () => {
    if (!document.fullscreenElement) {
        openFullscreen();
    } else {
        closeFullscreen();
    }
});


function openFullscreen() {
    if (elementRev.gameArea.requestFullscreen) {
        elementRev.gameArea.requestFullscreen();
    } else if (elementRev.gameArea.webkitRequestFullscreen) {
        elementRev.gameArea.webkitRequestFullscreen();
    } else if (elementRev.gameArea.msRequestFullscreen) {
        elementRev.gameArea.msRequestFullscreen();
    }
}

function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}


document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement) {
        console.log('Fullscreen');
        elementRev.btnFullscreen.style.backgroundImage = "url('./img/button/no-fullscreen.png')";
    } else {
        console.log('kein Fullscreen');
        elementRev.btnFullscreen.style.backgroundImage = "url('./img/button/fullscreen.png')";
    }
});




// Buttons verbinden
bindButton(elementRev.btnLeft, "LEFT");
bindButton(elementRev.btnRight, "RIGHT");
bindButton(elementRev.btnJump, "SPACE");
bindButton(elementRev.btnThrow, "D");
bindButton(elementRev.btnFight, "ATTAC");

function ensureDefaultControls() {
    const existing = localStorage.getItem("controls");

    if (!existing) {
        const defaultControls = {
            Left: "LEFT",
            Right: "RIGHT",
            Jump: "SPACE",
            Fight: "F",
            Throw: "D"
        };

        localStorage.setItem("controls", JSON.stringify(defaultControls));
    }
}


function checkAutoFullscreen() {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isLandscape = window.innerWidth > window.innerHeight;

    if (isMobile && isLandscape && !document.fullscreenElement) {
        openFullscreen();
    }
}

window.addEventListener("resize", checkAutoFullscreen);
window.addEventListener("load", checkAutoFullscreen);
