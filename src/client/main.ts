import { mat4, vec3 } from "gl-matrix";
import Box from "./Box";
import ShaderProgram from "./ShaderProgram";
import VertexBuffers from "./VertexBuffers";
import { gl, WebGLContext } from "./WebGLContext";

let ground: Box;
let crate1: Box;
let crate2: Box;

function main()
{
    if (!WebGLContext.init("renderCanvas")) return;
    gl.enable(gl.DEPTH_TEST);

    const program = ShaderProgram.create();
    VertexBuffers.init(program);

    const projMatrix = mat4.create();
    mat4.perspective(projMatrix, 55 * Math.PI / 180, 1, 0.1, 500);
    // mat4.ortho(projMatrix, -5, 5, -5, 5, 100, -100);
    const viewMatrix = mat4.create();
    mat4.lookAt(viewMatrix, [4, 5, 10], [0, 0, 0], [0, 1, 0]);
    const projViewMatrix = mat4.create();
    mat4.mul(projViewMatrix, projMatrix, viewMatrix);

    const lightPosition = vec3.fromValues(8, 9, 10);
    const uLightPositionLocation = gl.getUniformLocation(program, "uLightPosition");
    gl.uniform3fv(uLightPositionLocation, lightPosition);

    ground = new Box([0, -1, 0], [0, 0, 0, 1], [7, 1, 7],
        program, projViewMatrix, [0.5, 1.0, 0.5]);
    crate1 = new Box([-1, 0, 0], [0, 0, 0, 1], [1, 1, 1],
        program, projViewMatrix, [0.396, 0.235, 0.745]);
    crate2 = new Box([1, 0, 0], [0, 0, 0, 1], [1, 1, 1],
        program, projViewMatrix, [0.745, 0.235, 0.470]);

    gl.clearColor(0.2, 0.2, 0.2, 1);
    draw();
}

function draw(): void
{
    // requestAnimationFrame(() => draw());
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    ground.draw();
    crate1.draw();
    crate2.draw();
}

// Debug
main();

// Release
// window.onload = () => main();
