import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import api from '../api/axios';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Glasses component loads the GLB and applies transforms
const GlassesModel = ({ url, faceMetricsRef }) => {
    const { scene } = useGLTF(url);
    const modelRef = useRef();
    const { viewport } = useThree();

    useFrame(() => {
        if (!faceMetricsRef.current || !modelRef.current) return;
        const metrics = faceMetricsRef.current;
        
        // Convert normalized coordinates to viewport coordinates
        const x = -(metrics.position.x - 0.5) * viewport.width;
        const y = -(metrics.position.y - 0.5) * viewport.height;
        const z = -metrics.position.z * 10;
        
        modelRef.current.position.set(x, y, z);
        modelRef.current.rotation.set(metrics.rotation.x, metrics.rotation.y, metrics.rotation.z);
        modelRef.current.scale.setScalar(metrics.scale * viewport.width * 0.15);
    });

    return <primitive ref={modelRef} object={scene} />;
};

const FallbackGlasses = ({ faceMetricsRef }) => {
    const groupRef = useRef();
    const { viewport } = useThree();

    useFrame(() => {
        if (!faceMetricsRef.current || !groupRef.current) return;
        const metrics = faceMetricsRef.current;
        
        // Map MediaPipe normalized coords (0-1) to Three.js viewport
        // X is inverted because the webcam is mirrored
        const x = -(metrics.position.x - 0.5) * viewport.width;
        const y = -(metrics.position.y - 0.5) * viewport.height;
        const z = -metrics.position.z * 20;

        // The eye distance multiplier. 1.3 was too big, back down to ~0.85
        const scale = metrics.scale * viewport.width * 0.85; 
        
        // Offset Y slightly based on scale so the bridge sits correctly on the nose
        groupRef.current.position.set(x, y - (scale * 0.05), z + 1); 
        groupRef.current.rotation.set(metrics.rotation.x, metrics.rotation.y, metrics.rotation.z);
        
        groupRef.current.scale.setScalar(scale);
    });

    const frameColor = "#1a1a1a"; // Dark matte charcoal
    const lensColor = "#e0f2fe"; // Sky 100

    // Adjusting base geometry variables: 
    // Shorter width per lens, smaller gap.
    const width = 0.65;
    const height = 0.45;
    const radius = 0.12;
    const thickness = 0.06;

    const shape = useMemo(() => {
        const s = new THREE.Shape();
        // CCW outer
        s.moveTo(-width/2 + radius, height/2);
        s.lineTo(width/2 - radius, height/2);
        s.quadraticCurveTo(width/2, height/2, width/2, height/2 - radius);
        s.lineTo(width/2, -height/2 + radius);
        s.quadraticCurveTo(width/2, -height/2, width/2 - radius, -height/2);
        s.lineTo(-width/2 + radius, -height/2);
        s.quadraticCurveTo(-width/2, -height/2, -width/2, -height/2 + radius);
        s.lineTo(-width/2, height/2 - radius);
        s.quadraticCurveTo(-width/2, height/2, -width/2 + radius, height/2);

        const hole = new THREE.Path();
        const innerW = width - thickness * 2;
        const innerH = height - thickness * 2;
        const innerR = Math.max(0, radius - thickness);
        
        // CW inner
        hole.moveTo(-innerW/2 + innerR, innerH/2);
        hole.quadraticCurveTo(-innerW/2, innerH/2, -innerW/2, innerH/2 - innerR);
        hole.lineTo(-innerW/2, -innerH/2 + innerR);
        hole.quadraticCurveTo(-innerW/2, -innerH/2, -innerW/2 + innerR, -innerH/2);
        hole.lineTo(innerW/2 - innerR, -innerH/2);
        hole.quadraticCurveTo(innerW/2, -innerH/2, innerW/2, -innerH/2 + innerR);
        hole.lineTo(innerW/2, innerH/2 - innerR);
        hole.quadraticCurveTo(innerW/2, innerH/2, innerW/2 - innerR, innerH/2);
        hole.lineTo(-innerW/2 + innerR, innerH/2);
        
        s.holes.push(hole);
        return s;
    }, []);

    const lensShape = useMemo(() => {
        const innerW = width - thickness * 2;
        const innerH = height - thickness * 2;
        const innerR = Math.max(0, radius - thickness);
        const s = new THREE.Shape();
        s.moveTo(-innerW/2 + innerR, innerH/2);
        s.lineTo(innerW/2 - innerR, innerH/2);
        s.quadraticCurveTo(innerW/2, innerH/2, innerW/2, innerH/2 - innerR);
        s.lineTo(innerW/2, -innerH/2 + innerR);
        s.quadraticCurveTo(innerW/2, -innerH/2, innerW/2 - innerR, -innerH/2);
        s.lineTo(-innerW/2 + innerR, -innerH/2);
        s.quadraticCurveTo(-innerW/2, -innerH/2, -innerW/2, -innerH/2 + innerR);
        s.lineTo(-innerW/2, innerH/2 - innerR);
        s.quadraticCurveTo(-innerW/2, innerH/2, -innerW/2 + innerR, innerH/2);
        return s;
    }, []);

    const extrudeSettings = useMemo(() => ({
        depth: 0.04,
        bevelEnabled: true,
        bevelSegments: 4,
        steps: 1,
        bevelSize: 0.015,
        bevelThickness: 0.015,
    }), []);

    return (
        <group ref={groupRef}>
            {/* Left Frame Rim */}
            <mesh position={[-0.38, 0, 0]}>
                <extrudeGeometry args={[shape, extrudeSettings]} />
                <meshStandardMaterial color={frameColor} roughness={0.7} metalness={0.2} />
            </mesh>
            {/* Left Lens: transparent standard material since Canvas is overlaying HTML video */}
            <mesh position={[-0.38, 0, 0.02]}>
                <shapeGeometry args={[lensShape]} />
                <meshStandardMaterial color={lensColor} opacity={0.25} transparent roughness={0.1} metalness={0.8} />
            </mesh>

            {/* Right Frame Rim */}
            <mesh position={[0.38, 0, 0]}>
                <extrudeGeometry args={[shape, extrudeSettings]} />
                <meshStandardMaterial color={frameColor} roughness={0.7} metalness={0.2} />
            </mesh>
            {/* Right Lens */}
            <mesh position={[0.38, 0, 0.02]}>
                <shapeGeometry args={[lensShape]} />
                <meshStandardMaterial color={lensColor} opacity={0.25} transparent roughness={0.1} metalness={0.8} />
            </mesh>

            {/* Bridge */}
            <mesh position={[0, 0.1, 0.02]}>
                <boxGeometry args={[0.11, 0.05, 0.05]} />
                <meshStandardMaterial color={frameColor} roughness={0.7} metalness={0.2} />
            </mesh>

            {/* Left Temple */}
            <mesh position={[-0.72, 0.15, -0.42]} rotation={[0, Math.PI / 2 + 0.08, 0]}>
                <boxGeometry args={[0.85, 0.05, 0.02]} />
                <meshStandardMaterial color={frameColor} roughness={0.7} metalness={0.2} />
            </mesh>

            {/* Right Temple */}
            <mesh position={[0.72, 0.15, -0.42]} rotation={[0, -Math.PI / 2 - 0.08, 0]}>
                <boxGeometry args={[0.85, 0.05, 0.02]} />
                <meshStandardMaterial color={frameColor} roughness={0.7} metalness={0.2} />
            </mesh>
        </group>
    );
};


const VirtualTryOn = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const webcamRef = useRef(null);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModelReady, setIsModelReady] = useState(false);
    
    // Use a ref for face metrics to avoid React re-renders 60 times a second
    const faceMetricsRef = useRef(null);

    // Fetch Product Data
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                if (id === 'fallback') {
                    setProduct({ name: 'Demo Virtual Glasses', price: '0.00' });
                } else {
                    const response = await api.get(`products/products/${id}/`);
                    setProduct(response.data);
                }
            } catch (err) {
                setError('Failed to fetch product details.');
            }
        };
        fetchProduct();
    }, [id]);

    // Initialize MediaPipe tracking loop
    useEffect(() => {
        let faceLandmarker;
        let animationFrameId;
        let isActive = true;

        const initAndTrack = async () => {
            try {
                const filesetResolver = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
                );
                faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
                    baseOptions: {
                        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
                        delegate: "GPU"
                    },
                    outputFaceBlendshapes: true,
                    runningMode: "VIDEO",
                    numFaces: 1
                });
                
                if (!isActive) return;
                setLoading(false);
                setIsModelReady(true);

                let lastVideoTime = -1;

                const renderLoop = async () => {
                    if (!isActive) return;

                    if (faceLandmarker && webcamRef.current && webcamRef.current.video) {
                        const video = webcamRef.current.video;
                        
                        if (video.currentTime !== lastVideoTime && video.readyState >= 2) {
                            lastVideoTime = video.currentTime;
                            const results = faceLandmarker.detectForVideo(video, performance.now());
                            
                            if (results.faceLandmarks && results.faceLandmarks.length > 0) {
                                const landmarks = results.faceLandmarks[0];
                                
                                const nose = landmarks[168];
                                const leftEye = landmarks[33];
                                const rightEye = landmarks[263];

                                // MediaPipe coordinates are 0-1.
                                const eyeDistance = Math.sqrt(Math.pow(rightEye.x - leftEye.x, 2) + Math.pow(rightEye.y - leftEye.y, 2));

                                // Rotation (Z is roll, X is pitch, Y is yaw)
                                // Z (Roll): Tilt of the head side to side
                                const angleZ = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);
                                
                                // X (Pitch): Looking up or down. MediaPipe Z is poorly scaled compared to Y, so we use a very subtle estimate or 0.
                                // A slight negative angle (-0.05) helps the frames sit nicely on the nose without flipping.
                                const angleX = -0.05; 

                                // Y (Yaw): Turning head left or right. Nose position relative to eye midpoint gives a good approximation.
                                const eyeMidpointX = (leftEye.x + rightEye.x) / 2;
                                const angleY = (nose.x - eyeMidpointX) * 2; // rough localized multiplier

                                // Update ref directly without triggering React render
                                faceMetricsRef.current = {
                                    position: { x: nose.x, y: nose.y, z: nose.z },
                                    rotation: { x: angleX, y: -angleY, z: -angleZ },
                                    scale: eyeDistance
                                };
                            }
                        }
                    }
                    animationFrameId = requestAnimationFrame(renderLoop);
                };
                
                renderLoop();
            } catch (err) {
                console.error("MediaPipe initialization error: ", err);
                if (isActive) setError('Failed to initialize face tracking.');
            }
        };
        
        initAndTrack();

        return () => {
            isActive = false;
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, []);

    if (error) return <div className="text-center py-20 text-red-500 font-bold">{error}</div>;

    return (
        <div className="relative w-full h-[calc(100vh-64px)] bg-black overflow-hidden flex flex-col items-center justify-center">
            {loading && (
                <div className="absolute z-20 flex flex-col items-center gap-4 bg-slate-900/80 p-8 rounded-3xl backdrop-blur-md">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-white font-bold tracking-wider uppercase text-sm">Initializing AR Engine</p>
                </div>
            )}
            
            <button 
                onClick={() => navigate(-1)}
                className="absolute top-4 left-4 z-20 bg-white/20 backdrop-blur-md text-white px-6 py-2 rounded-full font-bold hover:bg-white/30 transition border border-white/20"
            >
                &larr; Exit Try-On
            </button>

            {/* Webcam Background */}
            <Webcam
                ref={webcamRef}
                className="absolute w-full h-full object-cover scale-x-[-1]"
                videoConstraints={{ facingMode: "user" }}
            />

            {/* Three.js Overlay */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                    <ambientLight intensity={1.5} />
                    <directionalLight position={[10, 10, 5]} intensity={2} />
                    <Environment preset="city" />
                    {isModelReady && product && (
                        product.model_3d ? (
                            <GlassesModel url={product.model_3d} faceMetricsRef={faceMetricsRef} />
                        ) : (
                            <FallbackGlasses faceMetricsRef={faceMetricsRef} />
                        )
                    )}
                </Canvas>
            </div>
            
            {product && (
                <div className="absolute bottom-10 bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-2xl flex items-center gap-6 border border-white/40 max-w-sm w-full mx-4">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 shrink-0">
                        {product.image ? (
                            <img src={product.image} alt={product.name} className="w-12 h-12 object-contain mix-blend-multiply" />
                        ) : (
                            <span className="text-2xl">👓</span>
                        )}
                    </div>
                    <div>
                        <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Now Wearing</p>
                        <p className="font-extrabold text-gray-900 text-lg leading-tight">{product.name}</p>
                        <p className="text-gray-500 font-medium mt-1">${product.price}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VirtualTryOn;
