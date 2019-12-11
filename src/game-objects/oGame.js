export default function() {
    const TEXT_SCALE = 0.5
    
    function onCreate(instance) { 
        stopAllSounds()

        instance.score = 0
        instance.screenshake = 0
        instance.startedMusic = false // Because browsers don't like automatic sound
        
        // Camera
        // TODO: fix the engine so the zoom doesn't have to be stored here.
        // It's currently stored here because the engine zoom can be
        // glitchy due to floating point errors. So the zoom is being
        // stored on the gameController so it can be rounded in onUpdate to avoid
        // floating point errors.
        instance.cameraZoom = 24
        instance.cameraZoomTarget = 7
    }
    
    function onSceneStart(instance) {
        select(oPlayer, other => {
            camera.x = other.x
            camera.y = other.y
        })
    }

    function onUpdateEnd(instance) {
        const KEY_ZOOM_IN = keyPressed(k.w)
        const KEY_ZOOM_OUT = keyPressed(k.s)
        const KEY_RESTART = keyPressed(k.r)

        if (!instance.startedMusic) {
            if (keyDown(k.space) || keyDown(k.x)) {
                instance.startedMusic = true
                playSound(mWorld1, true)
                setVolume(mWorld1, 0, 1)
                setVolume(mWorld1, 0.7, 0.05)
            }
        }

        if (KEY_ZOOM_IN) {
            instance.cameraZoomTarget = 12
            setVolume(mWorld1, 0.2, 0.025)
        }

        if (KEY_ZOOM_OUT) {
            instance.cameraZoomTarget = 7
            setVolume(mWorld1, 0.7, 0.025)
        }

        if (KEY_RESTART) restartGame()

        // Screenshake
        instance.screenshake = Math.max(instance.screenshake - 1, 0)

        // Camera
        select(oPlayer, other => {
            camera.x += (other.x - camera.x) / 6
            camera.y += (other.y - camera.y) / 12

            if (instance.screenshake) {
                camera.x += -3 + Math.random() * 6
                camera.y += -3 + Math.random() * 6
            }

            instance.cameraZoom += (instance.cameraZoomTarget - instance.cameraZoom) / 12
            camera.zoom = Math.floor(instance.cameraZoom / 0.0125) * 0.0125
        })
    }

    function onRender(instance) {
        // Backgrounds
        setDepth(99999)
        drawParallaxBG(
            sSky, 0,
            0, 0,
            2, 1,
            1, 1,
            1, 1
        )

        drawParallaxBG(
            sMountains, 0,
            0, 0,
            2, 1,
            1, 1,
            1, 1
        )

        drawParallaxBG(
            sHills, 0,
            -100, 65,
            2, 1,
            0.95, 1,
            1, 1
        )
        
        // HUD
        setDepth(-1000)
        drawTextShadowHUD(instance.score, fDefault, 16, 4, TEXT_SCALE, 20)
        drawSpriteHUD(sPlayerIdle, 0, 8, 16, 1, 1, 0)
    }

    function drawTextShadowHUD(text, font, x, y, textScale, charsPerLine) {
        drawTextHUD(text, font, rgba(0, 0, 0, 100), x + 1, y + 1, textScale, textScale, charsPerLine)
        drawTextHUD(text, font, rgba(0, 0, 0, 255), x + 0.5, y + 0.5, textScale, textScale, charsPerLine)
        drawTextHUD(text, font, rgba(255, 255, 255), x, y, textScale, textScale, charsPerLine)
    }

    return {
        onCreate,
        onSceneStart,
        onUpdateEnd,
        onRender
    }
}