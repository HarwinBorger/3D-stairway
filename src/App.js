import React, {useRef, useState, useEffect} from 'react'
import {Canvas, useFrame, extend, useThree} from '@react-three/fiber'
import {FirstPersonControls, OrbitControls} from '@react-three/drei'
import { Physics, useBox, usePlane } from '@react-three/cannon'


function Box(props) {
	// This reference will give us direct access to the THREE.Mesh object
	const ref = useRef()
	// Set up state for the hovered and active state
	const [hovered, setHover] = useState(false)
	const [active, setActive] = useState(false)
	// Subscribe this component to the render-loop, rotate the mesh every frame
	useFrame((state, delta) => (
		ref.current.rotation.x += 0.01
	))
	// Return the view, these are regular Threejs elements expressed in JSX
	return (
		<mesh
			{...props}
			ref={ref}
			scale={active ? 1.5 : 1}
			onClick={(event) => setActive(!active)}
			onPointerOver={(event) => setHover(true)}
			onPointerOut={(event) => setHover(false)}>
			<boxGeometry args={[1, 1, 1]}/>
			<meshStandardMaterial color={hovered ? 'hotpink' : 'orange'}/>
		</mesh>
	)
}

function Floor(props) {
	const [ref] = usePlane(() => ({position:[0,-10,0]}))
	return (
		<mesh ref={ref}>
			<boxGeometry args={[props.size.x, 5, props.size.y]}/>
			<meshStandardMaterial color="orange"/>
		</mesh>
	);
}

function Player(){
	const [ref] = useBox(() => ({ mass:2,  position:[0,5,0] }))
	return (
		<mesh ref={ref}>
			<boxGeometry args={[2, 2, 2]}/>
			<meshStandardMaterial color="blue"/>
		</mesh>
	)
}
function Plane(props) {
	const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }))
	return (
		<mesh ref={ref}>
			<planeBufferGeometry attach="geometry" args={[1009, 1000]} />
		</mesh>
	)
}

function Cube(props) {
	const [ref] = useBox(() => ({ mass: 1, position: [0, 5, 0], rotation: [0.4, 0.2, 0.5], ...props }))
	return (
		<mesh receiveShadow castShadow ref={ref}>
			<boxBufferGeometry attach="geometry" />
			<meshLambertMaterial attach="material" color="hotpink" />
		</mesh>
	)
}

function App() {
	return (
		<Canvas>
			<ambientLight/>
			<gridHelper args={[200, 200, 0x110000]}/>
			<OrbitControls />
			{/*<FirstPersonControls lookSpeed={0.05} />*/}
			<pointLight position={[10, 10, 10]}/>
			<Box position={[- 1.2, 0, 0]}/>
			<Box position={[1.2, 0, 0]}/>
			<Physics gravity={[0,-1,0]}>
				{/*<Floor size={{x: 10, y: 10}}/>*/}
				<Plane />
				<Player />
			</Physics>
		</Canvas>
	);
}

export default App;
