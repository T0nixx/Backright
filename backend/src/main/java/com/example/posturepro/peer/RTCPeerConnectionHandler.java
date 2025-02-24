package com.example.posturepro.peer;

import static java.util.Objects.*;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.posturepro.peer.observer.CreateDescriptionObserver;
import com.example.posturepro.peer.observer.SetDescriptionObserver;
import com.example.posturepro.pose.PoseAnalyzer;
import com.example.posturepro.pose.PoseAnalyzerFactory;
import com.example.posturepro.pose.response.AbstractResponse;
import com.example.posturepro.pose.response.ResponseType;
import com.example.posturepro.signaling.IceCandidateListener;

import dev.onvoid.webrtc.PeerConnectionFactory;
import dev.onvoid.webrtc.PeerConnectionObserver;
import dev.onvoid.webrtc.RTCAnswerOptions;
import dev.onvoid.webrtc.RTCConfiguration;
import dev.onvoid.webrtc.RTCDataChannel;
import dev.onvoid.webrtc.RTCDataChannelBuffer;
import dev.onvoid.webrtc.RTCDataChannelObserver;
import dev.onvoid.webrtc.RTCDataChannelState;
import dev.onvoid.webrtc.RTCIceCandidate;
import dev.onvoid.webrtc.RTCIceConnectionState;
import dev.onvoid.webrtc.RTCIceServer;
import dev.onvoid.webrtc.RTCPeerConnection;
import dev.onvoid.webrtc.RTCSessionDescription;

public class RTCPeerConnectionHandler implements PeerConnectionObserver {
	private RTCPeerConnection localPeerConnection;
	private final String rtcSessionId;
	private RTCDataChannel localDataChannel;

	private final String websocketSessionId;
	private final IceCandidateListener iceCandidateListener;

	private final Logger logger = LoggerFactory.getLogger(RTCPeerConnectionHandler.class);
	private final PoseAnalyzer poseAnalyzer;
	private final PeerConnectionEndListener connectionEndListener;

	public RTCPeerConnectionHandler(PeerConnectionFactory factory, String websocketSessionId,
		IceCandidateListener iceCandidateListener,
		PoseAnalyzerFactory poseAnalyzerFactory, String providerId, String rtcSessionId,
		PeerConnectionEndListener connectionEndListener) {
		this.websocketSessionId = websocketSessionId;
		this.iceCandidateListener = iceCandidateListener;
		this.rtcSessionId = rtcSessionId;
		this.connectionEndListener = connectionEndListener;
		RTCConfiguration config = new RTCConfiguration();
		RTCIceServer iceServer = new RTCIceServer();
		iceServer.urls.add("turn:i12a601.p.ssafy.io:3478");
		iceServer.username = "username";
		iceServer.password = "password";

		config.iceServers.add(iceServer);

		localPeerConnection = factory.createPeerConnection(config, this);

		this.poseAnalyzer = poseAnalyzerFactory.create(providerId);
	}

	public void addIceCandidate(RTCIceCandidate candidate) {
		logger.info("[Handler::addIceCandidate] candidate added");
		localPeerConnection.addIceCandidate(candidate);
	}

	@Override
	public void onIceCandidate(RTCIceCandidate candidate) {
		if (iceCandidateListener != null) {
			iceCandidateListener.onIceCandidate(websocketSessionId, candidate);
		}
	}

	@Override
	public void onIceConnectionChange(RTCIceConnectionState state) {
		if (iceCandidateListener != null) {
			try {
				iceCandidateListener.onIceConnectionChange(websocketSessionId, state);
			} catch (IOException e) {
				throw new RuntimeException(e);
			}
		}
	}

	@Override
	public void onDataChannel(RTCDataChannel dataChannel) {
		logger.info("Data Channel");
		localDataChannel = dataChannel;
		localDataChannel.registerObserver(new RTCDataChannelObserver() {

			@Override
			public void onBufferedAmountChange(long previousAmount) {
			}

			@Override
			public void onStateChange() {
				var state = localDataChannel.getState();
				logger.info("Data Channel State is changed into {}", state);
				if (state == RTCDataChannelState.CLOSED) {
					poseAnalyzer.endSession();
					if (connectionEndListener != null) {
						connectionEndListener.onConnectionEnded(rtcSessionId);
					}
				}
			}

			@Override
			public void onMessage(RTCDataChannelBuffer buffer) {

				String receivedText = decodeMessage(buffer);
				// logger.info("Received Text {}",receivedText);

				AbstractResponse response = poseAnalyzer.analyzePoseDataProcess(receivedText);
				// logger.info("Sending Text {}", response.toJSONString());

				try {
					sendTextMessage(response.toJSONString());

					if (response.getResponseType() == ResponseType.DISCONNECT_RESPONSE) {
						if (connectionEndListener != null) {
							connectionEndListener.onConnectionEnded(rtcSessionId);
						}
						close(); // 세션 종료
					}
				} catch (Exception e) {
					throw new RuntimeException("Send Text Message Failed.");
				}
			}
		});
	}

	public RTCSessionDescription createAnswer() throws Exception {
		CreateDescriptionObserver createObserver = new CreateDescriptionObserver();
		SetDescriptionObserver setObserver = new SetDescriptionObserver();

		localPeerConnection.createAnswer(new RTCAnswerOptions(), createObserver);

		RTCSessionDescription answerDesc = createObserver.get();

		localPeerConnection.setLocalDescription(answerDesc, setObserver);
		setObserver.get();

		return answerDesc;
	}

	public void setRemoteDescription(RTCSessionDescription description) throws Exception {
		SetDescriptionObserver setObserver = new SetDescriptionObserver();

		localPeerConnection.setRemoteDescription(description, setObserver);
		setObserver.get();
	}

	void sendTextMessage(String message) throws Exception {
		ByteBuffer data = ByteBuffer.wrap(message.getBytes(StandardCharsets.UTF_8));
		RTCDataChannelBuffer buffer = new RTCDataChannelBuffer(data, false);

		localDataChannel.send(buffer);
	}

	void close() {
		if (nonNull(localDataChannel)) {
			localDataChannel.unregisterObserver();
			localDataChannel.close();
			localDataChannel.dispose();
			localDataChannel = null;
		}

		if (nonNull(localPeerConnection)) {
			localPeerConnection.close();
			localPeerConnection = null;
		}
	}

	private String decodeMessage(RTCDataChannelBuffer buffer) {
		ByteBuffer byteBuffer = buffer.data;
		byte[] payload;

		if (byteBuffer.hasArray()) {
			payload = byteBuffer.array();
		} else {
			payload = new byte[byteBuffer.limit()];

			byteBuffer.get(payload);
		}

		return new String(payload, StandardCharsets.UTF_8);
	}

	public void resetPoseAnalyzer() {
		poseAnalyzer.resetSession();
	}

	RTCSessionDescription getRemoteDescription() {
		return localPeerConnection.getRemoteDescription();
	}
}
