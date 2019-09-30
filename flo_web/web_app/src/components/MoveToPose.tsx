import React, { useState } from "react";
import * as ROSLIB from "roslib";
import { PoseMsg, PoseWrapper } from "./PoseContainer";
import { SetMoving, SetMovesList, JointState } from "../App";
import { runSequence, Move } from "./SequenceRunContainer";
import { basicBlock } from "../styleDefs/styles";

const armNames = [
  "shoulder_flexionextension",
  "shoulder_abduction",
  "shoulder_rotation",
  "elbow_flexionextension"
];

interface ArmValProps {
  name: string;
  val: number;
  transfer: () => void;
}

const ArmVal: React.FunctionComponent<ArmValProps> = ({
  name,
  val,
  transfer
}) => {
  return (
    <div>
      {name}:{val.toFixed(3)}
      <button type="button" onClick={() => transfer()}>
        Transfer
      </button>
    </div>
  );
};

interface ArmInputProps {
  name: string;
  setTarget: (arg: number) => void;
  val: number;
  min?: number;
  max?: number;
}

const ArmInput: React.FunctionComponent<ArmInputProps> = ({
  name,
  setTarget,
  val,
  min = -180,
  max = 180
}) => {
  return (
    <div>
      <label htmlFor="arm_input">
        {name}:
        <input
          type="number"
          name="arm_input"
          style={{ width: "50px" }}
          min={min}
          max={max}
          step="any"
          value={val}
          onChange={e => {
            setTarget(parseFloat(e.target.value));
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={val}
          onChange={e => {
            setTarget(parseFloat(e.target.value));
          }}
        />
      </label>
    </div>
  );
};

interface MoveToPoseProps {
  ros: ROSLIB.Ros | null;
  connected: boolean;
  moving: boolean;
  setMoving: SetMoving;
  pose: JointState | null;
}

const MoveToPose: React.FunctionComponent<MoveToPoseProps> = ({
  ros,
  connected,
  moving,
  setMoving,
  pose
}) => {
  const numArms = armNames.length;
  const [targetPose, setTargetPose] = useState(new Array(numArms).fill(0));
  const [arm, setArm] = useState<"left" | "right">("right");
  const [time, setTime] = useState(2);

  const inputs = [];
  for (let idx = 0; idx < numArms; idx += 1) {
    inputs.push(
      <ArmInput
        name={armNames[idx]}
        setTarget={(arg: number) => {
          const targetPoseT = [...targetPose];
          targetPoseT[idx] = arg;
          setTargetPose(targetPoseT);
        }}
        val={targetPose[idx]}
      />
    );
  }

  const currentPoses = [];
  if (pose) {
    for (let arm of ["right", "left"]) {
      for (let idx = 0; idx < numArms; idx += 1) {
        const target = pose.name.findIndex(
          p => p === arm + "_" + armNames[idx]
        );
        const degVal = (pose.position[target] * 180) / Math.PI;
        currentPoses.push(
          <ArmVal
            name={pose.name[target]}
            val={degVal}
            transfer={() => {
              const targetPoseT = [...targetPose];
              targetPoseT[idx] = degVal;
              setTargetPose(targetPoseT);
            }}
          />
        );
      }
    }
  }

  return (
    <div style={basicBlock}>
      <h2>Move to a Pose</h2>
      {currentPoses}
      <div>Current poses:</div>
      <div>
        Enter in degrees:
        {inputs}
        <label htmlFor="arm-selector">
          <button
            name="arm-selector"
            type="button"
            onClick={(): void => {
              setArm(arm === "left" ? "right" : "left");
            }}
          >
            {arm}
          </button>
        </label>
        <ArmInput name="time" setTarget={setTime} val={time} />
        <label htmlFor="run">
          <button
            name="run"
            type="button"
            onClick={(): void => {
              if (ros === null) {
                return;
              }

              const cleanNames = [];
              let name;
              for (name in armNames) {
                cleanNames.push(arm + "_" + name);
              }

              const radPose = [];
              for (let idx = 0; idx < targetPose.length; idx += 1) {
                radPose[idx] = (targetPose[idx] * Math.PI) / 180;
              }

              const movesList: Move[] = [
                {
                  time: time,
                  pose: {
                    pose: {
                      description: "temp pose",
                      joint_names: armNames,
                      joint_positions: radPose
                    },
                    id: 0
                  },
                  lr: arm,
                  status: "not-run",
                  key: 0
                }
              ];

              runSequence(movesList, (arg: Move[]) => null, setMoving, ros);
            }}
            disabled={moving || !connected}
          >
            Run
          </button>
        </label>
      </div>
    </div>
  );
};

export default MoveToPose;
