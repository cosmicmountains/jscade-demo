export default function() {
    function onRender(instance) {
        setDepth(1001)
        drawSprite(sTree, 0, instance.x + 16, instance.y + 18)
    }
    
    return {
        onRender
    }
}