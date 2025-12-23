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

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    const pointLight = new THREE.PointLight(0xffd700, 2, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xffa500, 1.8, 100);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    const directionalLight = new THREE.DirectionalLight(0xffc125, 1.2);
    directionalLight.position.set(0, 5, 5);
    scene.add(directionalLight);

    const spotLight = new THREE.SpotLight(0xffd700, 2, 20, Math.PI / 6, 0.5);
    spotLight.position.set(0, 0, 10);
    spotLight.target.position.set(0, 0, 0);
    scene.add(spotLight);
    scene.add(spotLight.target);

    // === COIN GROUP ===
    const coinGroup = coinGroupRef.current;
    scene.add(coinGroup);

    // Coin front
    const coinGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.2, 64);
    const coinMaterial = new THREE.MeshStandardMaterial({
      map: coinTexture,
      metalness: 0.95,
      roughness: 0.05,
      emissive: 0xffd700,
      emissiveIntensity: 0.6,
      emissiveMap: coinTexture,
    });

    const coinFront = new THREE.Mesh(coinGeometry, coinMaterial);
    coinFront.rotation.x = Math.PI / 2;
    coinGroup.add(coinFront);

    // Coin back
    const coinBackMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.95,
      roughness: 0.05,
      emissive: 0xdaa520,
      emissiveIntensity: 0.3,
    });

    const coinBack = new THREE.Mesh(coinGeometry, coinBackMaterial);
    coinBack.rotation.x = -Math.PI / 2;
    coinBack.position.z = -0.1;
    coinGroup.add(coinBack);

    // Coin edges
    const edgeGeometry = new THREE.TorusGeometry(1.5, 0.2, 16, 64);
    const edgeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffa500,
      metalness: 0.98,
      roughness: 0.02,
      emissive: 0xb8860b,
      emissiveIntensity: 0.25,
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

    // Smoke particles
    const smokeParticles = createSmokeParticles(smokeTexture);
    effectsGroup.add(smokeParticles);

    // Glow rings
    const glowRings: THREE.Mesh[] = [];
    for (let i = 0; i < 5; i++) {
      const ringGeo = new THREE.TorusGeometry(1.8 + i * 0.4, 0.08, 16, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xffd700,
        transparent: true,
        opacity: 0.4 - i * 0.08,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      glowRings.push(ring);
      effectsGroup.add(ring);
    }

    // Sparkles
    const sparkles = createSparkles();
    effectsGroup.add(sparkles);

    // Glow sphere
    const glowSphereGeo = new THREE.SphereGeometry(2, 32, 32);
    const glowSphereMat = new THREE.MeshBasicMaterial({
      color: 0xffd700,
      transparent: true,
      opacity: 0.2,
      side: THREE.BackSide,
    });
    const glowSphere = new THREE.Mesh(glowSphereGeo, glowSphereMat);
    effectsGroup.add(glowSphere);

    // Solar system
    const { planets, orbits } = createSolarSystem();
    planets.forEach(p => effectsGroup.add(p));
    orbits.forEach(o => effectsGroup.add(o));

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

      // Coin movement & tilt
      const targetX = mx * 2.5 + Math.sin(time * 0.5) * 0.5;
      const targetY = -my * 2.5 + Math.cos(time * 0.5) * 0.5;

      coinGroup.position.x += (targetX - coinGroup.position.x) * 0.15;
      coinGroup.position.y += (targetY - coinGroup.position.y) * 0.15;

      coinGroup.rotation.z += 0.001;
      coinGroup.rotation.y += 0.0005;
      coinGroup.rotation.x = Math.PI / 2 + my * 0.4;

      // Lights movement
      pointLight.position.x = 5 + Math.sin(time) * 2;
      pointLight.position.y = 5 + Math.cos(time) * 2;
      pointLight2.position.x = -5 + Math.cos(time) * 2;
      pointLight2.position.y = -5 + Math.sin(time) * 2;

      spotLight.target.position.copy(coinGroup.position);

      // Effects sync with coin
      effectsGroup.position.copy(coinGroup.position);
      effectsGroup.rotation.z = coinGroup.rotation.z;

      // Animate glow rings
      glowRings.forEach((ring, i) => {
        ring.rotation.z = time * (0.05 + i * 0.02);
        const opacity = 0.4 - i * 0.08 + Math.sin(time * 0.5 + i) * 0.15;
        (ring.material as THREE.MeshBasicMaterial).opacity = opacity;
        ring.scale.setScalar(1 + Math.sin(time * 0.3 + i * 0.5) * 0.1);
      });

      // Glow sphere pulse
      const pulse = 1 + Math.sin(time * 0.5) * 0.3;
      glowSphere.scale.setScalar(pulse);
      (glowSphere.material as THREE.MeshBasicMaterial).opacity =
        0.2 + Math.sin(time * 0.6) * 0.15;

      // Animate smoke
      animateSmoke(smokeParticles);

      // Animate sparkles
      animateSparkles(sparkles, time);

      // Animate planets
      animatePlanets(planets, coinGroup.position, time);

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

  const cX = 256,
    cY = 256,
    radius = 200;

  const grad = ctx.createRadialGradient(cX, cY, 0, cX, cY, radius);
  grad.addColorStop(0, '#FFD700');
  grad.addColorStop(0.3, '#FFE55C');
  grad.addColorStop(0.7, '#FFA500');
  grad.addColorStop(1, '#DAA520');

  ctx.fillStyle = grad;
  ctx.arc(cX, cY, radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#B8860B';
  ctx.lineWidth = 6;
  ctx.stroke();

  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.6;
  ctx.beginPath();
  ctx.arc(cX, cY, radius - 25, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Split symbol
  const iconR = 50,
    offset = 20;
  ctx.fillStyle = ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 12;

  ctx.beginPath();
  ctx.arc(cX - offset, cY - 10, iconR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cX + offset, cY - 10, iconR, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fill();

  // Text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 42px "Segoe UI", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SPLITWISE', cX, cY + 85);

  ctx.fillStyle = '#B8860B';
  ctx.font = '300 18px "Segoe UI", Arial, sans-serif';
  ctx.fillText('SHARE EXPENSES', cX, cY + 115);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function createSmokeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, 'rgba(255,215,0,1)');
  grad.addColorStop(0.2, 'rgba(255,165,0,0.8)');
  grad.addColorStop(0.4, 'rgba(255,140,0,0.6)');
  grad.addColorStop(0.6, 'rgba(255,69,0,0.4)');
  grad.addColorStop(0.8, 'rgba(139,69,19,0.2)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');

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
  const count = 200;
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const opacities = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 0.5;

    positions[i3] = Math.cos(angle) * radius;
    positions[i3 + 1] = Math.random() * 0.3 - 0.5;
    positions[i3 + 2] = Math.sin(angle) * radius;

    velocities[i3] = (Math.random() - 0.5) * 0.02;
    velocities[i3 + 1] = Math.random() * 0.03 + 0.02;
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.02;

    sizes[i] = Math.random() * 0.5 + 0.3;
    opacities[i] = Math.random() * 0.5 + 0.5;
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
        gl_FragColor = vec4(1.0, 0.65, 0.0, tex.a * vOpacity);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  return new THREE.Points(geometry, material);
}

function createSparkles(): THREE.Points {
  const count = 200;
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const opacities = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const angle = Math.random() * Math.PI * 2;
    const radius = 2.5 + Math.random() * 2.5;

    positions[i3] = Math.cos(angle) * radius;
    positions[i3 + 1] = (Math.random() - 0.5) * 3;
    positions[i3 + 2] = Math.sin(angle) * radius;

    sizes[i] = Math.random() * 0.15 + 0.08;
    opacities[i] = Math.random() * 0.9 + 0.1;
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
        float d = distance(gl_PointCoord, vec2(0.5));
        float a = 1.0 - smoothstep(0.0, 0.5, d);
        vec3 c = mix(vec3(1.0, 0.84, 0.0), vec3(1.0, 1.0, 1.0), d * 2.0);
        gl_FragColor = vec4(c, a * vOpacity);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  return new THREE.Points(geometry, material);
}

function createSolarSystem() {
  const planets: THREE.Mesh[] = [];
  const orbits: THREE.Mesh[] = [];

  const configs: Array<[number, number, number, number]> = [
    [2.5, 0.15, 0x8b7355, 1.2],
    [3.2, 0.18, 0xffc649, 1.0],
    [4.0, 0.2, 0x6b93d6, 0.8],
    [5.2, 0.16, 0xc1440e, 0.6],
    [7.0, 0.35, 0xd8ca9d, 0.4],
    [8.5, 0.3, 0xfad5a5, 0.3],
    [10.0, 0.25, 0x4fd0e7, 0.2],
    [11.5, 0.24, 0x4b70dd, 0.15],
  ];

  configs.forEach(([radius, size, color, speed], i) => {
    // Orbit
    const orbitGeo = new THREE.RingGeometry(radius - 0.02, radius + 0.02, 64);
    const orbitMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide,
    });
    const orbit = new THREE.Mesh(orbitGeo, orbitMat);
    orbit.rotation.x = Math.PI / 2;
    orbits.push(orbit);

    // Planet
    const geo = new THREE.SphereGeometry(size, 16, 16);
    const mat = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.3,
      metalness: 0.3,
      roughness: 0.7,
    });
    const planet = new THREE.Mesh(geo, mat);
    planet.position.x = radius;
    planet.userData = {
      orbitRadius: radius,
      speed,
      angle: Math.random() * Math.PI * 2,
    };
    planets.push(planet);

    if (i === 5) {
      // Saturn rings
      const ringGeo = new THREE.RingGeometry(size * 1.5, size * 2.2, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xfad5a5,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      planet.add(ring);
    }
  });

  return { planets, orbits };
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

function animateSparkles(particles: THREE.Points, time: number) {
  const pos = particles.geometry.attributes.position.array as Float32Array;
  const opa = particles.geometry.attributes.opacity.array as Float32Array;

  for (let i = 0; i < pos.length / 3; i++) {
    const i3 = i * 3;
    const baseAngle = Math.atan2(pos[i3 + 2], pos[i3]);
    const angle = baseAngle + time * (0.2 + (i % 3) * 0.05);
    const baseR = 2.5 + (i % 5) * 0.5;
    const r = baseR + Math.sin(time * 0.6 + i) * 0.8;

    pos[i3] = Math.cos(angle) * r;
    pos[i3 + 2] = Math.sin(angle) * r;
    pos[i3 + 1] = Math.sin(time * 1 + i * 0.5) * 2;

    opa[i] = Math.abs(Math.sin(time * 1 + i * 0.3)) * 0.9 + 0.1;
  }

  particles.geometry.attributes.position.needsUpdate = true;
  particles.geometry.attributes.opacity.needsUpdate = true;

  if (particles.material instanceof THREE.ShaderMaterial) {
    particles.material.uniforms.time.value = time;
  }
}

function animatePlanets(
  planets: THREE.Mesh[],
  coinPos: THREE.Vector3,
  time: number
) {
  planets.forEach(planet => {
    const { orbitRadius, speed, angle } = planet.userData;
    const newAngle = angle + time * speed * 0.01;
    planet.userData.angle = newAngle;

    planet.position.x = coinPos.x + Math.cos(newAngle) * orbitRadius;
    planet.position.y = coinPos.y + Math.sin(newAngle) * 0.3 * orbitRadius;
    planet.position.z = coinPos.z + Math.sin(newAngle) * orbitRadius;

    planet.rotation.y += 0.0002;
  });
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
