import { useEffect, useRef, useState } from "react";
import { DirectionalLightHelper } from "three";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { CameraControls, OrbitControls, PerspectiveCamera, Wireframe, useHelper } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import * as THREE from "three";
import { constSelector } from "recoil";

function Cube({ position, size, color }) {
  console.log("CUBE MOUNTED");
  const mesh = useRef(null);

  useEffect(() => {
    // mesh.current.rotation.z = 90;
  }, []);

  return (
    <mesh position={position} ref={mesh}>
      <circleGeometry args={[6, 64]} />
      <meshStandardMaterial color={color} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Line(props) {
  // props : points
  const ref = useRef(null);
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(props.points);
  return (
    <>
      <line ref={ref} geometry={lineGeometry}>
        <lineBasicMaterial attach="material" color={"white"} linewidth={10} />
      </line>
    </>
  );
}

function Sphere(props) {
  console.log("SPHERE MOUNTED");
  /**
   * type : "front", "back", "double", "star"
   */

  const mesh = useRef(null);

  return (
    <mesh ref={mesh} position={props.position}>
      <sphereGeometry args={props.size} />
      <meshStandardMaterial color={props.color} side={props.type === "double" ? THREE.DoubleSide : props.type === "front" ? THREE.FrontSide : THREE.BackSide} />
    </mesh>
  );
}

function Star(props) {
  console.log("STAR MOUNTED");
  /**
   * props : size / position / location / constellationCheck / isPossesed /
   */

  const mesh = useRef(null);
  const [curStarState, setCurStarState] = useState(props.isPossesed.get(props.location));
  const colors = {
    OPEN: "yellow",
    CLOSE: "red",
  };

  const updateStarState = () => {
    // 요 페이지에서는 사실 눌렀을 때 색 변화를 일으키는 게 아니라, 상세보기 / 글쓰기 등 모달창만 띄워주면 됨
    // 아래는 테스트 코드,, 등록 / 삭제에 따른 색 변화는 글쓰기, 글삭제 기능 추가 후 연동해서 작성해야 할 듯

    // 등록된 별이 아닐 때
    if (!curStarState) {
      if (window.confirm("별을 등록할까요?")) {
        // axios : 별 등록 요청
        // {현재 별 페이지 번호} * {한 페이지당 별 개수} + {현재 별의 위치 번호} -> 별의 location 값
        // 별 등록이 성공적으로 이루어졌다면 별 상태를 바꾼다 -> 요건 추후에 API에 맞춰서 수정
        setCurStarState({ boardAccess: "OPEN" });
        props.isPossesed.set(props.location, curStarState);
      }

      // 등록된 별일 때
    } else {
      if (curStarState.boardAccess === "OPEN") {
        if (window.confirm("별 상세 내용 \n 별을 비공개 처리할까요?")) {
          // axios : 별 정보 수정 요청 (공개범위수정)
          // 수정이 정상적으로 이루어졌다면
          let tmp = props.isPossesed.get(props.location);
          tmp.boardAccess = "CLOSE";
          setCurStarState(tmp);
        }
      } else if (curStarState.boardAccess === "CLOSE") {
        if (window.confirm("비공개 별입니다 \n 별을 삭제할까요?")) {
          // axios : 별 정보 수정 요청 (별 삭제 처리)
          setCurStarState(null);
        }
      }
    }
  };

  return (
    <mesh
      ref={mesh}
      position={props.position}
      onClick={() => {
        updateStarState();
      }}
    >
      <sphereGeometry args={props.size} />
      <meshStandardMaterial color={curStarState ? colors[curStarState.boardAccess] : "grey"} />
    </mesh>
  );
}

function SceneStars() {
  console.log("SCENE MOUNTED");
  const [lineState, setLineState] = useState([]);

  useEffect(() => {
    let cur = 0;
    let tmp = [];
    starTail.forEach((val, index) => {
      if (constellationCheck(val)) {
        let points = [];
        for (let i = cur; i <= val; i++) {
          points.push(new THREE.Vector3(...position[i]));
        }

        cur = val + 1;
        tmp.push(points);
      }
    });
    setLineState(tmp);
  }, []);

  const stars = [
    // fetchData
    {
      boardIndex: 1,
      userIndex: 1,
      boardRegTime: "2099-99-99",
      boardInputDate: "2099-99-99",
      boardContent: "더미 컨텐츠",
      boardLocation: 1,
      boardAccess: "OPEN",
      boardLike: 3,
      tagContent: [],
    },
    {
      boardIndex: 2,
      userIndex: 1,
      boardRegTime: "2099-99-99",
      boardInputDate: "2099-99-99",
      boardContent: "더미 컨텐츠",
      boardLocation: 0,
      boardAccess: "CLOSE",
      boardLike: 3,
      tagContent: [],
    },
    {
      boardIndex: 3,
      userIndex: 1,
      boardRegTime: "2099-99-99",
      boardInputDate: "2099-99-99",
      boardContent: "더미 컨텐츠",
      boardLocation: 2,
      boardAccess: "OPEN",
      boardLike: 3,
      tagContent: [],
    },
    {
      boardIndex: 3,
      userIndex: 1,
      boardRegTime: "2099-99-99",
      boardInputDate: "2099-99-99",
      boardContent: "더미 컨텐츠",
      boardLocation: 3,
      boardAccess: "OPEN",
      boardLike: 3,
      tagContent: [],
    },
    {
      boardIndex: 3,
      userIndex: 1,
      boardRegTime: "2099-99-99",
      boardInputDate: "2099-99-99",
      boardContent: "더미 컨텐츠",
      boardLocation: 4,
      boardAccess: "OPEN",
      boardLike: 3,
      tagContent: [],
    },
  ];

  // position : 변화할 일 없는 값
  const position = [
    [1, 10, -30],
    [2, 7, -30],
    [4, 5, -30],
    [3, 13, -30],
    [13, 5, -30],
    [14, 8, -30],
  ];

  // isPossesed : 등록된 별 체크를 위한 Map
  const isPossesed = new Map();
  stars.forEach((val) => isPossesed.set(val.boardLocation, val));

  // starTail : 각 별자리 마다 가장 큰 location 번호
  const starTail = [3, 5];

  // 별자리 이어짐 체크
  function constellationCheck(starNum) {
    // starNum이 한 페이지 내 별 개수보다 커질 경우도 생각해서 수정해야함

    let curStarNum = starNum % position.length;
    let res = true;

    if (curStarNum < 4) {
      for (let i = 0; i < 4; i++) {
        if (!isPossesed.has(i)) {
          res = false;
          break;
        }
      }
    } else if (curStarNum < 6) {
      for (let i = 4; i < 6; i++) {
        if (!isPossesed.has(i)) {
          res = false;
          break;
        }
      }
    }

    return res;
  }

  return (
    <>
      {/* 별 */}
      {/* index : 별 location 값이랑 동일 */}
      {position.map((i, index) => {
        return <Star size={[0.2, 32, 32]} position={i} location={index} key={index} constellationCheck={constellationCheck} isPossesed={isPossesed} setLineState={setLineState} />;
      })}

      {/* 별자리 선 */}
      {lineState.map((_, index) => {
        return <Line points={lineState[index]} key={index} />;
      })}
    </>
  );
}

function SceneLights() {
  return (
    <>
      {/* 광원 */}
      <directionalLight position={[0, 0, 2]} intensity={3} />
      <ambientLight intensity={1} />

      {/* 중심점 - 추후 삭제 */}
      <Sphere size={[0.01, 16, 16]} position={[0.5, -7.8, -1]} color={"red"} />
    </>
  );
}

function SceneEnvironment() {
  return (
    <>
      {/* 우주 배경 */}
      <Sphere size={[40, 48, 48]} position={[0, -4, 0]} color={"black"} type={"back"} />

      {/* 바닥면 */}
      <Cube size={[100, 0.1, 100]} position={[0, -13, 0]} color={"orange"} />
    </>
  );
}
function UserSpace() {
  return (
    <>
      <div id="canvas-container" style={{ height: "100vh", width: "100vw" }}>
        <Canvas>
          <SceneStars />
          <SceneLights />
          <SceneEnvironment />
          {/* <OrbitControls dampingFactor={0.12} target={[0.5, -7.8, -1]} rotateSpeed={-0.15} enableZoom={true} /> */}
          <OrbitControls dampingFactor={0.12} minPolarAngle={(Math.PI * 2.7) / 5} maxPolarAngle={Math.PI} target={[0.5, -7.8, -1]} rotateSpeed={-0.15} enableZoom={false} />
          <PerspectiveCamera makeDefault position={[0, -8, 0]} fov={110} zoom={3} aspect={window.innerWidth / window.innerHeight} />
        </Canvas>
      </div>
    </>
  );
}

export default UserSpace;
