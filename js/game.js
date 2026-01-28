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
let playSound;
let bgMusic = new Audio('./audio/game-sound.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.4;
let userInteracted = false;

/**
 * Initializes the game, loads settings, prepares canvas, sound, and world state.
 * Creates either the character selection screen or the game world depending on saved data.
 */
function init() {
    ensureDefaultControls();

    canvas = document.getElementById('canvas');
    checkNewSeassion();
    const selected = localStorage.getItem("selectedCharacter");

    checkLocalSoundExist()
    startSound();

    if (selected) {
        world = new World(canvas, keyboard);
    } else {
        world = new Option(canvas, keyboard);
    }
}

/**
 * Check if it's a reaload or new seassion for character selection
 */
function checkNewSeassion() {
    const nav = performance.getEntriesByType("navigation")[0];

    const isReload =
        nav.type === "reload" ||
        performance.navigation.type === 1;

    if (!isReload) {
        localStorage.removeItem("selectedCharacter");
    }

    sessionStorage.setItem("tabOpen", "true");
}



/**
 * Handles keyboard keydown events and maps them to game controls.
 * @event window#keydown
 * @param {KeyboardEvent} e - The keyboard event.
 */
window.addEventListener('keydown', (e) => {
    if (world.statusPlayMode && !world.character.isDead()) {
        switch (e.keyCode) {
            case 39: keyboard.RIGHT = true; break;
            case 37: keyboard.LEFT = true; break;
            case 38: keyboard.UP = true; break;
            case 40: keyboard.DOWN = true; break;
            case 32: keyboard.SPACE = true; break;
            case 68: keyboard.D = true; break;
            case 70: if (!keyboard.ATTAC_PRESSED) { keyboard.ATTAC = true; keyboard.ATTAC_PRESSED = true; }; break;
        }
    }
});

/**
 * Handles keyboard keyup events and resets game control flags.
 * @event window#keyup
 * @param {KeyboardEvent} e - The keyboard event.
 */
window.addEventListener('keyup', (e) => {
    switch (e.keyCode) {
        case 39: keyboard.RIGHT = false; break;
        case 37: keyboard.LEFT = false; break;
        case 38: keyboard.UP = false; break;
        case 40: keyboard.DOWN = false; break;
        case 32: keyboard.SPACE = false; break;
        case 68: keyboard.D = false; break;
        case 70: keyboard.ATTAC = false; keyboard.ATTAC_PRESSED = false; break;
    }
});

/**
 * Binds pointer and mouse events to a virtual button and maps them to keyboard flags.
 *
 * @param {HTMLElement} btn - The button element to bind.
 * @param {string} key - The keyboard property name to toggle.
 */
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

/**
 * Starts the game when the start button is clicked.
 * @event HTMLElement#click
 */
elementRev.btnStart.addEventListener("click", () => {
    startGame();
});

/**
 * Starts the game when the start screen is active and the user presses "P".
 */
function playGameButton() {
    if (world.level === START) startGame();
}

/**
 * Starts a new game world instance and loads the first level.
 * Stops any existing world before creating a new one.
 */
function startGame() {
    elementRev.btnStart.blur();

    if (!userInteracted) userInteracted = true;

    if (world && world.stop) {
        world.stop();
    }

    world = new World(canvas, keyboard);
    world.setLevel(level1());
    startSound();
}

/**
 * Opens or closes the configuration menu.
 * @event HTMLElement#click
 */
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

/**
 * Toggles fullscreen mode when the fullscreen button is clicked.
 * @event HTMLElement#click
 */
elementRev.btnFullscreen.addEventListener("click", () => {
    if (!document.fullscreenElement) {
        openFullscreen();
    } else {
        closeFullscreen();
    }
});

/**
 * Requests fullscreen mode for the game container.
 */
function openFullscreen() {
    if (elementRev.gameArea.requestFullscreen) {
        elementRev.gameArea.requestFullscreen();
    } else if (elementRev.gameArea.webkitRequestFullscreen) {
        elementRev.gameArea.webkitRequestFullscreen();
    } else if (elementRev.gameArea.msRequestFullscreen) {
        elementRev.gameArea.msRequestFullscreen();
    }
}

/**
 * Exits fullscreen mode if currently active.
 */
function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

/**
 * Updates the fullscreen button icon when fullscreen mode changes.
 * @event document#fullscreenchange
 */
document.addEventListener("fullscreenchange", () => {
    if (document.fullscreenElement) {
        elementRev.btnFullscreen.blur();
        elementRev.btnFullscreen.style.backgroundImage = "url('./img/button/no-fullscreen.png')";
    } else {
        elementRev.btnFullscreen.blur();
        elementRev.btnFullscreen.style.backgroundImage = "url('./img/button/fullscreen.png')";
    }
});

/**
 * Toggles sound on/off when the sound button is clicked.
 * @event HTMLElement#click
 */
elementRev.btnSound.addEventListener("click", () => {
    elementRev.btnSound.blur();
    playSound = !playSound;
    startSound();
});

/**
 * Toggles background music based on user settings and interaction state.
 * Updates the sound button icon accordingly.
 */
function startSound() {
    localStorage.setItem("playSound", String(playSound));

    elementRev.btnSound.style.backgroundImage = playSound
        ? "url('./img/button/sound-button.png')"
        : "url('./img/button/sound-off.png')";

    if (!playSound) { bgMusic.pause(); return; }
    if (!userInteracted) { bgMusic.pause(); return; }
    if (!world.statusPlayMode) { bgMusic.pause(); return; }

    bgMusic.play();
}


function checkLocalSoundExist() {
    if (localStorage.getItem("playSound") === null) {
        localStorage.setItem("playSound", "true")
    } else {
        playSound = localStorage.getItem("playSound") === "true";
    };
}

bindButton(elementRev.btnLeft, "LEFT");
bindButton(elementRev.btnRight, "RIGHT");
bindButton(elementRev.btnJump, "SPACE");
bindButton(elementRev.btnThrow, "D");
bindButtonAttack(elementRev.btnFight);

function bindButtonAttack(btn) {
    btn.addEventListener("pointerdown", () => {
        if (!keyboard.ATTAC_PRESSED) {
            keyboard.ATTAC = true;
            keyboard.ATTAC_PRESSED = true;
        }
    });

    btn.addEventListener("pointerup", () => {
        keyboard.ATTAC = false;
        keyboard.ATTAC_PRESSED = false;
    });

    btn.addEventListener("pointerleave", () => {
        keyboard.ATTAC = false;
        keyboard.ATTAC_PRESSED = false;
    });
}


/**
 * Ensures that default control mappings exist in localStorage.
 * Creates them if missing.
 */
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

/**
 * Unlocks audio playback on first user interaction (required by browsers).
 * @event window#pointerdown
 */
window.addEventListener("pointerdown", () => {
    if (!userInteracted) {
        userInteracted = true;

        if (playSound) {
            startSound();
        }
    }
});

