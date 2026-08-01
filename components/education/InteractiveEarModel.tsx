'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Info,
  Brain,
  Sparkles,
  HelpCircle,
  Activity,
  Zap,
} from 'lucide-react';

interface AnatomyPart {
  id: string;
  name: string;
  category: string;
  color: string;
  position: [number, number, number];
  functionText: string;
  tinnitusImpact: string;
  hearingLossRelation: string;
  clickPopupText: string;
}

const ANATOMY_PARTS: AnatomyPart[] = [
  {
    id: 'ear_canal',
    name: 'Outer Ear Canal',
    category: 'Outer Ear',
    color: '#e0a98b',
    position: [-3.6, 0, 0],
    functionText: 'Funnels acoustic sound waves down the ear canal toward the tympanic membrane.',
    tinnitusImpact: 'Cerumen impaction or stenosis dampens external sound, unmasking underlying tinnitus.',
    hearingLossRelation: 'Conductive hearing impairment occurs when sound cannot pass efficiently through the canal.',
    clickPopupText: 'Sound waves enter through the canal. Blockages increase internal tinnitus awareness by reducing external noise masking.',
  },
  {
    id: 'eardrum',
    name: 'Tympanic Membrane (Eardrum)',
    category: 'Middle Ear',
    color: '#f43f5e',
    position: [-2.2, 0, 0],
    functionText: 'Vibrates mechanically in response to incoming acoustic sound pressure waves.',
    tinnitusImpact: 'Myoclonus (spasms) of tensor tympani or stapedius muscles causes clicking/fluttering tinnitus.',
    hearingLossRelation: 'Membrane perforation or tympanosclerosis impairs acoustic energy transfer to ossicles.',
    clickPopupText: 'Translucent membrane vibrating in sync with sound waves. Muscle spasms here trigger rhythmic objective tinnitus.',
  },
  {
    id: 'ossicles',
    name: 'Ossicles (Malleus, Incus, Stapes)',
    category: 'Middle Ear Bones',
    color: '#cbd5e1',
    position: [-1.2, 0.2, 0],
    functionText: 'Three tiny bone levers that amplify mechanical vibrations by ~20x into the cochlear oval window.',
    tinnitusImpact: 'Otosclerosis or ossicular fixation leads to altered mechanical feedback and vascular tinnitus noise.',
    hearingLossRelation: 'Disarticulation or stiffness reduces acoustic signal transfer into inner ear fluid.',
    clickPopupText: 'Malleus, Incus & Stapes bones multiply sound pressure before transferring vibrations into cochlear fluid.',
  },
  {
    id: 'cochlea',
    name: 'Spiral Cochlea (Inner Ear)',
    category: 'Inner Ear',
    color: '#a855f7',
    position: [0.6, 0, 0],
    functionText: 'Fluid-filled spiral organ translating mechanical fluid waves into frequency-specific electrical nerve signals.',
    tinnitusImpact: 'Basilar membrane hair cell damage induces hyperactive spontaneous neural firing, perceived as phantom tinnitus.',
    hearingLossRelation: 'Sensorineural hearing loss occurs when organ of Corti hair cells degrade across high-frequency basilar turns.',
    clickPopupText: 'Damage to hair cells inside the spiral cochlea deprives the brain of normal input, triggering phantom neural ringing.',
  },
  {
    id: 'auditory_nerve',
    name: 'Auditory Nerve (CN VIII)',
    category: 'Neural Pathway',
    color: '#f59e0b',
    position: [2.8, 0, 0],
    functionText: 'Transmits action potential impulses from cochlear hair cells to the central auditory brainstem.',
    tinnitusImpact: 'Aberrant synchronized firing along CN VIII fibers sustains central tinnitus perception even without sound.',
    hearingLossRelation: 'Nerve demyelination or acoustic neuroma causes severe speech discrimination loss.',
    clickPopupText: 'Glowing impulses show tinnitus originates from abnormal electrical activity traveling to the brain without external sound.',
  },
];

export const InteractiveEarModel: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedPart, setSelectedPart] = useState<AnatomyPart | null>(ANATOMY_PARTS[3]); // Default Cochlea
  const [isRotating, setIsRotating] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight || 450;

    // 1. Scene & Camera Setup angled at ~35 degrees
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.2, 9);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // 2. Realistic Medical Lighting & Highlights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x38bdf8, 2.2);
    keyLight.position.set(6, 8, 8);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xc084fc, 1.8);
    fillLight.position.set(-6, -4, 4);
    scene.add(fillLight);

    const neuralGlowLight = new THREE.PointLight(0xf59e0b, 2.5, 12);
    neuralGlowLight.position.set(2.8, 0, 1);
    scene.add(neuralGlowLight);

    // 3. Main Ear Structure Group
    const earGroup = new THREE.Group();
    earGroup.rotation.y = THREE.MathUtils.degToRad(35); // 35-degree angle composition
    scene.add(earGroup);

    const meshesMap: { [key: string]: THREE.Mesh | THREE.Group } = {};

    // --- A. Outer Ear Canal Mesh ---
    const canalGeo = new THREE.CylinderGeometry(0.7, 0.5, 2.4, 32, 1, true);
    canalGeo.rotateZ(Math.PI / 2);
    const canalMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#e0a98b'),
      roughness: 0.4,
      metalness: 0.1,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
    });
    const canalMesh = new THREE.Mesh(canalGeo, canalMat);
    canalMesh.position.set(-3.6, 0, 0);
    canalMesh.userData = { id: 'ear_canal' };
    earGroup.add(canalMesh);
    meshesMap['ear_canal'] = canalMesh;

    // --- B. Tympanic Membrane (Eardrum) Mesh ---
    const eardrumGeo = new THREE.ConeGeometry(0.65, 0.3, 32);
    eardrumGeo.rotateZ(Math.PI / 2);
    const eardrumMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#f43f5e'),
      roughness: 0.2,
      metalness: 0.1,
      transparent: true,
      opacity: 0.75,
      emissive: new THREE.Color('#f43f5e'),
      emissiveIntensity: 0.2,
    });
    const eardrumMesh = new THREE.Mesh(eardrumGeo, eardrumMat);
    eardrumMesh.position.set(-2.2, 0, 0);
    eardrumMesh.userData = { id: 'eardrum' };
    earGroup.add(eardrumMesh);
    meshesMap['eardrum'] = eardrumMesh;

    // --- C. Middle Ear Ossicles Group (Malleus, Incus, Stapes) ---
    const ossiclesGroup = new THREE.Group();
    ossiclesGroup.position.set(-1.2, 0.2, 0);

    const boneMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#f1f5f9'),
      roughness: 0.3,
      metalness: 0.2,
    });

    // Malleus (Hammer)
    const malleusGeo = new THREE.CylinderGeometry(0.08, 0.14, 0.9, 16);
    malleusGeo.rotateZ(Math.PI / 4);
    const malleusMesh = new THREE.Mesh(malleusGeo, boneMat);
    malleusMesh.position.set(-0.3, -0.1, 0);
    ossiclesGroup.add(malleusMesh);

    // Incus (Anvil)
    const incusGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const incusMesh = new THREE.Mesh(incusGeo, boneMat);
    incusMesh.position.set(0, 0.1, 0);
    ossiclesGroup.add(incusMesh);

    // Stapes (Stirrup Arch)
    const stapesGeo = new THREE.TorusGeometry(0.15, 0.05, 12, 24, Math.PI);
    const stapesMesh = new THREE.Mesh(stapesGeo, boneMat);
    stapesMesh.position.set(0.3, -0.1, 0);
    ossiclesGroup.add(stapesMesh);

    ossiclesGroup.userData = { id: 'ossicles' };
    earGroup.add(ossiclesGroup);
    meshesMap['ossicles'] = ossiclesGroup;

    // --- D. Medically Accurate Spiral Cochlea Mesh ---
    const cochleaGroup = new THREE.Group();
    cochleaGroup.position.set(0.6, 0, 0);

    // Build 3D spiral curve for cochlear turns
    const spiralPoints = [];
    for (let t = 0; t <= Math.PI * 4; t += 0.1) {
      const radius = 0.8 * Math.exp(-0.18 * t);
      const x = radius * Math.cos(t);
      const y = radius * Math.sin(t);
      const z = (t / (Math.PI * 4)) * 0.5;
      spiralPoints.push(new THREE.Vector3(x, y, z));
    }
    const spiralCurve = new THREE.CatmullRomCurve3(spiralPoints);
    const cochleaTubeGeo = new THREE.TubeGeometry(spiralCurve, 100, 0.22, 16, false);
    const cochleaMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#a855f7'),
      roughness: 0.15,
      metalness: 0.4,
      emissive: new THREE.Color('#9333ea'),
      emissiveIntensity: 0.35,
      transparent: true,
      opacity: 0.9,
    });
    const cochleaMesh = new THREE.Mesh(cochleaTubeGeo, cochleaMat);
    cochleaGroup.add(cochleaMesh);
    cochleaGroup.userData = { id: 'cochlea' };
    earGroup.add(cochleaGroup);
    meshesMap['cochlea'] = cochleaGroup;

    // --- E. Auditory Nerve Bundle (CN VIII) ---
    const nerveGroup = new THREE.Group();
    nerveGroup.position.set(2.8, 0, 0);

    const nerveMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#f59e0b'),
      roughness: 0.2,
      metalness: 0.1,
      emissive: new THREE.Color('#d97706'),
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.85,
    });

    for (let i = 0; i < 5; i++) {
      const strandGeo = new THREE.CylinderGeometry(0.06, 0.08, 2.5, 16);
      strandGeo.rotateZ(Math.PI / 2);
      const strandMesh = new THREE.Mesh(strandGeo, nerveMat);
      strandMesh.position.set(0, (i - 2) * 0.12, (i % 2) * 0.08);
      nerveGroup.add(strandMesh);
    }
    nerveGroup.userData = { id: 'auditory_nerve' };
    earGroup.add(nerveGroup);
    meshesMap['auditory_nerve'] = nerveGroup;

    // 4. ANIMATED ELEMENTS: Sound Waves, Neural Impulses & Sparks
    // --- Sound Wave Rings entering canal ---
    const soundWaveRings: THREE.Mesh[] = [];
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
    });

    for (let i = 0; i < 4; i++) {
      const ringGeo = new THREE.RingGeometry(0.3, 0.38, 32);
      ringGeo.rotateY(Math.PI / 2);
      const ringMesh = new THREE.Mesh(ringGeo, ringMat.clone());
      ringMesh.position.set(-4.8 + i * 0.6, 0, 0);
      earGroup.add(ringMesh);
      soundWaveRings.push(ringMesh);
    }

    // --- Glowing Electrical Neural Impulses along Auditory Nerve ---
    const impulseParticles: THREE.Mesh[] = [];
    const sparkMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.9,
    });

    for (let i = 0; i < 12; i++) {
      const sparkGeo = new THREE.SphereGeometry(0.06, 12, 12);
      const sparkMesh = new THREE.Mesh(sparkGeo, sparkMat);
      sparkMesh.position.set(1.5 + Math.random() * 2.5, (Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.3);
      earGroup.add(sparkMesh);
      impulseParticles.push(sparkMesh);
    }

    // 5. Raycaster & Interactivity
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(earGroup.children, true);

      if (intersects.length > 0) {
        let obj: THREE.Object3D | null = intersects[0].object;
        while (obj && !obj.userData?.id && obj.parent !== earGroup) {
          obj = obj.parent;
        }
        if (obj && obj.userData?.id) {
          const clickedId = obj.userData.id;
          const foundPart = ANATOMY_PARTS.find((p) => p.id === clickedId);
          if (foundPart) {
            setSelectedPart(foundPart);
          }
        }
      }
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('click', handlePointerDown);

    // 6. Manual Mouse Drag Rotation
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaMove = {
        x: e.clientX - previousMousePosition.x,
        y: e.clientY - previousMousePosition.y,
      };

      earGroup.rotation.y += deltaMove.x * 0.008;
      earGroup.rotation.x += deltaMove.y * 0.008;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    domElem.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // 7. Animation Loop (Slow, Smooth Medical Animation)
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Auto rotation
      if (isRotating && !isDragging) {
        earGroup.rotation.y += 0.003;
      }

      // A. Sound Waves entering ear canal animation
      soundWaveRings.forEach((ring, idx) => {
        ring.position.x += 0.015;
        if (ring.position.x > -2.3) {
          ring.position.x = -4.8;
        }
        const mat = ring.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.2 + 0.6 * Math.sin(time * 3 + idx);
      });

      // B. Gentle Eardrum vibration
      eardrumMesh.scale.x = 1.0 + Math.sin(time * 12) * 0.03;

      // C. Cochlea spiral pulsing
      cochleaMesh.scale.setScalar(1.0 + Math.sin(time * 4) * 0.02);
      (cochleaMat as THREE.MeshStandardMaterial).emissiveIntensity = 0.35 + Math.sin(time * 5) * 0.15;

      // D. Glowing Electrical Impulses along Auditory Nerve
      impulseParticles.forEach((spark, idx) => {
        spark.position.x += 0.03;
        if (spark.position.x > 4.2) {
          spark.position.x = 1.5;
        }
        spark.scale.setScalar(0.8 + Math.sin(time * 8 + idx) * 0.4);
      });

      camera.position.z = 9 / zoomLevel;
      renderer.render(scene, camera);
    };

    animate();

    // 8. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      domElem.removeEventListener('click', handlePointerDown);
      domElem.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [selectedPart, isRotating, zoomLevel]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Brain className="w-6 h-6 text-blue-600 dark:text-cyan-400" /> Photorealistic 3D Tinnitus Anatomy Visualization
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Explore ear canal sound pressure waves, tympanic membrane vibrations, cochlear fluid dynamics, and glowing CN VIII neural activity.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="cyan">Medically Accurate 3D</Badge>
          <Badge variant="purple">Neural Impulses Active</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 3D Canvas Viewport (7 Cols) */}
        <GlassCard className="lg:col-span-7 relative h-[460px] p-0 overflow-hidden border-blue-500/30 bg-slate-950/90 dark:bg-slate-950/90 flex flex-col justify-between">
          {/* Controls Bar Overlay */}
          <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl text-[11px] text-slate-300 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Drag to rotate • Click anatomical parts to inspect</span>
            </div>

            <div className="flex items-center gap-1.5 pointer-events-auto">
              <button
                onClick={() => setIsRotating(!isRotating)}
                className={`p-2 rounded-xl border text-xs font-bold transition-all backdrop-blur-md ${
                  isRotating
                    ? 'bg-blue-600/30 text-cyan-300 border-blue-500/40'
                    : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-white'
                }`}
                title={isRotating ? 'Pause Auto-Rotation' : 'Start Auto-Rotation'}
              >
                <RotateCcw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 2.0))}
                className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-cyan-400 transition-colors backdrop-blur-md"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.6))}
                className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-cyan-400 transition-colors backdrop-blur-md"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Three.js Container Mount */}
          <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Quick Selection Buttons Footer */}
          <div className="p-3 bg-slate-900/95 border-t border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar z-10">
            {ANATOMY_PARTS.map((part) => (
              <button
                key={part.id}
                onClick={() => setSelectedPart(part)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shrink-0 flex items-center gap-1.5 ${
                  selectedPart?.id === part.id
                    ? 'bg-blue-600/30 text-cyan-300 border-cyan-400 shadow-md'
                    : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: part.color }} />
                {part.name}
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Educational Info & Click Popup Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {selectedPart ? (
            <GlassCard className="space-y-4 border-blue-500/40 bg-white dark:bg-slate-900 shadow-sm animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: selectedPart.color }} />
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">{selectedPart.name}</h3>
                    <span className="text-[10px] text-blue-600 dark:text-cyan-400 font-mono uppercase tracking-wider">{selectedPart.category}</span>
                  </div>
                </div>
                <Badge variant="cyan">Selected Part</Badge>
              </div>

              {/* Specific Click Popup Explanation Box */}
              <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-cyan-500/10 border border-blue-200 dark:border-cyan-500/30 text-blue-900 dark:text-cyan-200 text-xs leading-relaxed font-medium flex items-start gap-2.5">
                <Info className="w-5 h-5 text-blue-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-blue-700 dark:text-cyan-300 mb-0.5">Medical Anatomy Note</span>
                  {selectedPart.clickPopupText}
                </div>
              </div>

              {/* Anatomical Details Grid */}
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Biological Function</span>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{selectedPart.functionText}</p>
                </div>

                <div className="p-3 rounded-xl bg-purple-50 dark:bg-slate-950/80 border border-purple-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider block">Tinnitus Impact & Phantom Sound</span>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{selectedPart.tinnitusImpact}</p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-slate-950/80 border border-emerald-200 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-teal-400 uppercase tracking-wider block">Hearing Loss Relation</span>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{selectedPart.hearingLossRelation}</p>
                </div>
              </div>
            </GlassCard>
          ) : (
            <GlassCard className="p-8 text-center text-slate-400 space-y-2 border-slate-200 dark:border-slate-800">
              <HelpCircle className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-xs font-semibold">Click any anatomical structure on the 3D model to inspect its role in hearing and tinnitus.</p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};
