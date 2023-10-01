import { Container, EntityComponent, world } from "@minecraft/server";
import LoreParser, { TTemplate } from "lore-parser/lore.parser";


const durabilityTemplate : TTemplate = {
    shape : [
        'Durability : {durrability}'
    ],
    settings : {
        clearLine : true
    }
}
for(const player of world.getAllPlayers()){
    // @ts-ignore
    const inventory = player.getComponent('inventory')?.container as Container
    const item = inventory.getItem(player.selectedSlot)

    const loreParser = new LoreParser(item, durabilityTemplate)

    loreParser.add('§r§efafaz')
    loreParser.add('§r§afafaz')
    loreParser.add('§r§tfafaz')

    console.warn("first")

    loreParser.initTemplate()



    loreParser.update(player)

}
