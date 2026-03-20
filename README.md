
# Mystery Forrest

A handcrafted 2D action‑adventure built with HTML5 Canvas and a fully custom JavaScript game engine.

## Game Overview

 Mystery Forrest is a browser‑based side‑scrolling action platformer featuring three playable character classes, multiple enemy types, animated environments, collectables, and a dynamic boss fight. The entire game runs without external frameworks; every mechanic, animation system, and engine component is written from scratch.


## Key Features

- Three unique characters: Knight, Mage, Rogue — each with their own animations and combat style
- Multiple enemy types: goblins, dinosaurs, spiders, plant creatures
- Endboss encounter with melee attacks, spike waves, idle/hurt/death states
- Collectables: coins and bottles with animated sprites
- Throwable objects: bottle‑throwing mechanic with physics and cooldown
- Status bars for health, coins, bottles, and the endboss
- Responsive UI with desktop keyboard controls, mobile touch controls, and tablet mode
- Fullscreen mode, sound toggle, and an in‑game configuration menu
- Dialog system for Privacy Policy and Legal Notice
- Parallax‑style background layers and cloud animations

## Technical Architecture
Mystery Forrest is powered by a modular, object‑oriented JavaScript engine designed specifically for this project.

## World Engine
- Canvas rendering loop using requestAnimationFrame
- Camera tracking system
- Collision detection for enemies, collectables, and projectiles
- Level transitions (start → level → win/lost)
- Interval‑based logic loops managed by a custom IntervalManager

## Level System
- Layered backgrounds for depth
- Randomized enemy and collectable placement
- Dynamic level boundaries
- Automatic endboss placement and behavior activation

## Character System
- Movement, jumping, attacking, and throwing
- Hurt cooldown, death sequence, and animation state machine
- Individual animation sets per class
- Extended hitboxes during attacks

## Enemy System
- Shared base class with movement, attack logic, and death animations
- Specialized enemies with unique sprites and hitboxes
- Endboss with spike attacks, melee attacks, idle/hurt/walk/death states, cooldowns, and distance‑based triggers

## UI and Controls
- Mobile touch buttons mapped to keyboard actions
- Tablet detection via pointer type and screen width
- Fullscreen toggle
- Sound system with background music and action effects
- Configuration menu with character switching

## Project Structure
```
/models        → Core engine classes (character, enemies, world, UI, etc.)
/levels        → Start screen, Level 1, Win, Lost
/img           → Characters, enemies, backgrounds, UI assets
/audio         → Music and sound effects
/js            → Game logic, UI scripts, dialog rendering
index.html     → Entry point
style.css      → Layout, animations, responsive design
```

## How to Run
- Clone the repository
- Open the project folder
- Launch index.html in any modern browser
- No build tools or dependencies are required.

## Mobile and Tablet Support
- Touch‑optimized controls
- Automatic UI scaling
- Rotate‑device overlay for portrait mode
- Tablet‑specific layout adjustments

## License
This project is private and not licensed for reuse or redistribution.
