export let gl: WebGLRenderingContext;

export class WebGLContext
{
    public static init(canvasName: string): boolean
    {
        const canvas = document.getElementById(canvasName) as HTMLCanvasElement;
        if (!canvas)
        {
            console.log("Failed to get the HTML5 canvas element");
            return false;
        }

        const options: WebGLContextAttributes = {
            alpha: false, premultipliedAlpha: false
        }
        gl = (canvas as HTMLCanvasElement).getContext("webgl", options);

        if (!gl)
        {
            console.log("Failed to get WebGL 1.0 rendering context");
            return false;
        }

        return true;
    }
}
