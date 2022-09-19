import { Vector3 } from "./BABYLON/Maths/math.vector";
import { TransformNode } from "./BABYLON/Navigation/index";
export interface TestInfo {
    index: number;
    transform: TransformNode;
}
export interface TestPathInfo {
    index: number;
    paths: Vector3[];
}
