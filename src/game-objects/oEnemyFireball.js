export default function() {
    function onCreate(instance) {
        select(oPlayer, other => {
            const disToPlayerX = Math.abs(instance.x - other.x)
            const disToPlayerY = Math.abs(instance.y - other.y)

            if (disToPlayerX < 140 && disToPlayerY < 80) {
                playSound(aEnemyFireball)
            }
        })

        instance.mask = createMask({ left: -3, top: -3, right: 3, bottom: 3 })
        instance.speedY = -2
    }
    
    function onUpdate(instance) {
        // Gravity
        instance.speedY += 0.075
        instance.speedY = Math.min(3, instance.speedY)

        // Physics and collisions
        const colX = collisionMaskX(instance, instance.speedX)
        instance.x += instance.speedX
        
        const colY = collisionMaskY(instance, instance.speedY)
        instance.y += instance.speedY
        
        if (colX || colY) {
            deleteInstance(instance)
        }
    }

    function onRender(instance) {
        setDepth(-100)
        drawSprite(sEnemyFireball, 0, instance.x, instance.y)
    }
    
    function onDelete(instance) {
    }

    return {
        onCreate,
        onUpdate,
        onDelete,
        onRender
    }
}