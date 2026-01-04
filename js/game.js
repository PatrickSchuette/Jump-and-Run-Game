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
}

function init() {
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


// Buttons verbinden
bindButton(elementRev.btnLeft, "LEFT");
bindButton(elementRev.btnRight, "RIGHT");
bindButton(elementRev.btnJump, "SPACE");
bindButton(elementRev.btnThrow, "D");
bindButton(elementRev.btnFight, "ATTAC");