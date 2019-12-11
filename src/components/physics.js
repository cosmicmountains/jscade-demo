export default function() {
    function init(instance) {
        const component = instance.physics
        
        if (component.friction === undefined) component.friction = 0.25
        if (component.frictionAir === undefined) component.frictionAir = 0.25
        if (component.gravity === undefined) component.gravity = 0.1

        component.onGround = false
        component.frictionEnabled = true
        component.allowTopOnlyCollisions = true
        component.justFellOffEdge = false
        component.justLanded = false
        component.justWalkedIntoWall = false
    }

    function update(instance) {
        const component = instance.physics
        
        // Resets
        component.justLanded = false
        component.justWalkedIntoWall = false

        // Gravity
        instance.speedY = Math.min(instance.speedY + component.gravity, 4)
        
        // Physics and collisions
        const colX = collisionMaskX(instance)
        
        if (!colX) {
            instance.x += instance.speedX
        } else {
            instance.x = colX
            instance.speedX = 0

            component.justWalkedIntoWall = true
        }

        const colY = collisionMaskY(instance, undefined, undefined, undefined, component.allowTopOnlyCollisions)

        // Air
        if (!colY) {
            instance.y += instance.speedY

            component.justFellOffEdge = (component.onGround && instance.speedY > 0)
            component.justLanded = false
            component.onGround = false

            if (component.frictionEnabled) {
                instance.speedX = approach(instance.speedX, 0, component.frictionAir)
            }
        } else {
            // Ground
            component.justFellOffEdge = false
            component.justLanded = !component.onGround && instance.speedY > 0
            component.onGround = true

            instance.y = colY
            instance.speedY = 0

            if (component.frictionEnabled) {
                instance.speedX = approach(instance.speedX, 0, component.friction)
            }
        }

        // Resets
        instance.physics.allowTopOnlyCollisions = true
    }

    return {
        init,
        update
    }
}