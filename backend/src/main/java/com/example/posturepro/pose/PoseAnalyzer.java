package com.example.posturepro.pose;

import java.time.Instant;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.posturepro.analyzingsession.entity.AnalyzingSession;
import com.example.posturepro.analyzingsession.entity.AnalyzingSessionStatus;
import com.example.posturepro.analyzingsession.service.AnalyzingSessionService;
import com.example.posturepro.api.s3.component.S3Component;
import com.example.posturepro.detection.entity.CreateDetectionDto;
import com.example.posturepro.detection.entity.Detection;
import com.example.posturepro.detection.entity.DetectionType;
import com.example.posturepro.detection.service.DetectionService;
import com.example.posturepro.pose.response.AbstractResponse;
import com.example.posturepro.pose.response.DisconnectResponse;
import com.example.posturepro.pose.response.PoseResponse;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

public class PoseAnalyzer {
	private final ObjectMapper jsonMapper;  // JSON 파싱을 위한 ObjectMapper
	private final ReferencePoseHandler referencePoseHandler;    // 기준 포즈 설정 및 체크를 위한 객체
	private static final Logger logger = LoggerFactory.getLogger(PoseAnalyzer.class);

	private final DetectionService detectionService;
	private final AnalyzingSessionService analyzingSessionService;
	private final S3Component s3Component;
	private final String providerId;

	private long detectionId;
	private AnalyzingSession session;
	private int continuousDetectionCount;

	private final int ALERT_DETECTION_THRESHOLD = 30; // 10seconds - 3 messages per second
	private final int DETECTION_THRESHOLD = 8;
	private final int FORCED_DISCONECTION_THRESHOLD = 2700; // 15 minutes 3 * 60 * 15

	private final Map<DetectionType, Integer> detectionCounts;

	public PoseAnalyzer(AnalyzingSessionService analyzingSessionService, DetectionService detectionService,
		S3Component s3Component, String providerId) {
		this.analyzingSessionService = analyzingSessionService;
		this.detectionService = detectionService;
		this.s3Component = s3Component;
		this.providerId = providerId;
		this.jsonMapper = new ObjectMapper();
		this.referencePoseHandler = new ReferencePoseHandler();

		this.session = analyzingSessionService.createSession(providerId);
		this.detectionCounts = new EnumMap<>(DetectionType.class);
		initializeDetectionCounts();
	}

	private void initializeDetectionCounts() {
		detectionCounts.clear();
		for (DetectionType type : DetectionType.values()) {
			detectionCounts.put(type, 0);
		}
	}

	// 파싱된 포즈 데이터를 기준 포즈로 설정
	public AbstractResponse analyzePoseDataProcess(String jsonData) {
		// 33개 랜드마크로 이루어진 포즈 데이터 10개가 들어온다
		List<BodyLandmark[]> parsedPoseDataList = parsePoseDataFromJson(jsonData);

		PoseResponse response = new PoseResponse(session.getId());

		initializeDetectionCounts();

		for (BodyLandmark[] pose : parsedPoseDataList) {
			if (!referencePoseHandler.isReferencePoseInitialized()) {
				response.setReferenceSet(referencePoseHandler.setReferencePose(pose));
				continue;
			}

			EnumMap<DetectionType, Boolean> validationResult = referencePoseHandler.validatePoseMatching(pose);
			updateDetectionCounts(validationResult);
		}

		PartProblemStatus problemStatus = updateDetectionStatus();
		response.setProblemPart(problemStatus);

		if (continuousDetectionCount >= ALERT_DETECTION_THRESHOLD) {
			response.setPoseCollapsed(true);

			if (detectionId == 0) {
				Detection detection = createDetection(problemStatus);

				detectionId = detection.getId();
				Map<String, String> s3VideoData = fetchPreSignedVideoUrl(detectionId);
				detectionService.updateVideoUrl(detectionId, s3VideoData.get("videoUrl"));
				response.setDetectionId(detection.getId());
				response.setStartedAt(detection.getStartedAt());
				response.setVideoPreSignedUrl(s3VideoData.get("videoPreSignedUrl"));
			}

			if (continuousDetectionCount > FORCED_DISCONECTION_THRESHOLD) {
				forceEndSession();
				return new DisconnectResponse();
			}
		}

		return response;
	}

	private Detection createDetection(PartProblemStatus problemStatus) {
		CreateDetectionDto detectionDto = new CreateDetectionDto();
		detectionDto.setStartedAt(Instant.now());
		detectionDto.setProblemParts(problemStatus);
		detectionDto.setSession(session);
		return detectionService.createDetection(detectionDto);
	}

	private Map<String, String> fetchPreSignedVideoUrl(Long detectionId) {
		String providerId = this.providerId;
		String videoFileName = "detection:" + detectionId;
		return s3Component.generatePreSignedUrls(providerId, videoFileName, null);
	}

	// JSON 형식의 문자열을 파싱하여 PoseNode 객체 배열로 변환
	private List<BodyLandmark[]> parsePoseDataFromJson(String jsonData) {
		List<BodyLandmark[]> parsedPosesData = new ArrayList<>();
		try {
			// JSON 문자열을 객체 배열로 파싱
			List<List<BodyLandmark>> rawPoseData = jsonMapper.readValue(jsonData,
				new TypeReference<>() {
				});

			// 각 PoseNode 배열로 변환하여 리스트에 추가
			for (List<BodyLandmark> poseArray : rawPoseData) {
				parsedPosesData.add(poseArray.toArray(new BodyLandmark[0]));
			}
		} catch (Exception e) {
			logger.error("Failed to convert pose data from Json: {}", e.getMessage());
		}
		return parsedPosesData;
	}

	private void updateDetectionCounts(EnumMap<DetectionType, Boolean> validationResult) {
		validationResult.forEach((key, isValid) -> {
			if (!isValid) {
				detectionCounts.compute(key, (k, v) -> v + 1);
			}
		});
	}

	private PartProblemStatus updateDetectionStatus() {
		boolean countIncreased = false;
		PartProblemStatus problemStatus = new PartProblemStatus();

		for (Map.Entry<DetectionType, Integer> entry : detectionCounts.entrySet()) {
			// logger.info("detectionCount {} {}", entry.getKey(), entry.getValue());
			if (entry.getValue() >= DETECTION_THRESHOLD) {
				if (!countIncreased) {
					continuousDetectionCount++;
					countIncreased = true;
				}
				problemStatus.markProblem(entry.getKey());
			}
		}

		// 자세가 바른 상태일 때
		if (!countIncreased) {
			endDetection();
		}

		return problemStatus;
	}

	private void endDetection() {
		if (detectionId != 0) {
			detectionService.endDetection(detectionId);

			detectionId = 0;
		}
		continuousDetectionCount = 0;
	}
	
	public void endSession() {
		analyzingSessionService.endSession(session, AnalyzingSessionStatus.FINISHED);
	}

	public void forceEndSession() {
		endDetection();
		analyzingSessionService.endSession(session, AnalyzingSessionStatus.FORCED);
	}

	public void resetSession() {
		endSession();
		this.session = analyzingSessionService.createSession(providerId);
	}
}