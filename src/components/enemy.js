export default function() {
    const gameController = getGameControllerInstance()
    const { oOrb } = getGameObjects()
    const { aHit } = getSounds()
    const { aExplode } = getSounds()
    
    function init(instance) {
        const component = instance.enemy

        if (component.hp === undefined) component.hp = 4
        if (component.size === undefined) component.size = 1
        
        component.flashCooldown = 0 // Used when the enemy is hit
        component.flashCooldownMax = 3
        component.flashColor = null
    }

    function update(instance) {
        const component = instance.enemy

        component.flashCooldown = Math.max(0, component.flashCooldown - 1)

        component.flashColor = component.flashCooldown === 0
            ? rgba(255, 255, 255)
            : rgba(100000, 100000, 100000)
    }

    function onHit(instance) {
        const component = instance.enemy

        component.hp -= 1
        component.flashCooldown = component.flashCooldownMax

        playSound(aHit)

        if (component.hp <= 0) {
            gameController.score += 100 * component.size
            gameController.screenshake = 15 * component.size
            playSound(aExplode)

            for (let i = 0; i < 16 * component.size; i++) {
                createInstance(oOrb, instance.x, instance.y - 5, {
                    fromEnemy: true
                })
            }

            deleteInstance(instance)
        }
    }

    return {
        init,
        update,
        onHit
    }
}