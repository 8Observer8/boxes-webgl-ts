import { mat4, quat, vec3 } from "gl-matrix";
import { gl } from "./WebGLContext";

export default class Box
{
    private _position: vec3;
    private _q: quat;
    private _size: vec3;
    private _color: vec3;

    private _projViewMatrix: mat4;
    private _modelMatrix = mat4.create();
    private _normalMatrix = mat4.create();
    private _mvpMatrix = mat4.create();

    private _uColorLocation: WebGLUniformLocation;
    private _uMvpMatrixLocation: WebGLUniformLocation;
    private _uModelMatrixLocation: WebGLUniformLocation;
    private _uNormalMatrixLocation: WebGLUniformLocation;

    public constructor(position: vec3, q: quat, size: vec3,
        program: WebGLProgram, projViewMatrix: mat4, color: vec3)
    {
        this._position = position;
        this._q = q;
        this._size = size;
        this._color = color;

        this._projViewMatrix = projViewMatrix;
        this._uColorLocation = gl.getUniformLocation(program, "uColor");
        this._uMvpMatrixLocation = gl.getUniformLocation(program, "uMvpMatrix");
        this._uModelMatrixLocation = gl.getUniformLocation(program, "uModelMatrix");
        this._uNormalMatrixLocation = gl.getUniformLocation(program, "uNormalMatrix");
    }

    public draw(): void
    {
        mat4.fromRotationTranslationScale(this._modelMatrix, this._q, this._position, this._size);
        gl.uniformMatrix4fv(this._uModelMatrixLocation, false, this._modelMatrix);
        mat4.invert(this._normalMatrix, this._modelMatrix);
        mat4.transpose(this._normalMatrix, this._normalMatrix);
        gl.uniformMatrix4fv(this._uNormalMatrixLocation, false, this._normalMatrix);
        mat4.mul(this._mvpMatrix, this._projViewMatrix, this._modelMatrix);
        gl.uniformMatrix4fv(this._uMvpMatrixLocation, false, this._mvpMatrix);
        gl.uniform3fv(this._uColorLocation, this._color);
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0);
    }
}
