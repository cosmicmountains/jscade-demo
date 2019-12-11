export default function() {
    function components() {
        return {
            physics: {
                friction: 0
            },
            scaleFX: {},
            enemy: {
                hp: 6
            }
        }
    }
    
    function onCreate(instance) {
        instance.physics.init(instance)
        instance.scaleFX.init(instance)
        instance.enemy.init(instance)

        instance.mask = createMask({ left: -4, top: -12, right: 4, bottom: -1 })
        instance.hitMask = createMask({ left: -4, top: -12, right: 4, bottom: -1 })
        instance.animation = createAnimation(sEnemy, 12)
        setAnimationSpeed(instance.animation, 8)

        instance.facingDir = -1

        instance.state = "move"
        instance.moveTimer = Math.random() * 100
        instance.attackTimer = 100
    }
    
    function onUpdate(instance) {
        // Movement
        if (instance.state === "move") {
            instance.speedX = instance.facingDir === 1
                ? instance.speedX = 0.5
                : instance.speedX = -0.5

            if (instance.moveTimer-- <= 0) {
                instance.moveTimer = 120
                instance.state = "attack"
            }
        } else {
            instance.speedX = 0
            setAnimationFrame(instance.animation, 3)

            if (instance.attackTimer === 90) {
                createInstance(oEnemyFireball, instance.x, instance.y - 8, { speedX: 0.5 * instance.facingDir })
            } else if (instance.attackTimer === 60) {
                createInstance(oEnemyFireball, instance.x, instance.y - 8, { speedX: 0 * instance.facingDir })
            } else if (instance.attackTimer === 30) {
                createInstance(oEnemyFireball, instance.x, instance.y - 8, { speedX: -0.5 * instance.facingDir })
            }

            if (instance.attackTimer-- <= 0) {
                instance.attackTimer = 100
                instance.state = "move"
            }
        }
        

        // Flip directions when reacing edge
        const closeToEdge = !collisionMaskY(instance, 8 * instance.facingDir, 8)

        if (closeToEdge) {
            instance.facingDir *= -1
        }
        
        instance.physics.update(instance)

        // Flip directions when hitting wall
        if (instance.physics.justWalkedIntoWall) {
            instance.facingDir *= -1
        }

        instance.scaleFX.update(instance)
        instance.enemy.update(instance)
        
        setAnimationSpeed(instance.animation, 10 * Math.abs(Math.sign(instance.speedX)))
    }

    function onRender(instance) {
        setDepth(-50)

        drawAnimationColor(
            instance.animation,
            instance.x, instance.y,
            instance.enemy.flashColor,
            instance.facingDir * instance.scaleFX.x * instance.enemy.size,
            instance.scaleFX.y * instance.enemy.size
        )
    }
    
    return {
        components,
        onCreate,
        onUpdate,
        onRender
    }
}