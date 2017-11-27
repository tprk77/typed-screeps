// tslint:disable:no-reference no-unused-expression
/// <reference path="../dist/screeps.d.ts" />

// This file exists solely to test whether or not the typings actually work.
// After working on your changes, make sure to run `npm run compile` to build
// the declarations before opening this file.
//
// If you open this file and see no red squiggly lines, then you're good!
// Feel free to add more test cases in the form of a sample code.

// TODO: add more test cases.

////////
// Sample inputs

const creep: Creep = Game.creeps.sampleCreep;
const room: Room = Game.rooms.W10S10;
const flag: Flag = Game.flags.Flag1;
const spawn: Spawn = Game.spawns.Spawn1;
const body: BodyPartConstant[] = [WORK, WORK, CARRY, MOVE];

// Sample inputs for Game.map.findRoute testing
const anotherRoomName: Room = Game.rooms.W10S11;

// Sample memory extensions
interface CreepMemory {
    sourceId: string;
    lastHits: number;
    task: string;
    role: string;
}

////////
// Game.creeps

{
    for (const i in Game.creeps) {
        Game.creeps[i].moveTo(flag);
    }
}

////////
// Game.flags

{
    creep.moveTo(Game.flags.Flag1);
}

////////
// Game.spawns

{
    for (const i in Game.spawns) {
        Game.spawns[i].createCreep(body);
    }
}

////////
// Game.time

{
    console.log(Game.time);
}

////////
// Game.cpu.getUsed()

{
    if (Game.cpu.getUsed() > Game.cpu.tickLimit / 2) {
        console.log("Used half of CPU already!");
    }
}

{
    for (const name in Game.creeps) {
        const startCpu = Game.cpu.getUsed();

        // creep logic goes here

        const elapsed = Game.cpu.getUsed() - startCpu;
        console.log(`Creep ${name} has used ${elapsed} CPU time`);
    }
}

////////
// Game.cpu.setShardLimits()

{
    Game.cpu.setShardLimits({ shard0: 20, shard1: 10 });
}

////////
// Game.getObjectById(id)

{
    creep.memory.sourceId = creep.pos.findClosestByRange(FIND_SOURCES).id;
    const source = Game.getObjectById<Source>(creep.memory.sourceId);
}

////////
// Game.notify(message, [groupInterval])

{
    if (creep.hits < creep.memory.lastHits) {
        Game.notify(`Creep ${creep} has been attacked at ${creep.pos}!`);
    }
    creep.memory.lastHits = creep.hits;
}

{
    if (Game.spawns["Spawn1"].energy === 0) {
        Game.notify(
            "Spawn1 is out of energy",
            180  // group these notifications for 3 hours
        );
    }
}

////////
// Game.map.describeExits()

{
    const exits = Game.map.describeExits("W8N3");
}

////////
// Game.map.findExit()

{
    if (creep.room !== anotherRoomName) {
        const exitDir = Game.map.findExit(creep.room, anotherRoomName);
        const exit = creep.pos.findClosestByRange(exitDir as FindConstant);
        creep.moveTo(exit);
    } else {
        // go to some place in another room
    }
}

{
    creep.moveTo(new RoomPosition(25, 25, anotherRoomName.name));
}

////////
// Game.map.findRoute()

{
    const route = Game.map.findRoute(creep.room, anotherRoomName);

    if (route !== ERR_NO_PATH && route.length > 0) {
        console.log(`Now heading to room ${route[0].room}`);
        const exit = creep.pos.findClosestByRange(route[0].exit);
        creep.moveTo(exit);
    }
}

{
    const route = Game.map.findRoute(creep.room, anotherRoomName, {
        routeCallback(roomName, fromRoomName) {
            if (roomName === "W10S10") {
                // avoid this room
                return Infinity;
            }
            return 1;
        }
    });
}

{
    const from = new RoomPosition(25, 25, "E1N1");
    const to = new RoomPosition(25, 25, "E4N1");

    // Use `findRoute` to calculate a high-level plan for this path,
    // prioritizing highways and owned rooms
    const allowedRooms = { [from.roomName]: true };
    const route = Game.map.findRoute(from.roomName, to.roomName, {
        routeCallback(roomName) {
            const parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName);
            const isHighway = (parseInt(parsed[1], 10) % 10 === 0) ||
                (parseInt(parsed[2], 10) % 10 === 0);
            const isMyRoom = Game.rooms[roomName] &&
                Game.rooms[roomName].controller &&
                Game.rooms[roomName].controller.my;
            if (isHighway || isMyRoom) {
                return 1;
            } else {
                return 2.5;
            }
        }
    });

    if (route !== ERR_NO_PATH) {
        route.forEach((info) => {
            allowedRooms[info.room] = true;
        });
    }

    // Invoke PathFinder, allowing access only to rooms from `findRoute`
    const ret = PathFinder.search(from, to, {
        roomCallback(roomName) {
            if (allowedRooms[roomName] === undefined) {
                return false;
            }
        }
    });

    console.log(ret.path);
}

////////
// Game.map.getRoomLinearDistance(roomName1, roomName2, [continuous])

{
    Game.map.getRoomLinearDistance("W1N1", "W4N2"); // 3
    Game.map.getRoomLinearDistance("E65S55", "W65S55", false); // 131
    Game.map.getRoomLinearDistance("E65S55", "W65S55", true); // 11
}

////////
// Game.map.getTerrainAt(x, y, roomName)
// Game.map.getTerrainAt(pos)

{
    console.log(Game.map.getTerrainAt(25, 20, "W10N10"));
}

{
    console.log(Game.map.getTerrainAt(new RoomPosition(25, 20, "W10N10")));
}

////////
// Game.map.isRoomAvailable(roomName)

{
    if (Game.map.isRoomAvailable(room.name)) {
        creep.moveTo(room.getPositionAt(25, 25));
    }
}

////////
// Game.market

{
    // Game.market.calcTransactionCost(amount, roomName1, roomName2)
    const cost = Game.market.calcTransactionCost(1000, "W0N0", "W10N5");

    // Game.market.cancelOrder(orderId)
    for (const id in Game.market.orders) {
        Game.market.cancelOrder(id);
    }

    // Game.market.changeOrderPrice(orderId, newPrice)
    Game.market.changeOrderPrice("57bec1bf77f4d17c4c011960", 9.95);

    // Game.market.createOrder(type, resourceType, price, totalAmount, [roomName])
    Game.market.createOrder(ORDER_SELL, RESOURCE_GHODIUM, 9.95, 10000, "W1N1");

    // Game.market.deal(orderId, amount, [yourRoomName])
    Game.market.deal("57cd2b12cda69a004ae223a3", 1000, "W1N1");

    const amountToBuy = 2000;
    const maxTransferEnergyCost = 500;
    const orders = Game.market.getAllOrders({ type: ORDER_SELL, resourceType: RESOURCE_GHODIUM });

    for (const i of orders) {
        const transferEnergyCost = Game.market.calcTransactionCost(amountToBuy, "W1N1", i.roomName);

        if (transferEnergyCost < maxTransferEnergyCost) {
            Game.market.deal(i.id, amountToBuy, "W1N1");
            break;
        }
    }

    // Game.market.extendOrder(orderId, addAmount)
    Game.market.extendOrder("57bec1bf77f4d17c4c011960", 10000);

    // Game.market.getAllOrders([filter])
    Game.market.getAllOrders();
    Game.market.getAllOrders({ type: ORDER_SELL, resourceType: RESOURCE_GHODIUM });

    const targetRoom = "W1N1";
    Game.market.getAllOrders((currentOrder) => currentOrder.resourceType === RESOURCE_GHODIUM &&
        currentOrder.type === ORDER_SELL &&
        Game.market.calcTransactionCost(1000, targetRoom, currentOrder.roomName) < 500);

    // Game.market.getOrderById(id)
    const order = Game.market.getOrderById("55c34a6b5be41a0a6e80c123");
}

////////
// PathFinder

{
    const pfCreep = Game.creeps.John;

    const goals = pfCreep.room.find(FIND_SOURCES).map((source) => {
        // We can't actually walk on sources-- set `range` to 1
        // so we path next to it.
        return { pos: source.pos, range: 1 };
    });

    const ret = PathFinder.search(
        pfCreep.pos, goals,
        {
            // We need to set the defaults costs higher so that we
            // can set the road cost lower in `roomCallback`
            plainCost: 2,
            swampCost: 10,

            roomCallback(roomName) {

                const curRoom = Game.rooms[roomName];
                // In this example `room` will always exist, but since
                // PathFinder supports searches which span multiple rooms
                // you should be careful!
                if (!curRoom) {
                    return;
                }
                const costs = new PathFinder.CostMatrix();

                curRoom.find(FIND_STRUCTURES).forEach((struct) => {
                    if (struct.structureType === STRUCTURE_ROAD) {
                        // Favor roads over plain tiles
                        costs.set(struct.pos.x, struct.pos.y, 1);
                    } else if (struct.structureType !== STRUCTURE_CONTAINER &&
                        (struct.structureType !== STRUCTURE_RAMPART ||
                            !(struct as OwnedStructure).my)) {
                        // Can't walk through non-walkable buildings
                        costs.set(struct.pos.x, struct.pos.y, 0xff);
                    }
                });

                // Avoid creeps in the room
                curRoom.find(FIND_CREEPS).forEach((thisCreep) => {
                    costs.set(thisCreep.pos.x, thisCreep.pos.y, 0xff);
                });

                return costs;
            },
        }
    );

    const pos = ret.path[0];
    pfCreep.move(pfCreep.pos.getDirectionTo(pos));
}

////////
// RawMemory

{
    // RawMemory.segments

    RawMemory.setActiveSegments([0, 3]);
    // on the next tick
    console.log(RawMemory.segments[0]);
    console.log(RawMemory.segments[3]);
    RawMemory.segments[3] = '{"foo": "bar", "counter": 15}';

    // RawMemory.foreignSegment

    RawMemory.setActiveForeignSegment("player");
    // on the next tick
    console.log(RawMemory.foreignSegment);
    // --> {"username": "player", "id": 40, "data": "Hello!"}

    // RawMemory.interShardSegment

    RawMemory.interShardSegment = JSON.stringify({
        creeps: {
            Bob: {role: "claimer"}
        }
    });

    // on another shard
    const interShardData = JSON.parse(RawMemory.interShardSegment);
    if (interShardData.creeps[creep.name]) {
        creep.memory = interShardData[creep.name];
        delete interShardData.creeps[creep.name];
    }
    RawMemory.interShardSegment = JSON.stringify(interShardData);

    // RawMemory.get()
    const myMemory = JSON.parse(RawMemory.get());

    // RawMemory.set(value)
    RawMemory.set(JSON.stringify(myMemory));

    // RawMemory.setActiveSegments(ids)
    RawMemory.setActiveSegments([0, 3]);

    // RawMemory.setActiveForeignSegment(username, [id])
    RawMemory.setActiveForeignSegment("player");
    RawMemory.setActiveForeignSegment("player", 10);
    RawMemory.setActiveForeignSegment(null);

    // RawMemory.setDefaultPublicSegment(id)
    RawMemory.setPublicSegments([5, 20, 21]);
    RawMemory.setDefaultPublicSegment(5);
    RawMemory.setDefaultPublicSegment(null);

    // RawMemory.setPublicSegments(ids)
    RawMemory.setPublicSegments([5, 3]);
    RawMemory.setPublicSegments([]);
}

////////
// Creep

{
    // creep.carry
    const total = creep.carry;

    // creep.memory
    creep.memory.task = "building";

    // creep.attack(target)
    const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (target) {
        if (creep.attack(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
    }

    // creep.attackController(target)
    if (creep.room.controller && !creep.room.controller.my) {
        if (creep.attackController(creep.room.controller) === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }
    }

    // creep.build(target)
    const buildTarget = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
    if (target) {
        if (creep.build(buildTarget) === ERR_NOT_IN_RANGE) {
            creep.moveTo(buildTarget);
        }
    }

    // creep.cancelOrder(methodName)
    creep.move(LEFT);
    creep.cancelOrder("move");
    // The creep will not move in this game tick

    // creep.claimController(target)
    if (creep.room.controller) {
        if (creep.claimController(creep.room.controller) === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }
    }

    // creep.dismantle(target)
    const dismantleTarget = creep.pos.findClosestByRange<StructureWall>(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType === STRUCTURE_WALL
    });
    if (dismantleTarget) {
        if (creep.dismantle(dismantleTarget) === ERR_NOT_IN_RANGE) {
            creep.moveTo(dismantleTarget);
        }
    }

    // creep.drop(resourceType, [amount])
    creep.drop(RESOURCE_ENERGY);
    for (const resourceType in creep.carry) {
        creep.drop(resourceType as ResourceConstant);
    }

    // creep.generateSafeMode(controller)
    if (creep.generateSafeMode(creep.room.controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller);
    }

    // creep.getActiveBodyparts(type)
    const abpTarget = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
        filter: (object) => object.getActiveBodyparts(ATTACK) === 0
    });
    if (abpTarget) {
        creep.moveTo(abpTarget);
    }

    // creep.harvest(target)
    const harvestTarget = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
    if (harvestTarget) {
        if (creep.harvest(harvestTarget) === ERR_NOT_IN_RANGE) {
            creep.moveTo(harvestTarget);
        }
    }

    // creep.heal(target)
    const healTarget = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
        filter: (object) => {
            return object.hits < object.hitsMax;
        }
    });
    if (healTarget) {
        if (creep.heal(healTarget) === ERR_NOT_IN_RANGE) {
            creep.moveTo(healTarget);
        }
    }

    // creep.move(direction)
    creep.move(RIGHT);
    const movePath = creep.pos.findPathTo(Game.flags.Flag1);
    if (movePath.length > 0) {
        creep.move(movePath[0].direction);
    }

    // creep.moveByPath(path)
    const source = room.find(FIND_SOURCES_ACTIVE)[0];
    const path = spawn.room.findPath(spawn.pos, source.pos);
    creep.moveByPath(path);

    // creep.moveTo(x, y, [opts])
    //             (target, [opts])
    const pos = new RoomPosition(25, 20, "W10N5");
    creep.moveTo(10, 20);
    creep.moveTo(Game.flags.Flag1);
    creep.moveTo(pos);
    creep.moveTo(pos, {reusePath: 50});
    // Execute moves by cached paths at first
    for (const name in Game.creeps) {
        Game.creeps[name].moveTo(target, {noPathFinding: true});
    }

    // Perform pathfinding only if we have enough CPU
    if (Game.cpu.tickLimit - Game.cpu.getUsed() > 20) {
        for (const name in Game.creeps) {
            Game.creeps[name].moveTo(target);
        }
    }

    // creep.notifyWhenAttacked(enabled)
    if (creep.memory.role === "scout") {
        creep.notifyWhenAttacked(false);
    } else {
        creep.notifyWhenAttacked(true);
    }

    // creep.pickup(target)
    const pickupTarget = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
    if (target) {
        if (creep.pickup(pickupTarget) === ERR_NOT_IN_RANGE) {
            creep.moveTo(pickupTarget);
        }
    }

    // creep.rangedAttack(target)
    const rangedAttackTargets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
    if (rangedAttackTargets.length > 0) {
        creep.rangedAttack(rangedAttackTargets[0]);
    }

    // creep.rangedHeal(target)
    const rangedHealTarget = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
        filter: (object) => {
            return object.hits < object.hitsMax;
        }
    });
    if (rangedHealTarget) {
        creep.moveTo(rangedHealTarget);
        if (creep.pos.isNearTo(rangedHealTarget)) {
            creep.heal(rangedHealTarget);
        } else {
            creep.rangedHeal(rangedHealTarget);
        }
    }

    creep.rangedMassAttack();
    const rangedMassAttackTargets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
    if (rangedMassAttackTargets.length > 0) {
        creep.rangedMassAttack();
    }

    // creep.repair(target)
    const repairTargets = creep.room.find(FIND_STRUCTURES, {
        filter: (object) => object.hits < object.hitsMax
    });

    repairTargets.sort((a, b) => a.hits - b.hits);

    if (repairTargets.length > 0) {
        if (creep.repair(repairTargets[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(repairTargets[0]);
        }
    }

    // creep.reserveController(target)
    if (creep.room.controller) {
        if (creep.reserveController(creep.room.controller) === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }
    }

    // creep.say(message, [public])
    const hostiles = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 10);
    if (hostiles.length > 0) {
        creep.say("OMG!😨");
        creep.moveTo(Game.spawns["Spawn1"]);
    } else {
        // noop
    }

    // creep.signController(target, text)
    if (creep.room.controller) {
        if (creep.signController(creep.room.controller, "I'm going to claim this room in a few days. I warned ya!") === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }
    }

    // creep.transfer(target, resourceType, [amount])
    const storage = room.find<StructureStorage>(FIND_MY_STRUCTURES, {
        filter: (structure) => structure.structureType === STRUCTURE_STORAGE
    })[0];
    if (creep.transfer(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(storage);
    }

    for (const resourceType in creep.carry) {
        creep.transfer(storage, resourceType as ResourceConstant);
    }

    // creep.upgradeController(target)
    if (creep.room.controller) {
        if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }
    }

    // creep.withdraw(target, resourceType, [amount])
    if (creep.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(storage);
    }
}

////////
// Find Overloads

{
    const creeps = room.find(FIND_HOSTILE_CREEPS);
    creeps[0].say(creeps[1].name);

    const flags = room.find(FIND_FLAGS);
    flags[0].remove();

    const spawns = room.find(FIND_HOSTILE_SPAWNS);
    spawns[0].spawning;

    const sources = room.find(FIND_SOURCES);
    sources[0].ticksToRegeneration;

    const resources = room.find(FIND_DROPPED_RESOURCES);
    resources[0].resourceType;

    const energy = room.find(FIND_DROPPED_ENERGY);
    energy[0].resourceType;

    const sites = room.find(FIND_CONSTRUCTION_SITES);
    sites[0].remove();

    // Should have type (_HasRoomPosition | RoomPosition)[]
    const exits = room.find(FIND_EXIT);

    const creepsHere = room.lookForAt(LOOK_CREEPS, 10, 10);
    creepsHere[0].getActiveBodyparts(ATTACK);

    const towers = room.find<StructureTower>(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_TOWER);
        }
    });
    towers[0].attack(creeps[0]);
}

////////
// RoomPosition Finds

{
    // Should have type Creep
    const hostileCreep = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

    creep.say(hostileCreep.name);

    const tower = creep.pos.findClosestByPath<StructureTower>(FIND_HOSTILE_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType === STRUCTURE_TOWER;
        }
    });

    tower.attack(creep);

    const rampart = creep.pos.findClosestByRange<StructureRampart>(FIND_HOSTILE_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType === STRUCTURE_RAMPART;
        }
    });

    rampart.isPublic;

    // Should have type Creep[]
    const hostileCreeps = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 10);
    hostileCreeps[0].saying;

    const labs = creep.pos.findInRange<StructureLab>(FIND_MY_STRUCTURES, 4, {
        filter: (structure) => {
            return structure.structureType === STRUCTURE_LAB;
        }
    });

    labs[0].boostCreep(creep);
}

////////
// LookAt Finds

{
    const nukes = room.lookForAt(LOOK_NUKES, creep.pos);

    nukes[0].launchRoomName;

    const flags = room.lookForAtArea(LOOK_FLAGS, 10, 10, 20, 20);

    const x = flags[10];
    const y = x[11];
    const entry = y[0];
    entry.flag.remove();

    const creeps = room.lookForAtArea(LOOK_CREEPS, 10, 10, 20, 20, true);

    creeps[0].x;
    creeps[0].y;
    creeps[0].creep.move(TOP);
}
