/* eslint-disable no-undef */

import { useEffect, useRef } from "react";

import {
  FilesetResolver,
  Landmark,
  PoseLandmarker,
} from "@mediapipe/tasks-vision";

import useMeasurementStore from "../../../store/useMeasurementStore";
import useWebRTC from "../../../hooks/useWebRTC";
import useRecording from "../../../hooks/useRecording";
import { patchSessionStateToAbsent } from "../../../apis/api";

import * as S from "./MeasurementServiceStyle";

const MeasurementService = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const landmarkerRef = useRef<PoseLandmarker | null>(null);
  const landmarkStorageRef = useRef<Landmark[][]>([]);

  const animationFrameRef = useRef<number | null>(null);
  const lastVideoTimeRef = useRef<number>(-1);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  let count = 0;

  const {
    setStream,
    setElapsedTime,
    setLandmarkResult,
    stopMeasurement,
    addSessionAlert,
    clearSessionAlerts,
    setNewAlertCount,
    stream,
    isMeasuring,
    receivedData,
    newAlertCount,
  } = useMeasurementStore();
  const { startConnection, sendMessage, closeConnection } = useWebRTC({
    serverUrl: import.meta.env.VITE_WEBSOCKET_URL,
  });
  const { startRecording, stopRecording } = useRecording();

  const setupCamera = async () => {
    const video = videoRef.current;

    if (!video) return;

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1440 },
          height: { ideal: 800 },
          aspectRatio: 1.8,
        },
      });

      video.srcObject = mediaStream;
      setStream(mediaStream);

      video.onloadedmetadata = () => {
        video.play();
      };
    } catch (error) {
      console.error("Error setting up camera:", error);
    }
  };

  const loadPoseLandmarker = async () => {
    try {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "/pose_landmarker_full.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numPoses: 1,
      });

      landmarkerRef.current = poseLandmarker;
    } catch (error) {
      console.error("Error loading pose landmarker:", error);
    }
  };

  const pushLandmark = (landmark: Landmark[]) => {
    landmarkStorageRef.current.push(landmark);

    if (landmarkStorageRef.current.length < 10) return;

    sendMessage(landmarkStorageRef.current);

    landmarkStorageRef.current = [];
  };

  const endAbsentSession = async () => {
    const sessionId: number =
      useMeasurementStore.getState().receivedData!.sessionId;

    await stopMeasurement();
    await closeConnection();
    await patchSessionStateToAbsent(sessionId);
  };

  const detectPose = () => {
    const video = videoRef.current;
    const landmarker = landmarkerRef.current;

    if (!video || !landmarker) return;

    if (
      video.currentTime === lastVideoTimeRef.current ||
      video.videoWidth === 0 ||
      video.videoHeight === 0
    ) {
      animationFrameRef.current = requestAnimationFrame(detectPose);

      return;
    }

    lastVideoTimeRef.current = video.currentTime;

    const poses = landmarker.detectForVideo(video, performance.now());

    if (poses.landmarks.length > 0) {
      pushLandmark(poses.landmarks[0]);
      setLandmarkResult(poses);
      count = 0;
    } else if (++count > 9000) {
      endAbsentSession();
    }

    animationFrameRef.current = requestAnimationFrame(detectPose);
  };

  const startMeasurementProcess = async () => {
    await startConnection();

    await setupCamera();
    await loadPoseLandmarker();

    if (streamRef.current) startRecording(streamRef.current);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setElapsedTime();
    }, 1000);

    animationFrameRef.current = requestAnimationFrame(detectPose);
  };

  const stopMeasurementProcess = () => {
    if (!streamRef.current) return;

    if (landmarkStorageRef.current.length > 0) {
      sendMessage(landmarkStorageRef.current);
      landmarkStorageRef.current = [];
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    stopRecording();

    closeConnection();

    streamRef.current.getTracks().forEach((track) => track.stop());
    setStream(null);

    if (!videoRef.current) return;
    videoRef.current.srcObject = null;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    landmarkerRef.current = null;
    setLandmarkResult(null);

    clearSessionAlerts();
    setNewAlertCount(0);
  };

  useEffect(() => {
    if (isMeasuring) startMeasurementProcess();
    else stopMeasurementProcess();
  }, [isMeasuring]);

  useEffect(() => {
    if (stream) streamRef.current = stream;
    else streamRef.current = null;
  }, [stream]);

  useEffect(() => {
    if (landmarkerRef.current === null) return;

    detectPose();
  }, [landmarkerRef]);

  useEffect(() => {
    if (!receivedData || !receivedData.videoPreSignedUrl) return;

    addSessionAlert(receivedData);

    setNewAlertCount(newAlertCount + 1);
  }, [receivedData]);

  return (
    <>
      <S.HiddenVideo ref={videoRef} style={{ display: "none" }} />
    </>
  );
};

export default MeasurementService;
