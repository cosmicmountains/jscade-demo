export default function() {
    function onCreate(instance) {
        playSound(aFire)

        instance.direction = instance.direction || 0

        instance.mask = createMask({ left: -3, top: -3, right: 3, bottom: 3 })
        instance.duration = 50
        instance.speedX = getMotionX(5, instance.direction)
        instance.speedY = getMotionY(5, instance.direction)
    }
    
    function onUpdate(instance) {
        if (instance.duration-- <= 0) {
            deleteInstance(instance)
        }
        
        select(oEnemy, other => {
            if (overlap(instance, other, instance.mask, other.hitMask)) {
                deleteInstance(instance)
                other.enemy.onHit(other)
            }
        })

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
        drawSprite(sFireball, 0, instance.x, instance.y)
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