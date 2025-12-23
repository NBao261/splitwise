import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';

interface ThreeSceneProps {
  onLoad?: () => void;
}

export function ThreeScene({ onLoad }: ThreeSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });

  // Refs cho các object Three.js
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  // Group refs để dễ quản lý
  const coinGroupRef = useRef<THREE.Group>(new THREE.Group());
  const effectsGroupRef = useRef<THREE.Group>(new THREE.Group());

  // Tạo texture một lần duy nhất
  const coinTexture = useMemo(() => createCoinTexture(), []);
  const smokeTexture = useMemo(() => createSmokeTexture(), []);
  const snowflakeTexture = useMemo(() => createSnowflakeTexture(), []);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting - Christmas mood
    scene.add(new THREE.AmbientLight(0xf5f5ff, 0.7));

    const pointLight = new THREE.PointLight(0xfff3b0, 2, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x8fd3ff, 1.6, 100);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(0, 5, 5);
    scene.add(directionalLight);

    const spotLight = new THREE.SpotLight(0xfff5d0, 2.2, 20, Math.PI / 6, 0.5);
    spotLight.position.set(0, 0, 10);
    spotLight.target.position.set(0, 0, 0);
    scene.add(spotLight);
    scene.add(spotLight.target);

    // === COIN GROUP ===
    const coinGroup = coinGroupRef.current;
    scene.add(coinGroup);

    // Coin front (Christmas ornament coin)
    const coinGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.2, 64);
    const coinMaterial = new THREE.MeshStandardMaterial({
      map: coinTexture,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0xd32f2f,
      emissiveIntensity: 0.5,
      emissiveMap: coinTexture,
    });

    const coinFront = new THREE.Mesh(coinGeometry, coinMaterial);
    coinFront.rotation.x = Math.PI / 2;
    coinGroup.add(coinFront);

    // Coin back
    const coinBackMaterial = new THREE.MeshStandardMaterial({
      color: 0xd32f2f,
      metalness: 0.9,
      roughness: 0.25,
      emissive: 0x7f0000,
      emissiveIntensity: 0.4,
    });

    const coinBack = new THREE.Mesh(coinGeometry, coinBackMaterial);
    coinBack.rotation.x = -Math.PI / 2;
    coinBack.position.z = -0.1;
    coinGroup.add(coinBack);

    // Coin edges
    const edgeGeometry = new THREE.TorusGeometry(1.5, 0.2, 16, 64);
    const edgeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.95,
      roughness: 0.15,
      emissive: 0xb71c1c,
      emissiveIntensity: 0.3,
    });

    const edge1 = new THREE.Mesh(edgeGeometry, edgeMaterial);
    edge1.rotation.x = Math.PI / 2;
    edge1.position.z = 0.1;
    coinGroup.add(edge1);

    const edge2 = edge1.clone();
    edge2.rotation.x = -Math.PI / 2;
    edge2.position.z = -0.1;
    coinGroup.add(edge2);

    // === EFFECTS GROUP ===
    const effectsGroup = effectsGroupRef.current;
    scene.add(effectsGroup);

    // Smoke particles (soft, subtle)
    const smokeParticles = createSmokeParticles(smokeTexture);
    effectsGroup.add(smokeParticles);

    // Snow particles (gentle snowfall)
    const snowParticles = createSnowParticles(snowflakeTexture);
    effectsGroup.add(snowParticles);

    // Glow rings (minimal halos)
    const glowRings: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const ringGeo = new THREE.TorusGeometry(1.8 + i * 0.4, 0.08, 16, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: i === 0 ? 0xff8a80 : i === 1 ? 0xa5d6a7 : 0x90caf9,
        transparent: true,
        opacity: 0.3 - i * 0.06,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      glowRings.push(ring);
      effectsGroup.add(ring);
    }

    // Sparkles (reduced, snow-like)
    const sparkles = createSparkles();
    effectsGroup.add(sparkles);

    // Glow sphere (soft snowy glow)
    const glowSphereGeo = new THREE.SphereGeometry(2, 32, 32);
    const glowSphereMat = new THREE.MeshBasicMaterial({
      color: 0xe3f2fd,
      transparent: true,
      opacity: 0.22,
      side: THREE.BackSide,
    });
    const glowSphere = new THREE.Mesh(glowSphereGeo, glowSphereMat);
    effectsGroup.add(glowSphere);

    // (Removed solar system for a calmer scene)

    // Resize handler
    const handleResize = () => {
      if (!camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);

      const time = clock.getElapsedTime();
      const { x: mx, y: my } = mousePositionRef.current;

      // Coin movement & tilt (slower, calmer)
      const targetX = mx * 1.8 + Math.sin(time * 0.3) * 0.25;
      const targetY = -my * 1.8 + Math.cos(time * 0.3) * 0.25;

      coinGroup.position.x += (targetX - coinGroup.position.x) * 0.1;
      coinGroup.position.y += (targetY - coinGroup.position.y) * 0.1;

      coinGroup.rotation.z += 0.0006;
      coinGroup.rotation.y += 0.0003;
      coinGroup.rotation.x = Math.PI / 2 + my * 0.3;

      // Lights movement
      pointLight.position.x = 5 + Math.sin(time) * 2;
      pointLight.position.y = 5 + Math.cos(time) * 2;
      pointLight2.position.x = -5 + Math.cos(time) * 2;
      pointLight2.position.y = -5 + Math.sin(time) * 2;

      spotLight.target.position.copy(coinGroup.position);

      // Effects sync with coin
      effectsGroup.position.copy(coinGroup.position);
      effectsGroup.rotation.z = coinGroup.rotation.z;

      // Animate glow rings (slow & gentle)
      glowRings.forEach((ring, i) => {
        ring.rotation.z = time * (0.02 + i * 0.01);
        const baseOpacity = 0.25 - i * 0.05;
        const opacity = baseOpacity + Math.sin(time * 0.3 + i) * 0.05;
        (ring.material as THREE.MeshBasicMaterial).opacity = opacity;
        const scale = 1 + Math.sin(time * 0.2 + i * 0.5) * 0.05;
        ring.scale.setScalar(scale);
      });

      // Glow sphere pulse
      const pulse = 1 + Math.sin(time * 0.5) * 0.3;
      glowSphere.scale.setScalar(pulse);
      (glowSphere.material as THREE.MeshBasicMaterial).opacity =
        0.2 + Math.sin(time * 0.6) * 0.15;

      // Animate smoke
      animateSmoke(smokeParticles);

      // Animate snow
      animateSnow(snowParticles, time);

      // Animate sparkles
      animateSparkles(sparkles, time);

      camera.lookAt(coinGroup.position);
      renderer.render(scene, camera);
    };

    animate();
    onLoad?.();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }

      container.removeChild(renderer.domElement);
      renderer.dispose();

      // Dispose geometries & materials
      disposeRecursive(scene);
    };
  }, [onLoad, coinTexture, smokeTexture]);

  // Mouse move handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      mousePositionRef.current = { x, y };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden"
    />
  );
}

// === Helper functions ===

function createCoinTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const cX = 256;
  const cY = 256;
  const radius = 200;

  // Christmas ornament gradient
  const grad = ctx.createRadialGradient(cX, cY, 0, cX, cY, radius);
  grad.addColorStop(0, '#ffebee');
  grad.addColorStop(0.35, '#ef9a9a');
  grad.addColorStop(0.7, '#c62828');
  grad.addColorStop(1, '#8b0000');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cX, cY, radius, 0, Math.PI * 2);
  ctx.fill();

  // Outer ring
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 8;
  ctx.stroke();

  // Inner glowing ring
  ctx.strokeStyle = '#c8e6c9';
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.6;
  ctx.beginPath();
  ctx.arc(cX, cY, radius - 25, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Christmas tree silhouette in center
  ctx.save();
  ctx.translate(cX, cY - 20);
  ctx.fillStyle = '#1b5e20';
  ctx.strokeStyle = '#a5d6a7';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, -70);
  ctx.lineTo(-45, -20);
  ctx.lineTo(-20, -20);
  ctx.lineTo(-60, 20);
  ctx.lineTo(-25, 20);
  ctx.lineTo(-70, 60);
  ctx.lineTo(70, 60);
  ctx.lineTo(25, 20);
  ctx.lineTo(60, 20);
  ctx.lineTo(20, -20);
  ctx.lineTo(45, -20);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Tree trunk
  ctx.fillStyle = '#4e342e';
  ctx.fillRect(-15, 60, 30, 28);

  // Ornaments
  const ornamentColors = ['#ffeb3b', '#ff5722', '#81d4fa', '#ff80ab'];
  for (let i = 0; i < 18; i++) {
    const angle = (i / 18) * Math.PI * 2;
    const r = 55 + Math.sin(i * 0.7) * 15;
    const ox = Math.cos(angle) * (r * 0.35);
    const oy = Math.sin(angle) * (r * 0.4);
    ctx.beginPath();
    ctx.fillStyle = ornamentColors[i % ornamentColors.length];
    ctx.arc(ox, oy, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Star on top
  ctx.fillStyle = '#ffeb3b';
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const outerAngle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    const innerAngle = outerAngle + Math.PI / 5;
    const rOuter = 14;
    const rInner = 6;
    const xOuter = Math.cos(outerAngle) * rOuter;
    const yOuter = Math.sin(outerAngle) * rOuter - 75;
    const xInner = Math.cos(innerAngle) * rInner;
    const yInner = Math.sin(innerAngle) * rInner - 75;
    if (i === 0) {
      ctx.moveTo(xOuter, yOuter);
    } else {
      ctx.lineTo(xOuter, yOuter);
    }
    ctx.lineTo(xInner, yInner);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 40px "Segoe UI", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('MERRY SPLITMAS', cX, cY + 85);

  ctx.fillStyle = '#c8e6c9';
  ctx.font = '300 18px "Segoe UI", Arial, sans-serif';
  ctx.fillText('SHARE JOY · SHARE EXPENSES', cX, cY + 115);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function createSnowflakeTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const c = size / 2;
  ctx.translate(c, c);

  ctx.fillStyle = 'rgba(255,255,255,0.0)';
  ctx.fillRect(-c, -c, size, size);

  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  ctx.strokeStyle = 'rgba(227,242,253,0.9)';
  ctx.lineWidth = 1.2;

  const petalLength = 22;
  const petalWidth = 6;

  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    ctx.save();
    ctx.rotate(angle);

    // Petal shape
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(petalWidth, -petalLength * 0.3, 0, -petalLength);
    ctx.quadraticCurveTo(-petalWidth, -petalLength * 0.3, 0, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Small side petals
    ctx.beginPath();
    ctx.moveTo(0, -petalLength * 0.5);
    ctx.quadraticCurveTo(
      petalWidth * 1.2,
      -petalLength * 0.6,
      petalWidth * 0.9,
      -petalLength * 0.9
    );
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, -petalLength * 0.5);
    ctx.quadraticCurveTo(
      -petalWidth * 1.2,
      -petalLength * 0.6,
      -petalWidth * 0.9,
      -petalLength * 0.9
    );
    ctx.stroke();

    ctx.restore();
  }

  // Soft glow in center
  const radial = ctx.createRadialGradient(0, 0, 0, 0, 0, petalLength);
  radial.addColorStop(0, 'rgba(255,255,255,0.9)');
  radial.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = radial;
  ctx.beginPath();
  ctx.arc(0, 0, petalLength, 0, Math.PI * 2);
  ctx.fill();

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function createSnowParticles(texture: THREE.Texture): THREE.Points {
  const count = 120;
  const positions = new Float32Array(count * 3);
  const speeds = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 10; // spread horizontally
    positions[i3 + 1] = Math.random() * 8; // height
    positions[i3 + 2] = (Math.random() - 0.5) * 6;
    speeds[i] = 0.1 + Math.random() * 0.15;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('speed', new THREE.BufferAttribute(speeds, 1));

  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.16,
    map: texture,
    transparent: true,
    opacity: 0.95,
    alphaTest: 0.1,
    depthWrite: false,
  });

  return new THREE.Points(geometry, material);
}

function createSmokeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  // Soft snowy glow
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
  grad.addColorStop(0.3, 'rgba(227, 242, 253, 0.8)');
  grad.addColorStop(0.6, 'rgba(187, 222, 251, 0.4)');
  grad.addColorStop(0.85, 'rgba(144, 202, 249, 0.15)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

interface SmokeGeometry extends THREE.BufferGeometry {
  velocities: Float32Array;
}

function createSmokeParticles(texture: THREE.Texture): THREE.Points {
  const count = 80;
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const opacities = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 0.6;

    positions[i3] = Math.cos(angle) * radius;
    positions[i3 + 1] = Math.random() * 0.3 - 0.6;
    positions[i3 + 2] = Math.sin(angle) * radius;

    velocities[i3] = (Math.random() - 0.5) * 0.01;
    velocities[i3 + 1] = Math.random() * 0.02 + 0.01;
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.01;

    sizes[i] = Math.random() * 0.35 + 0.2;
    opacities[i] = Math.random() * 0.4 + 0.4;
  }

  const geometry = new THREE.BufferGeometry() as SmokeGeometry;
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));
  geometry.velocities = velocities;

  const material = new THREE.ShaderMaterial({
    uniforms: { smokeTexture: { value: texture } },
    vertexShader: /* glsl */ `
      attribute float size;
      attribute float opacity;
      varying float vOpacity;
      void main() {
        vOpacity = opacity;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D smokeTexture;
      varying float vOpacity;
      void main() {
        vec4 tex = texture2D(smokeTexture, gl_PointCoord);
        // bluish-white snow mist
        gl_FragColor = vec4(0.9, 0.96, 1.0, tex.a * vOpacity);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  return new THREE.Points(geometry, material);
}

function createSparkles(): THREE.Points {
  const count = 80;
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const opacities = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const angle = Math.random() * Math.PI * 2;
    const radius = 2.5 + Math.random() * 2;

    positions[i3] = Math.cos(angle) * radius;
    positions[i3 + 1] = (Math.random() - 0.5) * 3;
    positions[i3 + 2] = Math.sin(angle) * radius;

    sizes[i] = Math.random() * 0.14 + 0.08;
    opacities[i] = Math.random() * 0.6 + 0.25;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));

  const material = new THREE.ShaderMaterial({
    uniforms: { time: { value: 0 } },
    vertexShader: /* glsl */ `
      attribute float size;
      attribute float opacity;
      varying float vOpacity;
      uniform float time;
      void main() {
        vOpacity = opacity;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = size * (400.0 / -mv.z) * (1.0 + sin(time * 3.0 + position.x * 5.0) * 0.4);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      varying float vOpacity;
      void main() {
        // soft snowflake-like falloff
        float d = distance(gl_PointCoord, vec2(0.5));
        float a = 1.0 - smoothstep(0.0, 0.55, d);
        vec3 c = mix(vec3(0.9, 0.96, 1.0), vec3(1.0, 1.0, 1.0), d * 1.5);
        gl_FragColor = vec4(c, a * vOpacity);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  return new THREE.Points(geometry, material);
}

function animateSmoke(particles: THREE.Points) {
  const geometry = particles.geometry as SmokeGeometry;
  const pos = geometry.attributes.position.array as Float32Array;
  const vel = geometry.velocities;
  const opa = particles.geometry.attributes.opacity.array as Float32Array;

  for (let i = 0; i < pos.length / 3; i++) {
    const i3 = i * 3;
    pos[i3] += vel[i3];
    pos[i3 + 1] += vel[i3 + 1];
    pos[i3 + 2] += vel[i3 + 2];

    vel[i3] += (Math.random() - 0.5) * 0.001;
    vel[i3 + 1] += 0.001;
    vel[i3 + 2] += (Math.random() - 0.5) * 0.001;

    if (pos[i3 + 1] > 2) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 0.5;
      pos[i3] = Math.cos(angle) * r;
      pos[i3 + 1] = -0.5;
      pos[i3 + 2] = Math.sin(angle) * r;

      vel[i3] = (Math.random() - 0.5) * 0.02;
      vel[i3 + 1] = Math.random() * 0.03 + 0.02;
      vel[i3 + 2] = (Math.random() - 0.5) * 0.02;

      opa[i] = Math.random() * 0.5 + 0.5;
    }

    opa[i] = Math.max(0, opa[i] - 0.003);
  }

  particles.geometry.attributes.position.needsUpdate = true;
  particles.geometry.attributes.opacity.needsUpdate = true;
}

function animateSnow(particles: THREE.Points, time: number) {
  const pos = particles.geometry.attributes.position.array as Float32Array;
  const speedAttr = particles.geometry.attributes
    .speed as THREE.BufferAttribute;
  const speeds = speedAttr.array as Float32Array;

  for (let i = 0; i < pos.length / 3; i++) {
    const i3 = i * 3;
    const fallSpeed = speeds[i];

    // fall down
    pos[i3 + 1] -= fallSpeed * 0.02;
    // gentle horizontal sway
    pos[i3] += Math.sin(time * 0.2 + i * 0.5) * 0.002;
    pos[i3 + 2] += Math.cos(time * 0.25 + i * 0.4) * 0.002;

    // reset when below threshold
    if (pos[i3 + 1] < -3) {
      pos[i3] = (Math.random() - 0.5) * 10;
      pos[i3 + 1] = 5 + Math.random() * 5;
      pos[i3 + 2] = (Math.random() - 0.5) * 6;
    }
  }

  particles.geometry.attributes.position.needsUpdate = true;
}

function animateSparkles(particles: THREE.Points, time: number) {
  const pos = particles.geometry.attributes.position.array as Float32Array;
  const opa = particles.geometry.attributes.opacity.array as Float32Array;

  for (let i = 0; i < pos.length / 3; i++) {
    const i3 = i * 3;
    const baseAngle = Math.atan2(pos[i3 + 2], pos[i3]);
    const angle = baseAngle + time * (0.08 + (i % 3) * 0.02);
    const baseR = 2.5 + (i % 5) * 0.4;
    const r = baseR + Math.sin(time * 0.3 + i) * 0.4;

    pos[i3] = Math.cos(angle) * r;
    pos[i3 + 2] = Math.sin(angle) * r;
    pos[i3 + 1] = Math.sin(time * 0.6 + i * 0.4) * 1.2;

    opa[i] = Math.abs(Math.sin(time * 0.6 + i * 0.25)) * 0.6 + 0.2;
  }

  particles.geometry.attributes.position.needsUpdate = true;
  particles.geometry.attributes.opacity.needsUpdate = true;

  if (particles.material instanceof THREE.ShaderMaterial) {
    particles.material.uniforms.time.value = time;
  }
}

function disposeRecursive(object: THREE.Object3D) {
  if ((object as THREE.Mesh).isMesh) {
    const mesh = object as THREE.Mesh;
    mesh.geometry?.dispose();
    if (Array.isArray(mesh.material)) {
      mesh.material.forEach(m => m.dispose());
    } else {
      mesh.material?.dispose();
    }
  }

  object.children.forEach(child => disposeRecursive(child));
}
