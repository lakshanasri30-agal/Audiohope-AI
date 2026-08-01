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
  X,
  Volume2,
  Brain,
  Zap,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

interface AnatomyPart {
  id: string;
  name: string;
  category: string;
  color: string;
  position: [number, number, number];
  size: [number, number, number] | number;
  shape: 'sphere' | 'cylinder' | 'torus' | 'cone' | 'capsule';
  functionText: string;
  tinnitusImpact: string;
  hearingLossRelation: string;
  clickPopupText: string;
}

const ANATOMY_PARTS: AnatomyPart[] = [
  {
    id: 'outer_ear',
    name: 'Outer Ear & Ear Canal',
    category: 'Outer Ear',
    color: '#06b6d4', // Cyan
    position: [-3.5, 0, 0],
    size: [1.2, 0.8, 16],
    shape: 'cylinder',
    functionText: 'Collects ambient sound waves and funnels acoustic pressure down the ear canal toward the eardrum.',
    tinnitusImpact: 'Earwax impaction or canal inflammation can block sound waves, exacerbating tinnitus perception via auditory deprivation.',
    hearingLossRelation: 'Conductive hearing loss occurs when acoustic signals cannot efficiently pass through the outer canal.',
    clickPopupText: 'The outer ear gathers sound vibrations. Blockages here can increase tinnitus loudness by reducing external masking noise.',
  },
  {
    id: 'middle_ear',
    name: 'Middle Ear & Ossicles',
    category: 'Middle Ear',
    color: '#3b82f6', // Blue
    position: [-1.8, 0, 0],
    size: [0.9, 32, 32],
    shape: 'sphere',
    functionText: 'Contains the tympanic membrane (eardrum) and three tiny ossicle bones (malleus, incus, stapes) that amplify sound vibrations.',
    tinnitusImpact: 'Middle ear fluid accumulation, infection, or muscle spasms (stapedius myoclonus) can produce objective or pulsatile tinnitus.',
    hearingLossRelation: 'Stiffening of the ossicular chain (otosclerosis) impairs acoustic conduction to the inner ear.',
    clickPopupText: 'The middle ear amplifies acoustic energy by 20x. Spasms in middle ear muscles can trigger clicking tinnitus sounds.',
  },
  {
    id: 'cochlea',
    name: 'Cochlea (Inner Ear)',
    category: 'Inner Ear',
    color: '#a855f7', // Purple
    position: [0.3, 0, 0],
    size: [0.8, 0.3, 24],
    shape: 'torus',
    functionText: 'Spiral fluid-filled organ that translates mechanical sound vibrations into electrical nerve impulses across frequency zones.',
    tinnitusImpact: 'Damage to specific frequency regions of the cochlear basilar membrane triggers hyperactive neural compensatory firing, perceived as phantom ringing.',
    hearingLossRelation: 'Sensorineural hearing loss originates from cochlear degeneration, most commonly at high frequencies (4kHz - 8kHz).',
    clickPopupText: 'Damage to microscopic hair cells inside the spiral cochlea deprives the brain of normal sound input, triggering hyperactive neural signaling perceived as tinnitus.',
  },
  {
    id: 'hair_cells',
    name: 'Cochlear Hair Cells',
    category: 'Inner Ear (Organ of Corti)',
    color: '#10b981', // Emerald
    position: [0.3, 0.9, 0],
    size: [0.35, 32, 32],
    shape: 'sphere',
    functionText: 'Microscopic stereocilia sensors that flex in response to fluid movement, generating bioelectrical action potentials.',
    tinnitusImpact: 'Prolonged loud noise or ototoxic exposure damages stereocilia tips. Damaged hair cells leak continuous depolarization signals.',
    hearingLossRelation: 'Once sensory hair cells die, they do not regenerate in humans, leading to permanent notch hearing loss.',
    clickPopupText: 'Hair cells convert sound waves into electrical nerve impulses. Exposure to acoustic trauma (loud noise >85dB) damages these delicate sensors, contributing directly to tinnitus frequency peaks.',
  },
  {
    id: 'auditory_nerve',
    name: 'Auditory Nerve (Cranial Nerve VIII)',
    category: 'Neural Pathway',
    color: '#f59e0b', // Amber
    position: [2.5, 0, 0],
    size: [0.4, 2.2, 16],
    shape: 'cylinder',
    functionText: 'Transmits synchronized electrical acoustic data from the cochlea to the brainstem and auditory cortex.',
    tinnitusImpact: 'Desynchronized or abnormal nerve signaling due to deafferentation leads to central auditory gain amplification, sustaining tinnitus.',
    hearingLossRelation: 'Acoustic neuroma or nerve demyelination disrupts speech perception and spatial sound localization.',
    clickPopupText: 'Abnormal neural signaling along the auditory nerve causes the central brainstem to turn up its internal gain volume, creating central tinnitus habituation challenges.',
  },
];

export const InteractiveEarModel: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedPart, setSelectedPart] = useState<AnatomyPart | null>(ANATOMY_PARTS[2]); // Default Cochlea
  const [isRotating, setIsRotating] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight || 400;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.background = null; // Transparent background for glassmorphism integration

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x06b6d4, 2);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xa855f7, 1.8);
    dirLight2.position.set(-5, -5, -5);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x10b981, 2, 20);
    pointLight.position.set(0, 2, 3);
    scene.add(pointLight);

    // 3. Ear Model Mesh Group Creation
    const earGroup = new THREE.Group();

    const meshesMap: { [key: string]: THREE.Mesh } = {};

    ANATOMY_PARTS.forEach((part) => {
      let geometry: THREE.BufferGeometry;

      if (part.id === 'cochlea') {
        geometry = new THREE.TorusGeometry(0.7, 0.28, 16, 50);
      } else if (part.id === 'outer_ear') {
        geometry = new THREE.CylinderGeometry(0.6, 0.4, 2.2, 32);
        geometry.rotateZ(Math.PI / 2);
      } else if (part.id === 'auditory_nerve') {
        geometry = new THREE.CylinderGeometry(0.25, 0.25, 2.8, 32);
        geometry.rotateZ(Math.PI / 2);
      } else if (part.id === 'hair_cells') {
        geometry = new THREE.SphereGeometry(0.35, 32, 32);
      } else {
        geometry = new THREE.SphereGeometry(0.55, 32, 32);
      }

      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(part.color),
        roughness: 0.2,
        metalness: 0.3,
        emissive: new THREE.Color(part.color),
        emissiveIntensity: part.id === selectedPart?.id ? 0.4 : 0.1,
        transparent: true,
        opacity: 0.9,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...part.position);
      mesh.userData = { id: part.id };

      earGroup.add(mesh);
      meshesMap[part.id] = mesh;
    });

    scene.add(earGroup);

    // 4. Raycaster & Pointer Event Interactivity
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(earGroup.children);

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object as THREE.Mesh;
        const clickedId = clickedMesh.userData.id;
        const foundPart = ANATOMY_PARTS.find((p) => p.id === clickedId);
        if (foundPart) {
          setSelectedPart(foundPart);
        }
      }
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('click', handlePointerDown);

    // 5. Mouse Drag Manual Rotation Setup
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

      earGroup.rotation.y += deltaMove.x * 0.01;
      earGroup.rotation.x += deltaMove.y * 0.01;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    domElem.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // 6. Animation Frame Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (isRotating && !isDragging) {
        earGroup.rotation.y += 0.005;
      }

      // Update mesh emissive highlights
      ANATOMY_PARTS.forEach((p) => {
        const m = meshesMap[p.id];
        if (m && m.material instanceof THREE.MeshStandardMaterial) {
          if (p.id === selectedPart?.id) {
            m.material.emissiveIntensity = 0.5 + Math.sin(Date.now() * 0.005) * 0.2;
            m.scale.set(1.15, 1.15, 1.15);
          } else {
            m.material.emissiveIntensity = 0.1;
            m.scale.set(1, 1, 1);
          }
        }
      });

      camera.position.z = 10 / zoomLevel;
      renderer.render(scene, camera);
    };

    animate();

    // 7. Cleanup
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2.5">
            <Brain className="w-6 h-6 text-cyan-400" /> Interactive 3D Ear Anatomy & Tinnitus Education
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Rotate, zoom, and click anatomical structures to explore how hair cells, the cochlea, and auditory nerve signaling influence tinnitus.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="cyan">Three.js WebGL 3D</Badge>
          <Badge variant="purple">Educational Module</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 3D Canvas Viewport (7 Cols) */}
        <GlassCard className="lg:col-span-7 relative h-[440px] p-0 overflow-hidden border-cyan-500/30 bg-slate-950/80 flex flex-col justify-between">
          {/* Controls Bar Overlay */}
          <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl text-[11px] text-slate-300 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Drag to rotate • Click parts to inspect</span>
            </div>

            <div className="flex items-center gap-1.5 pointer-events-auto">
              <button
                onClick={() => setIsRotating(!isRotating)}
                className={`p-2 rounded-xl border text-xs font-bold transition-all backdrop-blur-md ${
                  isRotating
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
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
          <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar z-10">
            {ANATOMY_PARTS.map((part) => (
              <button
                key={part.id}
                onClick={() => setSelectedPart(part)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shrink-0 flex items-center gap-1.5 ${
                  selectedPart?.id === part.id
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-md'
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
            <GlassCard className="space-y-4 border-cyan-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/30 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: selectedPart.color }} />
                  <div>
                    <h3 className="text-base font-extrabold text-white">{selectedPart.name}</h3>
                    <span className="text-[10px] text-cyan-400 font-mono uppercase tracking-wider">{selectedPart.category}</span>
                  </div>
                </div>
                <Badge variant="cyan">Selected Part</Badge>
              </div>

              {/* Specific Click Popup Explanation Box */}
              <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 text-xs leading-relaxed font-medium flex items-start gap-2.5">
                <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-cyan-300 mb-0.5">Educational Impact Note</span>
                  {selectedPart.clickPopupText}
                </div>
              </div>

              {/* Anatomical Details Grid */}
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Biological Function</span>
                  <p className="text-slate-200 leading-relaxed">{selectedPart.functionText}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">How Tinnitus Relates & Affects It</span>
                  <p className="text-slate-200 leading-relaxed">{selectedPart.tinnitusImpact}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">Relationship with Hearing Loss</span>
                  <p className="text-slate-200 leading-relaxed">{selectedPart.hearingLossRelation}</p>
                </div>
              </div>
            </GlassCard>
          ) : (
            <GlassCard className="p-8 text-center text-slate-400 space-y-2 border-slate-800">
              <HelpCircle className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-xs font-semibold">Click any anatomical structure on the 3D model to inspect its role in hearing and tinnitus.</p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
};
