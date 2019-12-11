export default function() {
    const EARLY_JUMP_PIXELS = 8 // How early the player can press jump before landing
    const JUMP_COOLDOWN_MAX = 5 // Allows player to jump for a brief period after falling off edge

    function components() {
        return {
            physics: {},
            scaleFX: {}
        }
    }

    function onCreate(instance) {
        instance.physics.init(instance)
        instance.scaleFX.init(instance)

        instance.mask = createMask({ left: -4, top: -12, right: 4, bottom: -1 })
        instance.animation = createAnimation(sPlayerIdle, 12)

        instance.facingDir = 1
        instance.stillHoldingInitialJump = false
        instance.jumpCooldown = 0 
        instance.fireCooldown = 0
        instance.fireCooldownMax = 6 // Gap between bullets
    }
    
    function onUpdate(instance) {
        const KEY_RIGHT = keyDown(k.right)
        const KEY_LEFT = keyDown(k.left)
        const KEY_DOWN = keyDown(k.down)
        const KEY_FIRE = keyDown(k.z) || keyDown(k.control)
        const KEY_JUMP_PRESSED = keyPressed(k.x) || keyPressed(k.space) || keyPressed(k.up)
        const KEY_JUMP_RELEASED = keyReleased(k.x) || keyReleased(k.space) || keyReleased(k.up)
        
        // Movement
        if (KEY_RIGHT) {
            instance.speedX = 1
            instance.facingDir = 1
        }

        if (KEY_LEFT) {
            instance.speedX = -1
            instance.facingDir = -1
        }

        // Let the player fall through "top only" collisions when holding down
        if (KEY_DOWN && KEY_JUMP_PRESSED) {
            instance.physics.allowTopOnlyCollisions = false
        }

        // Jump
        if (KEY_JUMP_PRESSED) {
            const floorBelowY = collisionMaskY(instance, 0, EARLY_JUMP_PIXELS)
            const canJumpBeforeLanding = (instance.jumpCooldown > 0 || floorBelowY)

            if (canJumpBeforeLanding && instance.physics.allowTopOnlyCollisions) {
                if (floorBelowY) {
                    instance.y = floorBelowY
                }

                instance.scaleFX.set(instance, 0.75, 1.5)

                instance.speedY = -3.15
                instance.stillHoldingInitialJump = true

                playSound(aJump)
            }
        }

        // Jump release
        if (KEY_JUMP_RELEASED && instance.stillHoldingInitialJump) {
            instance.speedY *= 0.7
            instance.stillHoldingInitialJump = false
        }
        
        // Firing
        if (KEY_FIRE && instance.fireCooldown <= 0) {
            instance.fireCooldown = instance.fireCooldownMax

            createInstance(oFireball, instance.x, instance.y - 8 + (- 1 + Math.random() * 2), {
                direction: getDirection(0, 0, instance.facingDir, 0)
            })
        }

        instance.fireCooldown--
        
        // Float benefit (when holding down long jumps)
        instance.physics.gravity = instance.stillHoldingInitialJump && instance.speedY > -1
            ? 0.075
            : 0.1

        // Collecting orbs
        select(oOrb, other => {
            if (overlap(instance, other)) {
                other.onCollect(other)
            }
        })

        // Update physics
        instance.physics.update(instance)

        // Jump cooldown
        instance.jumpCooldown = !instance.physics.justFellOffEdge
            ? Math.max(0, instance.jumpCooldown - 1)
            : instance.jumpCooldown = JUMP_COOLDOWN_MAX
        
        // On landing
        if (instance.physics.justLanded) {
            instance.stillHoldingInitialJump = false
            instance.scaleFX.set(instance, 1.25, 0.75)
        }

        // Update scaleFX
        instance.scaleFX.update(instance)

        // Animations
        if (instance.physics.onGround) {
            if ((instance.speedX !== 0 || instance.speedY !== 0)) {
                setAnimationSprite(instance.animation, sPlayerWalk)
            } else {
                setAnimationSprite(instance.animation, sPlayerIdle)
            }
        } else {
            if (instance.speedY < - 1) {
                setAnimationSprite(instance.animation, sPlayerJump)
            } else {
                setAnimationSprite(instance.animation, sPlayerFall)
            }
        }
    }

    function onRender(instance) {
        const { animation, x, y } = instance

        setDepth(-100)
        drawAnimation(animation, x, y, instance.scaleFX.x * instance.facingDir, instance.scaleFX.y)
    }

    return {
        components,
        onCreate,
        onUpdate,
        onRender
    }
}