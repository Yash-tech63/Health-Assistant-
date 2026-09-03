"use client";

import React, { useEffect, useRef } from "react";

/* =========================================================
   COLOR PARSER
   Supports:
   - #fff
   - #ffffff
   - rgb(255, 255, 255)
   - rgba(255, 255, 255, 0.5)
========================================================= */

function parseColorToRGB(colorStr) {
    if (!colorStr || typeof colorStr !== "string") {
        return [1, 1, 1];
    }

    const color = colorStr.trim();

    // HEX FORMAT
    if (color.startsWith("#")) {
        let hex = color.slice(1);

        if (hex.length === 3) {
            hex = hex
                .split("")
                .map((char) => char + char)
                .join("");
        }

        if (hex.length === 6) {
            const num = parseInt(hex, 16);

            if (!Number.isNaN(num)) {
                return [
                    ((num >> 16) & 255) / 255,
                    ((num >> 8) & 255) / 255,
                    (num & 255) / 255,
                ];
            }
        }
    }

    // RGB / RGBA FORMAT
    const rgbMatch = color.match(
        /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/
    );

    if (rgbMatch) {
        return [
            Math.min(255, Math.max(0, Number(rgbMatch[1]))) / 255,
            Math.min(255, Math.max(0, Number(rgbMatch[2]))) / 255,
            Math.min(255, Math.max(0, Number(rgbMatch[3]))) / 255,
        ];
    }

    return [1, 1, 1];
}

/* =========================================================
   VERTEX SHADER
   WebGL 1 Compatible
========================================================= */

const VERTEX_SHADER_SOURCE = `
attribute vec2 a_position;

void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

/* =========================================================
   FRAGMENT SHADER
   WebGL 1 Compatible
========================================================= */

const FRAGMENT_SHADER_SOURCE = `
precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_speed;
uniform float u_count;

uniform vec3 u_cloudColor;
uniform vec3 u_skyTopColor;
uniform vec3 u_skyBottomColor;


/* RANDOM HASH */

float hash(vec2 p) {
    return fract(
        sin(
            dot(
                p,
                vec2(127.1, 311.7)
            )
        ) * 43758.5453123
    );
}


/* VALUE NOISE */

float noise(vec2 p) {

    vec2 i = floor(p);

    vec2 f = fract(p);

    f = f * f * (3.0 - 2.0 * f);

    float a = hash(i);

    float b = hash(
        i + vec2(1.0, 0.0)
    );

    float c = hash(
        i + vec2(0.0, 1.0)
    );

    float d = hash(
        i + vec2(1.0, 1.0)
    );

    return mix(
        mix(a, b, f.x),
        mix(c, d, f.x),
        f.y
    );
}


/* FRACTIONAL BROWNIAN MOTION */

float fbm(vec2 p) {

    float value = 0.0;

    float amplitude = 0.5;

    // Fixed loop count for WebGL 1 compatibility
    for (int i = 0; i < 5; i++) {

        value += amplitude * noise(p);

        p *= 2.0;

        amplitude *= 0.5;
    }

    return value;
}


/* MAIN */

void main() {

    // Prevent division by zero
    vec2 resolution = max(
        u_resolution,
        vec2(1.0)
    );

    vec2 uv =
        gl_FragCoord.xy /
        resolution.xy;


    /* ASPECT RATIO */

    float aspect =
        resolution.x /
        resolution.y;

    vec2 cloudUV =
        uv;

    cloudUV.x *= aspect;


    /* SKY GRADIENT */

    vec3 skyColor = mix(
        u_skyBottomColor,
        u_skyTopColor,
        uv.y
    );


    /* ANIMATION */

    float animationTime =
        u_time *
        u_speed;

    vec2 movement =
        vec2(
            animationTime * 0.05,
            animationTime * 0.015
        );


    /* CLOUD SCALE */

    float cloudScale =
        1.2 +
        (u_count * 0.35);


    vec2 cloudPosition =
        cloudUV *
        cloudScale +
        movement;


    /* CLOUD NOISE */

    float cloudNoise =
        fbm(
            cloudPosition
        );


    float detailNoise =
        fbm(
            cloudPosition * 0.65 +
            vec2(12.0, 8.0)
        );


    cloudNoise +=
        detailNoise *
        0.35;


    cloudNoise *=
        0.8;


    /* CLOUD MASK */

    float cloudMask =
        smoothstep(
            0.30,
            0.72,
            cloudNoise
        );


    cloudMask *=
        0.85;


    /* FINAL COLOR */

    vec3 finalColor =
        mix(
            skyColor,
            u_cloudColor,
            cloudMask
        );


    gl_FragColor =
        vec4(
            finalColor,
            1.0
        );
}
`;


/* =========================================================
   CLOUD SHADER COMPONENT
========================================================= */

export const CloudShader = ({
    speed = 0.5,
    count = 3,
    cloudColor = "#ffffff",
    skyTopColor = "#fce7f3",
    skyBottomColor = "#ffffff",
    className = "",
    children,
}) => {
    const containerRef = useRef(null);

    const canvasRef = useRef(null);

    const animationFrameRef = useRef(null);


    /* =====================================================
       WEBGL SETUP
    ===================================================== */

    useEffect(() => {
        const canvas = canvasRef.current;

        const container = containerRef.current;

        if (!canvas || !container) {
            return undefined;
        }


        /* WEBGL CONTEXT */

        const gl = canvas.getContext("webgl", {
            alpha: false,
            antialias: true,
            preserveDrawingBuffer: false,
        });


        if (!gl) {
            console.warn(
                "CloudShader: WebGL is not supported by this browser."
            );

            return undefined;
        }


        let destroyed = false;


        /* =================================================
           REDUCED MOTION
        ================================================= */

        const mediaQuery = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

        let isReducedMotion =
            mediaQuery.matches;


        const handleMotionChange = (event) => {
            isReducedMotion =
                event.matches;
        };


        if (typeof mediaQuery.addEventListener === "function") {
            mediaQuery.addEventListener(
                "change",
                handleMotionChange
            );
        } else if (typeof mediaQuery.addListener === "function") {
            mediaQuery.addListener(
                handleMotionChange
            );
        }


        /* =================================================
           CREATE SHADER FUNCTION
        ================================================= */

        const createShader = (
            type,
            source
        ) => {
            const shader =
                gl.createShader(type);


            if (!shader) {
                console.error(
                    "CloudShader: Failed to create shader."
                );

                return null;
            }


            gl.shaderSource(
                shader,
                source
            );


            gl.compileShader(
                shader
            );


            const compiled =
                gl.getShaderParameter(
                    shader,
                    gl.COMPILE_STATUS
                );


            if (!compiled) {
                const error =
                    gl.getShaderInfoLog(
                        shader
                    );


                console.group(
                    "CloudShader Compile Error"
                );

                console.error(
                    type === gl.VERTEX_SHADER
                        ? "VERTEX SHADER ERROR"
                        : "FRAGMENT SHADER ERROR"
                );

                console.error(
                    error ||
                    "Unknown shader compile error"
                );

                console.log(
                    "Shader source:"
                );

                console.log(
                    source
                );

                console.groupEnd();


                gl.deleteShader(
                    shader
                );

                return null;
            }


            return shader;
        };


        /* =================================================
           COMPILE SHADERS
        ================================================= */

        const vertexShader =
            createShader(
                gl.VERTEX_SHADER,
                VERTEX_SHADER_SOURCE
            );


        if (!vertexShader) {
            return undefined;
        }


        const fragmentShader =
            createShader(
                gl.FRAGMENT_SHADER,
                FRAGMENT_SHADER_SOURCE
            );


        if (!fragmentShader) {
            gl.deleteShader(
                vertexShader
            );

            return undefined;
        }


        /* =================================================
           CREATE PROGRAM
        ================================================= */

        const program =
            gl.createProgram();


        if (!program) {
            gl.deleteShader(
                vertexShader
            );

            gl.deleteShader(
                fragmentShader
            );

            return undefined;
        }


        gl.attachShader(
            program,
            vertexShader
        );


        gl.attachShader(
            program,
            fragmentShader
        );


        gl.linkProgram(
            program
        );


        const linked =
            gl.getProgramParameter(
                program,
                gl.LINK_STATUS
            );


        if (!linked) {
            const error =
                gl.getProgramInfoLog(
                    program
                );


            console.error(
                "CloudShader Program Link Error:",
                error ||
                "Unknown program link error"
            );


            gl.deleteProgram(
                program
            );

            gl.deleteShader(
                vertexShader
            );

            gl.deleteShader(
                fragmentShader
            );

            return undefined;
        }


        gl.useProgram(
            program
        );


        /* =================================================
           FULLSCREEN QUAD BUFFER
        ================================================= */

        const positionBuffer =
            gl.createBuffer();


        if (!positionBuffer) {
            console.error(
                "CloudShader: Failed to create buffer."
            );

            gl.deleteProgram(
                program
            );

            gl.deleteShader(
                vertexShader
            );

            gl.deleteShader(
                fragmentShader
            );

            return undefined;
        }


        gl.bindBuffer(
            gl.ARRAY_BUFFER,
            positionBuffer
        );


        const positions =
            new Float32Array([
                -1.0, -1.0,
                1.0, -1.0,
                -1.0, 1.0,

                -1.0, 1.0,
                1.0, -1.0,
                1.0, 1.0,
            ]);


        gl.bufferData(
            gl.ARRAY_BUFFER,
            positions,
            gl.STATIC_DRAW
        );


        /* =================================================
           POSITION ATTRIBUTE
        ================================================= */

        const positionLocation =
            gl.getAttribLocation(
                program,
                "a_position"
            );


        if (positionLocation === -1) {
            console.error(
                "CloudShader: a_position attribute not found."
            );

            gl.deleteBuffer(
                positionBuffer
            );

            gl.deleteProgram(
                program
            );

            return undefined;
        }


        gl.enableVertexAttribArray(
            positionLocation
        );


        gl.vertexAttribPointer(
            positionLocation,
            2,
            gl.FLOAT,
            false,
            0,
            0
        );


        /* =================================================
           UNIFORM LOCATIONS
        ================================================= */

        const uniforms = {
            resolution:
                gl.getUniformLocation(
                    program,
                    "u_resolution"
                ),

            time:
                gl.getUniformLocation(
                    program,
                    "u_time"
                ),

            speed:
                gl.getUniformLocation(
                    program,
                    "u_speed"
                ),

            count:
                gl.getUniformLocation(
                    program,
                    "u_count"
                ),

            cloudColor:
                gl.getUniformLocation(
                    program,
                    "u_cloudColor"
                ),

            skyTopColor:
                gl.getUniformLocation(
                    program,
                    "u_skyTopColor"
                ),

            skyBottomColor:
                gl.getUniformLocation(
                    program,
                    "u_skyBottomColor"
                ),
        };


        /* =================================================
           PARSE COLORS
        ================================================= */

        const cloudRGB =
            parseColorToRGB(
                cloudColor
            );


        const skyTopRGB =
            parseColorToRGB(
                skyTopColor
            );


        const skyBottomRGB =
            parseColorToRGB(
                skyBottomColor
            );


        /* =================================================
           RESIZE CANVAS
        ================================================= */

        const resizeCanvas = () => {
            if (
                destroyed ||
                !container ||
                !canvas
            ) {
                return;
            }


            const rect =
                container.getBoundingClientRect();


            const dpr =
                Math.min(
                    window.devicePixelRatio || 1,
                    2
                );


            const width =
                Math.max(
                    1,
                    Math.floor(
                        rect.width * dpr
                    )
                );


            const height =
                Math.max(
                    1,
                    Math.floor(
                        rect.height * dpr
                    )
                );


            if (
                canvas.width !== width ||
                canvas.height !== height
            ) {
                canvas.width =
                    width;

                canvas.height =
                    height;

                gl.viewport(
                    0,
                    0,
                    width,
                    height
                );
            }
        };


        /* =================================================
           RESIZE OBSERVER
        ================================================= */

        let resizeObserver = null;


        if (
            typeof ResizeObserver !==
            "undefined"
        ) {
            resizeObserver =
                new ResizeObserver(
                    resizeCanvas
                );


            resizeObserver.observe(
                container
            );

        } else {
            window.addEventListener(
                "resize",
                resizeCanvas
            );
        }


        resizeCanvas();


        /* =================================================
           ANIMATION
        ================================================= */

        const startTime =
            performance.now();


        const render = (now) => {
            if (destroyed) {
                return;
            }


            resizeCanvas();


            const elapsedTime =
                (now - startTime) /
                1000;


            gl.useProgram(
                program
            );


            gl.bindBuffer(
                gl.ARRAY_BUFFER,
                positionBuffer
            );


            gl.enableVertexAttribArray(
                positionLocation
            );


            gl.vertexAttribPointer(
                positionLocation,
                2,
                gl.FLOAT,
                false,
                0,
                0
            );


            /* RESOLUTION */

            if (uniforms.resolution) {
                gl.uniform2f(
                    uniforms.resolution,
                    canvas.width,
                    canvas.height
                );
            }


            /* TIME */

            if (uniforms.time) {
                gl.uniform1f(
                    uniforms.time,
                    isReducedMotion
                        ? 0
                        : elapsedTime
                );
            }


            /* SPEED */

            if (uniforms.speed) {
                gl.uniform1f(
                    uniforms.speed,
                    Number(speed) || 0.5
                );
            }


            /* COUNT */

            if (uniforms.count) {
                const safeCount =
                    Math.min(
                        6,
                        Math.max(
                            1,
                            Number(count) || 3
                        )
                    );


                gl.uniform1f(
                    uniforms.count,
                    safeCount
                );
            }


            /* CLOUD COLOR */

            if (uniforms.cloudColor) {
                gl.uniform3f(
                    uniforms.cloudColor,
                    cloudRGB[0],
                    cloudRGB[1],
                    cloudRGB[2]
                );
            }


            /* SKY TOP COLOR */

            if (uniforms.skyTopColor) {
                gl.uniform3f(
                    uniforms.skyTopColor,
                    skyTopRGB[0],
                    skyTopRGB[1],
                    skyTopRGB[2]
                );
            }


            /* SKY BOTTOM COLOR */

            if (uniforms.skyBottomColor) {
                gl.uniform3f(
                    uniforms.skyBottomColor,
                    skyBottomRGB[0],
                    skyBottomRGB[1],
                    skyBottomRGB[2]
                );
            }


            /* DRAW */

            gl.drawArrays(
                gl.TRIANGLES,
                0,
                6
            );


            animationFrameRef.current =
                requestAnimationFrame(
                    render
                );
        };


        animationFrameRef.current =
            requestAnimationFrame(
                render
            );


        /* =================================================
           CLEANUP
        ================================================= */

        return () => {
            destroyed = true;


            if (
                animationFrameRef.current !==
                null
            ) {
                cancelAnimationFrame(
                    animationFrameRef.current
                );

                animationFrameRef.current =
                    null;
            }


            if (resizeObserver) {
                resizeObserver.disconnect();
            } else {
                window.removeEventListener(
                    "resize",
                    resizeCanvas
                );
            }


            if (
                typeof mediaQuery.removeEventListener ===
                "function"
            ) {
                mediaQuery.removeEventListener(
                    "change",
                    handleMotionChange
                );

            } else if (
                typeof mediaQuery.removeListener ===
                "function"
            ) {
                mediaQuery.removeListener(
                    handleMotionChange
                );
            }


            try {
                gl.deleteBuffer(
                    positionBuffer
                );

                gl.deleteProgram(
                    program
                );

                gl.deleteShader(
                    vertexShader
                );

                gl.deleteShader(
                    fragmentShader
                );

            } catch (error) {
                console.warn(
                    "CloudShader cleanup error:",
                    error
                );
            }
        };

    }, [
        speed,
        count,
        cloudColor,
        skyTopColor,
        skyBottomColor,
    ]);


    /* =====================================================
       JSX
    ===================================================== */

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden ${className}`}
        >
            {/* CLOUD WEBGL BACKGROUND */}

            <canvas
                ref={canvasRef}
                className="
                    absolute
                    inset-0
                    w-full
                    h-full
                    pointer-events-none
                    block
                    -z-10
                "
            />

            {/* FOREGROUND CONTENT */}

            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
};

export default CloudShader;