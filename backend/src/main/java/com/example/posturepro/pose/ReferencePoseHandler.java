package com.example.posturepro.pose;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.EnumMap;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.posturepro.detection.entity.DetectionType;

import lombok.Getter;

public class ReferencePoseHandler {
	private static final int MAX_HISTORY_SIZE = 100;        // 큐의 최대 크기
	private static final int[] USED_LANDMARK_INDEXES = {   // 사용할 BodyLandmarkName의 인덱스 배열
		BodyLandmarkName.NOSE.ordinal(),
		BodyLandmarkName.LEFT_EAR.ordinal(),
		BodyLandmarkName.RIGHT_EAR.ordinal(),
		BodyLandmarkName.LEFT_SHOULDER.ordinal(),
		BodyLandmarkName.RIGHT_SHOULDER.ordinal(),
		BodyLandmarkName.LEFT_HIP.ordinal(),
		BodyLandmarkName.RIGHT_HIP.ordinal()
	};

	// 축 정의 enum
	enum Axis {X, Y, Z}

	private final Deque<BodyLandmark[]> poseHistoryQueue;  // 최근 포즈 데이터를 유지하는 큐
	private final BodyLandmark[] referencePose;            // 기준 포즈
	private final Logger logger;
	@Getter
	private boolean referencePoseInitialized;                             // 기준 포즈 설정 여부

	double refEarsYDifference, refEarsToShoulderZDifference;

	// 생성자
	public ReferencePoseHandler() {
		this.poseHistoryQueue = new ArrayDeque<>();
		this.referencePose = new BodyLandmark[BodyLandmarkName.values().length];
		this.logger = LoggerFactory.getLogger(ReferencePoseHandler.class);

		resetReferencePose();
	}

	// 초기자세 초기화
	public void resetReferencePose() {
		for (int i = 0; i < referencePose.length; i++) {
			referencePose[i] = new BodyLandmark();
		}
		this.referencePoseInitialized = false;
		this.poseHistoryQueue.clear();
	}

	// 기준 포즈를 설정하는 메서드
	public boolean setReferencePose(BodyLandmark[] pose) {
		// 포즈 히스토리에 추가하고, 최대 10개까지만 유지
		poseHistoryQueue.add(pose);
		if (poseHistoryQueue.size() > MAX_HISTORY_SIZE) {
			poseHistoryQueue.pollFirst();  // 가장 오래된 데이터 제거
		}

		// 각 노드의 중앙값 계산 및 유효성 검사
		for (int i : USED_LANDMARK_INDEXES) {
			double medianX = getMedian(i, Axis.X);
			double medianY = getMedian(i, Axis.Y);
			double medianZ = getMedian(i, Axis.Z);

			if (Math.abs(pose[i].x - medianX) > 0.03) {
				poseHistoryQueue.pollFirst();  // 가장 오래된 데이터 제거
				return false;  // 중앙값에서 0.05 이상 벗어나면 유효하지 않음
			}
			if (Math.abs(pose[i].y - medianY) > 0.03) {
				poseHistoryQueue.pollFirst();  // 가장 오래된 데이터 제거
				return false;  // 중앙값에서 0.05 이상 벗어나면 유효하지 않음
			}
			// 유효한 포즈가 기준에 도달하면 기준 포즈 설정
			if (poseHistoryQueue.size() == MAX_HISTORY_SIZE) {
				referencePose[i] = new BodyLandmark(medianX, medianY, medianZ);
			}

		}

		// 유효한 포즈가 기준에 도달하면 기준 포즈 설정됨 반환
		if (poseHistoryQueue.size() >= MAX_HISTORY_SIZE) {
			// 양 귀의 중간 z 값과 양 어깨의 중간 z 값의 차이
			refEarsToShoulderZDifference =
				// 양 귀의 중간 z 값
				(referencePose[BodyLandmarkName.LEFT_EAR.ordinal()].getZ()
					+ referencePose[BodyLandmarkName.RIGHT_EAR.ordinal()].getZ()) / 2 -
					// 양 어깨의 중간 z 값
					(referencePose[BodyLandmarkName.LEFT_SHOULDER.ordinal()].getZ()
						+ referencePose[BodyLandmarkName.RIGHT_SHOULDER.ordinal()].getZ()) / 2;

			// 양 귀 y 값의 차이
			refEarsYDifference =
				referencePose[BodyLandmarkName.LEFT_EAR.ordinal()].getY()
					- referencePose[BodyLandmarkName.RIGHT_EAR.ordinal()].getY();

			referencePoseInitialized = true;
			return true;
		}

		return false;
	}

	// 특정 노드에서 축의 중앙값을 계산하는 메서드
	private double getMedian(int nodeIndex, Axis axis) {
		List<Double> values = new ArrayList<>();
		for (BodyLandmark[] pose : poseHistoryQueue) {
			switch (axis) {
				case X -> values.add(pose[nodeIndex].x);
				case Y -> values.add(pose[nodeIndex].y);
				case Z -> values.add(pose[nodeIndex].z);
			}
		}
		return calculateMedian(values);
	}

	// 중앙값 계산 로직 메서드
	private double calculateMedian(List<Double> values) {
		values.sort(Double::compareTo);
		int size = values.size();

		if (size % 2 == 0) {
			return (values.get(size / 2 - 1) + values.get(size / 2)) / 2.0;
		} else {
			return values.get(size / 2);
		}
	}

	// 현재 포즈가 기준 포즈와 일치하는지 검사
	public EnumMap<DetectionType, Boolean> validatePoseMatching(BodyLandmark[] pose) {
		EnumMap<DetectionType, Boolean> validationResults = new EnumMap<>(DetectionType.class);

		// 데이터 확인용
		// logger.info("");
		// for (int i: USED_LANDMARK_INDEXES) {
		// 	logger.info(i+"\t- x:"+pose[i].x+"\ty:"+pose[i].y+" \tz:"+pose[i].z);
		// }

		validationResults.put(DetectionType.NECK, validateNeckCondition(pose));
		validationResults.put(DetectionType.LEFT_SHOULDER, validateLeftShoulderCondition(pose));
		validationResults.put(DetectionType.RIGHT_SHOULDER, validateRightShoulderCondition(pose));
		validationResults.put(DetectionType.BACK, validateBackCondition(pose));

		// 양쪽 어깨가 내려와 있다면 등도 굽어 있을 것이다.
		if (!validationResults.get(DetectionType.LEFT_SHOULDER)
			&& !validationResults.get(DetectionType.RIGHT_SHOULDER)) {
			validationResults.put(DetectionType.BACK, false);
		}

		return validationResults;
	}

	// 고개가 기울어져 있거나 앞으로 뻗어있다면 false, 바르다면 true
	private boolean validateNeckCondition(BodyLandmark[] pose) {
		// 현재 포즈의 양 귀의 중간 z 값
		double poseMiddleZofEar =
			(pose[BodyLandmarkName.LEFT_EAR.ordinal()].getZ() + pose[BodyLandmarkName.RIGHT_EAR.ordinal()].getZ()) / 2;

		// 현재 포즈의 양 여깨의 중간 z 값
		double poseMiddleZofShoulder =
			(pose[BodyLandmarkName.LEFT_SHOULDER.ordinal()].getZ()
				+ pose[BodyLandmarkName.RIGHT_SHOULDER.ordinal()].getZ()) / 2;

		// 현재 포즈의 양 귀의 중간 z 값과 양 어깨의 중간 z 값의 차이
		double poseEarsToShoulderZDifference = poseMiddleZofEar - poseMiddleZofShoulder;

		// 양 귀 y(높이) 값의 차이 = 머리 기울기
		double poseEarsYDifference =
			pose[BodyLandmarkName.LEFT_EAR.ordinal()].getY() - pose[BodyLandmarkName.RIGHT_EAR.ordinal()].getY();

		// 데이터 확인용 P = pose, E = ear, 2 = to, G = gap, R = reference pose / right, L = left
		// logger.info(
		// 	"\n\tPE2S   {}\n\tRE2S   {}\n\tGRE2S  {}\n\tLE     {}\n\tRLE    {}\n\tRE    {}\n\tRRE    {}\n\tYgap   {}\n\tRYgap  {}",
		// 	poseEarsToShoulderZDifference, refEarsToShoulderZDifference,
		// 	Math.abs(poseEarsToShoulderZDifference - refEarsToShoulderZDifference),
		// 	pose[BodyLandmarkName.LEFT_EAR.ordinal()], referencePose[BodyLandmarkName.LEFT_EAR.ordinal()],
		// 	pose[BodyLandmarkName.RIGHT_EAR.ordinal()], referencePose[BodyLandmarkName.RIGHT_EAR.ordinal()],
		// 	poseEarsYDifference, refEarsYDifference
		// );

		// 데이터 확인용 Z = 거북목 Y = 기울임
		// logger.info("\n\tZ difference {}\n\tY difference {}",
		// 	poseEarsToShoulderZDifference - refEarsToShoulderZDifference,
		// 	Math.abs(poseEarsYDifference - refEarsYDifference));

		// 고개가 꺽여있을 때 false
		if (Math.abs(poseEarsYDifference - refEarsYDifference) > 0.02) {
			return false;
		}

		// 고개가 앞으로 나와있을 때 false
		return poseEarsToShoulderZDifference - refEarsToShoulderZDifference > -0.01;
	}

	// 원래 자세보다 0.02 이상 y좌표(높이)가 달라지면 false 아니면 true
	private boolean validateLeftShoulderCondition(BodyLandmark[] pose) {
		return
			Math.abs(referencePose[BodyLandmarkName.LEFT_SHOULDER.ordinal()].y
				- pose[BodyLandmarkName.LEFT_SHOULDER.ordinal()].y) < 0.02;
	}

	// 원래 자세보다 0.02 이상 y좌표(높이)가 달라지면 false 아니면 true
	private boolean validateRightShoulderCondition(BodyLandmark[] pose) {
		return
			Math.abs(referencePose[BodyLandmarkName.RIGHT_SHOULDER.ordinal()].y
				- pose[BodyLandmarkName.RIGHT_SHOULDER.ordinal()].y) < 0.02;
	}

	// 원래 자세보다 0.02 이상 x좌표(좌/우)가 달라지면 false 아니면 true
	private boolean validateBackCondition(BodyLandmark[] pose) {
		// 왼쪽 엉덩이 추정값으로 측정한다 - 앉는 의자 특성상 엉덩이가 보이지 않아
		// 								어꺠를 기준으로 아래에 있다고 추정된 값이다.

		// logger.info("\n\tpose Hip {}\n\tref Hip  {}\n\thip gap  {}",
		// 	pose[BodyLandmarkName.LEFT_HIP.ordinal()].getX(), referencePose[BodyLandmarkName.LEFT_HIP.ordinal()].getX(),
		// 	Math.abs(pose[BodyLandmarkName.LEFT_HIP.ordinal()].getX()
		// 		- referencePose[BodyLandmarkName.LEFT_HIP.ordinal()].getX()));
		return Math.abs(pose[BodyLandmarkName.LEFT_HIP.ordinal()].getX()
			- referencePose[BodyLandmarkName.LEFT_HIP.ordinal()].getX()) < 0.02;
	}
}