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

/** Initializes the game environment, loads settings, prepares UI, sound, and world state. Also binds all input and UI event handlers. */
function init() {
    ensureDefaultControls();

    canvas = document.getElementById('canvas');
    checkNewSession();

    checkLocalSoundExist();
    setBindButton();
    setUI();
    startSound();
    checkCharacterSelected();
    bindAllEvents();
}

/** Detects whether the page load is a fresh session or a reload. On a fresh session, resets character selection and debug settings. */
function checkNewSession() {
    const nav = performance.getEntriesByType("navigation")[0];

    const isReload =
        nav.type === "reload" ||
        performance.navigation.type === 1;

    if (!isReload) {
        localStorage.removeItem("selectedCharacter");
        localStorage.setItem("drawingFrame", "false");
    }

    sessionStorage.setItem("tabOpen", "true");
}

/** Creates either the character selection screen or the game world, depending on whether a character is stored in localStorage. */
function checkCharacterSelected() {
    const selected = localStorage.getItem("selectedCharacter");
    if (selected) {
        world = new World(canvas, keyboard);
    } else {
        world = new Option(canvas, keyboard);
    }
}

/**
 * Handles keyboard keydown events and maps them to game control flags. Uses `KeyboardEvent.code` for layout‑independent input handling.
 * @param {KeyboardEvent} e - The keyboard event.
 */
function handleKeyDown(e) {
    if (world.statusPlayMode && !world.character.isDead()) {
        switch (e.code) {
            case "ArrowRight": keyboard.RIGHT = true; break;
            case "ArrowLeft": keyboard.LEFT = true; break;
            case "ArrowUp": keyboard.UP = true; break;
            case "ArrowDown": keyboard.DOWN = true; break;
            case "Space": keyboard.SPACE = true; break;
            case "KeyD": keyboard.D = true; break;
            case "KeyF":
                if (!keyboard.ATTAC_PRESSED) {
                    keyboard.ATTAC = true;
                    keyboard.ATTAC_PRESSED = true;
                } break;
        }
    }
}

/**
 * Handles keyboard keyup events and resets game control flags. Uses `KeyboardEvent.code` for layout‑independent input handling.
 * @param {KeyboardEvent} e - The keyboard event.
 */
function handleKeyUp(e) {
    switch (e.code) {
        case "ArrowRight": keyboard.RIGHT = false; break;
        case "ArrowLeft": keyboard.LEFT = false; break;
        case "ArrowUp": keyboard.UP = false; break;
        case "ArrowDown": keyboard.DOWN = false; break;
        case "Space": keyboard.SPACE = false; break;
        case "KeyD": keyboard.D = false; break;
        case "KeyF":
            keyboard.ATTAC = false;
            keyboard.ATTAC_PRESSED = false;
            break;
    }
}

/**
 * Binds pointer and mouse events to a virtual button and maps them to keyboard flags.
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

/** Handles the start button action. Starts the game or opens the character selection screen. */
function startButtonClicked() {
    if (!localStorage.getItem("selectedCharacter")) {
        checkCharacterSelected();
    } else {
        startGame();
    }
}

/** Starts the game when the start screen is active and the user presses the play key. */
function playGameButton() {
    if (world.level === START) startGame();
}

/** Creates a new game world, resets intervals, loads level 1, and ensures background music is updated. */
function startGame() {
    elementRev.btnStart.blur();

    if (!userInteracted) userInteracted = true;

    if (world && world.stop) {
        world.stop();
        IntervalManager.clearAll();
    }

    world = new World(canvas, keyboard);
    world.setLevel(level1());
    startSound();
}

/** Opens or closes the configuration menu. */
function optionsButtonClicked() {
    elementRev.btnOptions.blur();

    if (!configureMenu) {
        if (world && world.stop) world.stop();
        configureMenu = new Configure(canvas, keyboard);
        return;
    }

    configureMenu.close();
    configureMenu = null;
    checkCharacterSelected();
}

/** Toggles fullscreen mode when the fullscreen button is clicked. */
function fullscreenButtonClicked() {
    if (!document.fullscreenElement) {
        openFullscreen();
    } else {
        closeFullscreen();
    }
}

/** Requests fullscreen mode for the game container. */
function openFullscreen() {
    if (elementRev.gameArea.requestFullscreen) {
        elementRev.gameArea.requestFullscreen();
    } else if (elementRev.gameArea.webkitRequestFullscreen) {
        elementRev.gameArea.webkitRequestFullscreen();
    } else if (elementRev.gameArea.msRequestFullscreen) {
        elementRev.gameArea.msRequestFullscreen();
    }
}

/** Exits fullscreen mode if currently active. */
function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

/** Updates the fullscreen button icon when fullscreen mode changes. */
function handleFullscreenChange() {
    elementRev.btnFullscreen.blur();

    elementRev.btnFullscreen.style.backgroundImage =
        document.fullscreenElement
            ? "url('./img/button/no-fullscreen.png')"
            : "url('./img/button/fullscreen.png')";
}

/** Toggles sound on/off when the sound button is clicked. */
function soundButtonClicked() {
    elementRev.btnSound.blur();
    playSound = !playSound;
    startSound();
}

/** Toggles background music based on user settings and interaction state. Updates the sound button icon accordingly. */
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

/** check if a Variable in localStorage exists */
function checkLocalSoundExist() {
    if (localStorage.getItem("playSound") === null) {
        localStorage.setItem("playSound", "true")
    } else {
        playSound = localStorage.getItem("playSound") === "true";
    };
}

/** Bind all buttons to the event Listener Actions */
function setBindButton() {
    bindButton(elementRev.btnLeft, "LEFT");
    bindButton(elementRev.btnRight, "RIGHT");
    bindButton(elementRev.btnJump, "SPACE");
    bindButton(elementRev.btnThrow, "D");
    bindButtonAttack(elementRev.btnFight);
}

/**
 * Binds attack‑specific pointer events to the attack button, ensuring the attack cannot be triggered repeatedly while held.
 * @param {HTMLElement} btn - The attack button element.
 */
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

/** Ensures that default control mappings exist in localStorage. Creates them if they are missing. */
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

/** Unlocks audio playback on first user interaction (required by browsers). */
function handlePointerDown() {
    if (!userInteracted) {
        userInteracted = true;
        if (playSound) startSound();
    }
}

/** Shows or hides the rotate‑device overlay depending on whether the device is in portrait or landscape orientation. */
function checkOrientation() {
    const overlay = document.getElementById("rotate-overlay");

    if (window.innerWidth > window.innerHeight) {
        overlay.style.display = "none"; 
    } else {
        overlay.style.display = "flex";  
    }
}

/**
 * Detects whether the current device should be treated as a tablet based on screen size, pointer type and known device signatures.
 * @returns {boolean} True if the device is considered a tablet.
 */
function isTablet() {
    const UA = navigator.userAgent;
    let isCoarse = window.matchMedia("(pointer: coarse)").matches;
    let isWideEnough = window.matchMedia("(min-width: 768px)").matches;

    const isSurfaceDuo = /Surface Duo/i.test(UA);
    if (isSurfaceDuo) {
        isCoarse = true;
        isWideEnough = true;
    }

    return isCoarse && isWideEnough;
}

/** Applies tablet‑specific UI adjustments by toggling visibility of elements marked as desktop‑only or mobile‑only. */
function checkTabletModus() {
    const desktopEls = document.querySelectorAll('.onlyDesktop');
    const mobileEls = document.querySelectorAll('.onlyMobile');

    if (isTablet()) {
        desktopEls.forEach(el => el.style.display = 'none');
        mobileEls.forEach(el => el.style.display = 'flex');
        document.getElementById("rotate-overlay").style.display = "none";
    } else {
        desktopEls.forEach(el => el.style.display = '');
        mobileEls.forEach(el => el.style.display = '');
    }
}

/** Set eventListener for UI Interface of mobile Devices */
function setUI() {
    checkOrientation();
    checkTabletModus();
}

/** Handles window resize events and updates UI layout accordingly. */
function handleResize() {
    checkOrientation();
    checkTabletModus();
}

window.addEventListener("orientationchange", checkOrientation);

/**
 * Prevents the default context menu from opening.
 * @param {MouseEvent} e - The contextmenu event.
 */
function handleContextMenu(e) {
    e.preventDefault();
}

/** Binds all input, UI, and system event handlers to the window and DOM elements. */
function bindAllEvents() {
    window.onkeydown = handleKeyDown;
    window.onkeyup = handleKeyUp;
    window.onpointerdown = handlePointerDown;
    elementRev.btnStart.onclick = startButtonClicked;
    elementRev.btnOptions.onclick = optionsButtonClicked;
    elementRev.btnFullscreen.onclick = fullscreenButtonClicked;
    elementRev.btnSound.onclick = soundButtonClicked;
    document.onfullscreenchange = handleFullscreenChange;
    window.onresize = handleResize;
    window.onorientationchange = checkOrientation;
    window.oncontextmenu = handleContextMenu;
}
