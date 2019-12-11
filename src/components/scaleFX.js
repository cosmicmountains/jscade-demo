export default function() {
    function init(instance) {
        const component = instance.scaleFX
        
        component.x = 1
        component.y = 1
    }

    function update(instance) {
        const component = instance.scaleFX

        component.x += (1 - component.x) / 6
        component.y += (1 - component.y) / 10
    }

    function set(instance, x, y) {
        const component = instance.scaleFX

        component.x = x
        component.y = y
    }
    
    return {
        init,
        update,
        set
    }
}