"use client";

import React, { useEffect, useRef } from 'react';

export interface CloudShaderProps {
  speed?: number;
  count?: number; // 1 to 6 layers
  cloudColor?: string;
  skyTopColor?: string;
  skyBottomColor?: string;
  className?: string;
  children?: React.ReactNode;
}

// Helper to convert CSS color string (hex or rgb) to normalized [r, g, b] array for GLSL uniforms
function parseColorToRGB(colorStr: string): [number, number, number] {
  if (!colorStr) return [1, 1, 1];
  
  // Hex format (#fff or #ffffff)
  if (colorStr.startsWith('#')) {
    let hex = colorStr.slice(1);
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('');
    }
    const num = parseInt(hex, 16);
    return [
      ((num >> 16) & 255) / 255,
      ((num >> 8) & 255) / 255,
      (num & 255) / 255,
    ];
  }

  // RGB format rgb(r, g, b)
  const rgbMatch = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (rgbMatch) {
    return [
      parseInt(rgbMatch[1], 10) / 255,
      parseInt(rgbMatch[2], 10) / 255,
      parseInt(rgbMatch[3], 10) / 255,
    ];
  }

  return [1, 1, 1];
}

const VERTEX_SHADER_SOURCE = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER_SOURCE = `
  precision mediump float;

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_speed;
  uniform float u_count;
  uniform vec3 u_cloudColor;
  uniform vec3 u_skyTopColor;
  uniform vec3 u_skyBottomColor;

  // 2D Hash function for GLSL ES 1.00
  vec2 hash22(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  // 2D Perlin / Value Noise
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(
      mix(dot(hash22(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
          dot(hash22(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
      mix(dot(hash22(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
          dot(hash22(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  // Fractional Brownian Motion (FBM) with WebGL 1.0 compliant loop
  float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    vec2 shift = vec2(100.0);

    for (int i = 0; i < 4; i++) {
      value += amplitude * (noise(st) * 0.5 + 0.5);
      st = st * 2.0 + shift;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    float aspect = u_resolution.x / u_resolution.y;
    vec2 uv = st;
    uv.x *= aspect;

    // Sky Background Gradient (Top to Bottom)
    vec3 skyColor = mix(u_skyBottomColor, u_skyTopColor, st.y);

    // Animate coordinates based on speed and time
    vec2 motion = vec2(u_time * u_speed * 0.05, u_time * u_speed * 0.01);
    vec2 q = uv * 2.5 + motion;

    // Generate procedural cloud noise
    float cloudDensity = fbm(q);

    // Apply cloud thresholding for natural soft edges
    float alpha = smoothstep(0.35, 0.75, cloudDensity);

    // Blend sky and cloud colors
    vec3 finalColor = mix(skyColor, u_cloudColor, alpha * 0.7);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export const CloudShader: React.FC<CloudShaderProps> = ({
  speed = 0.5,
  count = 3,
  cloudColor = '#ffffff',
  skyTopColor = '#fce7f3',
  skyBottomColor = '#ffffff',
  className = '',
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const gl = canvas.getContext('webgl', { alpha: false, preserveDrawingBuffer: false });
    if (!gl) {
      console.warn('WebGL context not available for CloudShader.');
      return;
    }

    // Check user preference for reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let isReducedMotion = mediaQuery.matches;

    const handleMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotion = e.matches;
    };
    mediaQuery.addEventListener('change', handleMotionChange);

    // 1. Compile Shaders
    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const infoLog = gl.getShaderInfoLog(shader);
        console.error('Shader compile error:', infoLog || 'Unknown shader compile error');
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = createShader(gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);

    if (!vertexShader || !fragmentShader) return;

    // 2. Link Program
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const linkLog = gl.getProgramInfoLog(program);
      console.error('Program link error:', linkLog || 'Unknown program link error');
      gl.deleteProgram(program);
      return;
    }

    gl.useProgram(program);

    // 3. Fullscreen Quad Geometry Buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // 4. Uniform Locations
    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uSpeed = gl.getUniformLocation(program, 'u_speed');
    const uCount = gl.getUniformLocation(program, 'u_count');
    const uCloudColor = gl.getUniformLocation(program, 'u_cloudColor');
    const uSkyTopColor = gl.getUniformLocation(program, 'u_skyTopColor');
    const uSkyBottomColor = gl.getUniformLocation(program, 'u_skyBottomColor');

    // 5. Handle Resize
    const resizeCanvas = () => {
      if (!container || !canvas) return;
      const displayWidth = container.clientWidth;
      const displayHeight = container.clientHeight;

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, displayWidth, displayHeight);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    resizeObserver.observe(container);
    resizeCanvas();

    // 6. Animation Loop
    let animationFrameId: number;
    let startTime = performance.now();

    const render = (now: number) => {
      const elapsedTime = (now - startTime) / 1000;

      gl.useProgram(program);

      // Pass Uniforms
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, isReducedMotion ? 0 : elapsedTime);
      gl.uniform1f(uSpeed, speed);
      gl.uniform1f(uCount, Math.min(6, Math.max(1, count)));

      const cloudRGB = parseColorToRGB(cloudColor);
      const skyTopRGB = parseColorToRGB(skyTopColor);
      const skyBottomRGB = parseColorToRGB(skyBottomColor);

      gl.uniform3f(uCloudColor, cloudRGB[0], cloudRGB[1], cloudRGB[2]);
      gl.uniform3f(uSkyTopColor, skyTopRGB[0], skyTopRGB[1], skyTopRGB[2]);
      gl.uniform3f(uSkyBottomColor, skyBottomRGB[0], skyBottomRGB[1], skyBottomRGB[2]);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    // 7. Cleanup on Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      mediaQuery.removeEventListener('change', handleMotionChange);

      if (gl) {
        if (positionBuffer) gl.deleteBuffer(positionBuffer);
        if (vertexShader) gl.deleteShader(vertexShader);
        if (fragmentShader) gl.deleteShader(fragmentShader);
        if (program) gl.deleteProgram(program);
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      }
    };
  }, [speed, count, cloudColor, skyTopColor, skyBottomColor]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* WebGL Canvas positioned absolutely behind children */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full -z-10 pointer-events-none block"
      />
      {/* Foreground Content */}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
};
