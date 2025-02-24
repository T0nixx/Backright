package com.example.posturepro.peer;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Logger;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.example.posturepro.pose.PoseAnalyzerFactory;
import com.example.posturepro.signaling.IceCandidateListener;

import dev.onvoid.webrtc.PeerConnectionFactory;
import dev.onvoid.webrtc.media.audio.AudioDeviceModule;
import dev.onvoid.webrtc.media.audio.AudioLayer;

@Service
public class RTCPeerConnectionManager implements PeerConnectionEndListener {
	private static final Logger logger = Logger.getLogger(RTCPeerConnectionManager.class.getName());

	// 현재 활성화된 Peer Connection 핸들러를 저장하는 맵 (RTC sessionId -> RTCPeerConnectionHandler)
	private final Map<String, RTCPeerConnectionHandler> peerConnectionMap = new ConcurrentHashMap<>();
	private final PoseAnalyzerFactory poseAnalyzerFactory;
	private final PeerConnectionFactory peerConnectionFactory;

	RTCPeerConnectionManager(PoseAnalyzerFactory poseAnalyzerFactory) {
		this.poseAnalyzerFactory = poseAnalyzerFactory;
		this.peerConnectionFactory = new PeerConnectionFactory(new AudioDeviceModule(AudioLayer.kDummyAudio));
	}

	// 새로운 RTC Peer Connection을 생성하고 반환
	public String createPeerConnection(IceCandidateListener listener, String webSocketSessionId, String providerId) {
		String rtcSessionId = UUID.randomUUID().toString();
		RTCPeerConnectionHandler handler = new RTCPeerConnectionHandler(peerConnectionFactory, webSocketSessionId,
			listener,
			poseAnalyzerFactory, providerId, rtcSessionId, this);
		peerConnectionMap.put(rtcSessionId, handler);
		logger.info("새로운 RTC Peer Connection 생성됨: " + rtcSessionId);
		return rtcSessionId;
	}

	public RTCPeerConnectionHandler getPeerConnection(String rtcSessionId) {
		return peerConnectionMap.get(rtcSessionId);
	}

	public void removePeerConnection(String rtcSessionId) {
		this.peerConnectionMap.remove(rtcSessionId);
	}

	@Override
	public void onConnectionEnded(String rtcSessionId) {
		peerConnectionMap.remove(rtcSessionId);
		logger.info("RTC Peer Connection 종료됨: " + rtcSessionId);
	}

	public void restartConnection(String rtcSessionId) {
		RTCPeerConnectionHandler handler = peerConnectionMap.get(rtcSessionId);
		if (handler != null) {
			handler.resetPoseAnalyzer();
			logger.info("RTC Peer Connection 초기화됨: " + rtcSessionId);
		}
	}

	@Scheduled(cron = "0 0 0 * * *", zone = "Asia/Seoul")
	public void closeAllConnectionsAtMidnight() {
		logger.info("지정된 시간이 되어 모든 RTC Peer Connection을 재설정합니다.");
		for (String rtcSessionId : peerConnectionMap.keySet()) {
			restartConnection(rtcSessionId);
		}
	}
}

