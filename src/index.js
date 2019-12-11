import jscade from "jscade"

import oGame from "./game-objects/oGame.js"
import oPlayer from "./game-objects/oPlayer.js"
import oFireball from "./game-objects/oFireball.js"
import oOrb from "./game-objects/oOrb.js"
import oEnemy from "./game-objects/oEnemy.js"
import oEnemyFireball from "./game-objects/oEnemyFireball.js"
import oTree from "./game-objects/oTree.js"

import physics from "./components/physics.js"
import scaleFX from "./components/scaleFX.js"
import enemy from "./components/enemy.js"


jscade.init({
    controller: oGame,
    gameObjects: {
        oPlayer,
        oFireball,
        oOrb,
        oEnemy,
        oEnemyFireball,
        oTree
    },
    components: {
        physics,
        scaleFX,
        enemy
    },
    debugMode: true
})
