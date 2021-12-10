import { gl } from "./WebGLContext";

export default class ShaderProgram
{
    public static create(): WebGLProgram
    {
        const vertShaderSource =
            `attribute vec4 aPosition;
            attribute vec4 aNormal;
            uniform mat4 uMvpMatrix;
            uniform mat4 uModelMatrix;
            uniform mat4 uNormalMatrix;
            varying vec3 vPosition;
            varying vec3 vNormal;
            void main()
            {
                gl_Position = uMvpMatrix * aPosition;
                vPosition = vec3(uModelMatrix * aPosition);
                vNormal = normalize(vec3(uNormalMatrix * aNormal));
            }`;

        const fragShaderSource =
            `precision mediump float;
            const vec3 lightColor = vec3(1.0, 1.0, 1.0);
            const vec3 ambientLight = vec3(0.2, 0.2, 0.2);
            uniform vec3 uColor;
            uniform vec3 uLightPosition;
            varying vec3 vPosition;
            varying vec3 vNormal;
            void main()
            {
                vec4 color = vec4(uColor, 1.0);
                vec3 normal = normalize(vNormal);
                vec3 lightDirection = normalize(uLightPosition - vPosition);
                float nDotL = max(dot(lightDirection, normal), 0.0);
                vec3 diffuse = lightColor * color.rgb * nDotL;
                vec3 ambient = ambientLight * color.rgb;
                gl_FragColor = vec4(diffuse + ambient, color.a);
            }`;

        const vShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vShader, vertShaderSource);
        gl.compileShader(vShader);
        let ok = gl.getShaderParameter(vShader, gl.COMPILE_STATUS);
        if (!ok) { console.log("vert: " + gl.getShaderInfoLog(vShader)); return null; };

        const fShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fShader, fragShaderSource);
        gl.compileShader(fShader);
        ok = gl.getShaderParameter(vShader, gl.COMPILE_STATUS);
        if (!ok) { console.log("frag: " + gl.getShaderInfoLog(fShader)); return null; };

        const program = gl.createProgram();
        gl.attachShader(program, vShader);
        gl.attachShader(program, fShader);
        gl.linkProgram(program);
        ok = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (!ok) { console.log("link: " + gl.getProgramInfoLog(program)); return null; };
        gl.useProgram(program);

        return program;
    }
}
