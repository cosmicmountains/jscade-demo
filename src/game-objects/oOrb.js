import jscade from "jscade"


export default function() {
    function components() {
        return {
            physics: {
                friction: 0.1,
                frictionAir: 0.01
            }
        }
    }
    
    function onCreate(instance) {
        instance.physics.init(instance)

        instance.mask = createMask({ left: -4, top: -4, right: 4, bottom: 4 })

        // Randomise speed and direction when orbs are from enemy
        if (instance.fromEnemy) {
            instance.speedX = -1.5 + (Math.random() * 3)
            instance.speedY = -1 + -(Math.random() * 2)
        }

        instance.floatingCooldown = 40 // Ensures the orb floats for some time before magnetting to player
        instance.isTrackingPlayer = false
        instance.player = null

        instance.onCollect = onCollect
    }

    function onUpdate(instance) {
        // Move towards player when close
        if (!instance.isTrackingPlayer) {
            instance.floatingCooldown--

            if (instance.speedY >= 0) {
                select(oPlayer, other => {
                    if (getDistance(instance.x, instance.y, other.x, other.y) < 50) {
                        instance.isTrackingPlayer = true
                        instance.player = other
                    }
                })
            }

            instance.physics.update(instance)
        } else {
            const dirToPlayer = getDirection(instance.x, instance.y, instance.player.x, instance.player.y - 8)

            instance.speedX += getMotionX(0.25, dirToPlayer)
            instance.speedY += getMotionY(0.25, dirToPlayer)
            instance.speedX = Math.min(Math.max(instance.speedX, -4), 4)
            instance.speedY = Math.min(Math.max(instance.speedY, -4), 4)

            // Ensure the orbs always reach player
            instance.x += getMotionX(1.25, dirToPlayer)
            instance.y += getMotionY(1.25, dirToPlayer)

            // Update pos
            instance.x += instance.speedX
            instance.y += instance.speedY
        }
    }

    function onRender(instance) {
        setDepth(-150)

        drawSprite(sOrb, 0, instance.x, instance.y)
    }

    function onCollect(instance) {
        gameController.score += 1
        deleteInstance(instance)
        playSound(aOrb)
    }
    
    return {
        components,
        onCreate,
        onUpdate,
        onRender
    }
}