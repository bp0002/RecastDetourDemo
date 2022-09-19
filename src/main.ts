import { Vector3 } from "./BABYLON/Maths/math.vector";
import { IAgentParameters, ICrowd, INavigationEnginePlugin, RecastJSPlugin, Scene, TransformNode } from "./BABYLON/Navigation/index";
import * as Recast from "./recast";
import { data } from "./testdata";

export interface TestInfo {
    index: number;
    transform: TransformNode;
}

export interface TestPathInfo {
    index: number;
    paths: Vector3[];
}

Recast().then((recast: any) => {

let navigationPlugin = new RecastJSPlugin(recast);
navigationPlugin.buildFromNavmeshData(data);

let scene = new Scene();

var crowd = navigationPlugin.createCrowd(10, 0.1, scene);
var agentParams = {
    radius: 0.1,
    height: 0.2,
    maxAcceleration: 4.0,
    maxSpeed: 1.0,
    collisionQueryRange: 0.5,
    pathOptimizationRange: 0.0,
    separationWeight: 1.0
};

var agentInfos: TestInfo[] = [];

// 随机一个起点
var testStartPos = navigationPlugin.getRandomPointAround(new Vector3(-2.0, 0.1, -1.8), 0.5);
// 随机一个终点
var testEndPos = new Vector3(4.4002206448242775, 1.385240415559657, 15.584022078598117);
// 创建一个操作目标节点
var transform = new TransformNode();
// 计算出路径
let path01 = path(navigationPlugin, crowd, agentParams, transform, testStartPos, testEndPos);
console.log("Path:");
console.log(path01);
// 操作节点记录到数组
agentInfos.push({
    index: path01.index,
    transform: transform,
});

function path(navigationPlugin: INavigationEnginePlugin, crowd: ICrowd, agentParams: IAgentParameters, transform: TransformNode, start: Vector3, end: Vector3): TestPathInfo {
    var agentIndex = crowd.addAgent(start, agentParams, transform);
    crowd.agentGoto(agentIndex, navigationPlugin.getClosestPoint(end));
    var paths = navigationPlugin.computePath(crowd.getAgentPosition(agentIndex), navigationPlugin.getClosestPoint(end));
    return {
        index: agentIndex,
        paths,
    };
}

// function frame(crowd: ICrowd, agentInfos: TestInfo[]) {
//     for (let i = 0; i < agentInfos.length; i++) {
//         let info = agentInfos[i];
//         let agentIndex = info.index;
//         let transform = info.transform;

//         let position = crowd.getAgentPosition(agentIndex);
//         let vel = crowd.getAgentVelocity(agentIndex);

//         transform.position.copyFrom(position);
//         if (vel.length() > 0.2) {
//             vel.normalize();
//             var desiredRotation = Math.atan2(vel.x, vel.z);
//             transform.rotation.y = transform.rotation.y + (desiredRotation - transform.rotation.y) * 0.05;
//         }
//     }
// }

function run() {
    // // scene 动画触发
    // scene.onBeforeAnimationsObservable.notifyObservers(scene);
    // 手动调用 - 固定 16 ms
    crowd.update(16 / 1000);

    // update 只更新 transform.position
    for (let i = 0; i < agentInfos.length; i++) {
        let info = agentInfos[i];
        let agentIndex = info.index;
        let transform = info.transform;
        let vel = crowd.getAgentVelocity(agentIndex);
        if (vel.length() > 0.2) {
            vel.normalize();
            var desiredRotation = Math.atan2(vel.x, vel.z);
            transform.rotation.y = transform.rotation.y + (desiredRotation - transform.rotation.y) * 0.05;
        }

        console.log(`Position: ${transform.position.x}, ${transform.position.y}, ${transform.position.z}, Rotation: ${transform.rotation.x}, ${transform.rotation.y}, ${transform.rotation.z}`);
    }

    requestAnimationFrame(run);
}

requestAnimationFrame(run);

});