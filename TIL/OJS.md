# TIL (Today I Learned)

## 2025-01-13

- 프로젝트 기획 과정에서 고려해야 할 것
  - Pain Point와 Charming Point

## 2025-01-14

- 프로젝트 기획 과정에서 고려해야 할 것 2...
  - 같은 기능이라도 조금 더 구체적이고 공감할 수 있는 상황과 페르소나

## 2025-01-15

- Git 기초와 branch 전략
  - commit, branch, merge
  - git flow, github flow, gitlab flow
    - 프로젝트 환경에 맞는 브랜치 전략 사용하기
- Pose Estimation AI [리서치](https://github.com/google-ai-edge/mediapipe) 및 [테스트](https://mediapipe-studio.webapps.google.com/demo/pose_landmarker?hl=ko)
- 자세 예측으로 나온 결과물을 바탕으로 올바른 자세인지 확인하는 문제를 어떻게 치환시킬지?
  - classification이라면 [예시](https://teachablemachine.withgoogle.com/train/pose)

## 2025-01-16

### 개인 생산성 향상법

- TODO -> 더 나은 무언가는 없나?

- GTD (Get Things Done)

  - 할 일을 알고리즘에 따라 분류
    - Is actionable? -> trash | reference | someday
  - 다음 액션

    - 싱글
      - 2분 바로
      - no -> defer | delegate
    - 멀티

  - PQ 맨 밑에서 계속 남는다면 버린다

- 아이젠하워 매트릭스

  - Urgent, Important, Not Urgent, Not Important

- 만트라트

  - 오타니

- 뽀모도로

  - 25분 5분 -> 4번 후 휴식

- 타임 박싱

  - 일정 시간 내에 특정 작업을 끝내겠다는 목표를 세우는 것

- 타임 블로킹

  - Focus time -> 특정 시간 동안 자기 업무에만

- PARA method

  - Project: 진행중
  - Area: 관심
  - Resource: 링크 같은 것
  - Archive: 완료 후 아카이빙
  - second brain
    - 내 뇌와 비슷한 방식으로 정보를 저장해두자

- 제텔카스텐 (메모 상자)
  1. 임시적, 영구적 메모를 수시로 작성
  2. 연관된 메모들을 인덱스 카드로 관리
  3. 연관된 메모들끼리도 서로 가리키게 기록

### WebRTC

- 플러그인 없이 웹 브라우저에서 실시간 통신을 구현
- 프로젝트에서 어떻게 WebRTC 사용할 지 구상

### 프로젝트

- 프로젝트 기획 구체화
- Jira 설정

## 2025-01-17

### 프로젝트와 기술, 포폴

- 왜 이 기술을 썼는가
- 기술에 대한 당위성
- FAQ
  - Q1. 프로젝트가 많아야 할까요?
  - A. 많으면 Job Description에 딱 맞는 포폴할 땐 Good
  - Q2. 프로젝트가 화려해야할까요?
  - A. Y -> 공채 필터링 피해야 N -> 팀별 모집 팀에 맞는 스택 | 경험
- Base가 되는 포폴 하나를 두고 지원할 때마다 조금씩- 튜닝

### 기획 구체화

- 예상되는 문제점들을 정리하고 해당 문제들을 어떻게 처리할 지 고민해보는 시간을 가졌습니다.
  - 자리비움 / 인식불가 문제
  - 일일 기준 집계시간을 언제로 할지
- Usecase Diagram

### Media Recorder API

- 자세가 무너졌음을 감지했을 때 해당 영상을 다시 보여줘서 사용자에게 다시 보여줄 방법으로 채택해보고자 공부
- 브라우저에서 영상을 일정 주기로 저장하고 플레이 백하는 방법'

## 2025-01-20

### 탐지 및 보고서 관련 DB 설계

- 실시간 탐지 서비스 특성상 한번 탐지된 내용에 변화가 일어날 가능성이 매우 낮다
- 각 session은 user_id를 참조한다
- 각 detection은 session_id를 참조한다
- 각 session에 대한 통계 데이터를 미리 캐싱한다면 성능을 높일 수 있을 것
  <br>
  → report 테이블을 유지한다? - 예상 문제점

      1. report 내부의 데이터들은 무결성을 보장할 수 없다

          → session과 detection은 session이 종료된 순간 수정될 여지가 없다.

      2. report 내부의 데이터를 정규화하는 것이 더 큰 오버헤드를 발생 시킨다.

          → nosql을 써본다? user 테이블을 nosql과 rdbms 양쪽에 유지해야하지 않나? → 기각

- 결론: 비정규화된 형태로 report 테이블을 구성해보는 것도 좋을 듯 → 추가 성능 향상 필요 시 고려

## 2025-01-21

### Indexing

- Clustered Index:
  - PK
  - 실제로 군집해 있고 물리적 정렬로 관리
  - 삽입 삭제 시 새로 정렬 -> 비교적 느림
- Non-Clustered Index:
  - 목차
  - 별도 공간에 저장
  - PK 보다 삽입 삭제 빠르지만 리소스 필요
  - 여러 공간을 참조하는데 드는 시간에 대한 고려 필요
- B-tree, B+tree
  - B+tree는 leaf node를 linked list로 연결 -> 범위 검색에 유리
- Indexing 팁
  - join 키
  - 카디널리티가 높은 값

### WebRTC 통신의 흐름

- Signaling
  - WebRTC 연결을 설정하기 위해 두 Peer가 서로 연결 정보를 교환하는 과정
    1. SDP 교환: 세션 정보 기술
    2. ICE Candidate 교환: P2P 연결에 사용되는 네트워크 정보
  - WebRTC는 Signaling 방법을 정의하지 않기 때문에 다른 통신 프로토콜을 사용해서 두 Peer간 Signaling을 진행한다.
- ICE Gathering
  1. ICE Agent: 각 Peer가 네트워크 경로 검색
  2. ICE Candidate 수집: 발견한 네트워크 경로를 상대방에 전달
- NAT Traversal
  - NAT 뒤에 있는 Peer간 연결
  1. STUN
  2. TURN
- Connection
  1. ICE Candidate 검증
  2. DTLS 설정: Data Transport Layer Security 보안 설정
  3. SRTP/SCTP 채널
     - SRTP: 오디오/비디오 스트림
     - SCTP: 데이터 스트림

### 오늘의 Trouble shooting

1. Kurento는 미디어 서버고 우리는 데이터만 송수신하면 되는데 필요 없는거 아닐까?
2. Kurento 없이 그냥 Signaling 후에 데이터를 송수신하려고하니 WebRTC가 통신 흐름에서 없어졌다.
3. Kurento에서 Data Channel을 이용해서 Data를 송수신 하려고 했는데 서버는 중개만 할 뿐 Kurento Client를 통해서는 접근할 수 없었다.
4. 서버를 하나의 Peer로 만들어야 할 것 같다. -> 어떻게 해야할까...

## 2025-01-22

### webrtc-java

- server내에 peer를 만드는 일환으로 Java에서 WebRTC API를 구현해 놓은 [Webrtc-java](https://github.com/devopvoid/webrtc-java) repo를 사용해보기로 했다.
- webrtc-java는 demo나 documentation이 따로 준비돼있지 않아 test code와 코드를 보며 사용법을 유추해보고 있다.
- webrtc-java가 mdn의 WebRTC를 충실히 구현했다면 MDN의 [자바스크립트 예시](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling)를 바탕으로 비슷하게 구현할 수 있을 것이라고 판단했다.
- 대부분의 내용과 흐름을 확인했고 WebSocket으로 client에서 offer를 넣는 시그널링 작업의 초입부까지 구현했다.

## 2025-01-23

### WebRTC

- webrtc-java를 사용해서 peer를 띄우는 것 까지는 성공했다.
- Observer 패턴을 사용해서 SetDesciption, CreateDescription, PeerConnection 을 관리하는데 직접 구현해야 하는 부분과 그렇지 않은 부분을 잘 분리하는 게 관건이였다.
- 대략의 흐름
  1. js 쪽 client에서 offer를 만들어 SignalingHandler에 송신
  2. SignalingHandler에서 Java쪽 PeerConnection 옵저버에게 전달
  3. SetRemoteDescription
  4. createAnswer
  5. session을 통해 answer 송신
  - offer가 도착하는 시점 즈음부터 ICE Candidate를 서로 주고받는 것으로 보인다.
  - onIceCandidate는 local에서 ICE Agent가 Candidate를 발견했을 때 trigger
  - onNewIceCandidate는 세션을 통해 ICE Candidate를 수신 받았을 때 trigger
- 이런 흐름을 통해 ICE Candidate state 가 completed 되고 WebRTC state 도 stable인 상태까지 구현했다.
- 아직 이해가 되지 않는 점
  - ICE Candidate를 서로 주고 받는 과정이 언제 실행되는가?
    -> Data Channel을 연결하기 전까지는 ICE Servers에 ICE Server를 명시해도 ICE Candidate를 주고 받지 않았다.
- 내일 할 일
  1. Data Channel을 연결하고 Data를 주고 받는 것
  2. 여러 js Peer에 대해 동시에 처리할 능력이 있는지 테스트

## 2025-01-24

### WebRTC

- ICE candidate 교환 과정에서 java와 js에서 형식이 달라서 발생한 오류 수정
- Data Channel을 open하고 data를 주고 받는 과정
  - Data Channel은 양방향이고 한쪽이 open하면 반대쪽에서 onDataChannel 이벤트가 발생한다.
- WebSocket 세션은 비동기적으로 동작하기 때문에 이전에 있는 Message가 송신이 완료되지 않았을 때 새로운 메시지를 보내면 에러가 발생한다.
  - Answer 메시지가 도착하기전에 Ice Candidate 메시지를 보내서 발생했다.
  ```java
  Exception in thread "Thread-8" java.lang.IllegalStateException:
  The remote endpoint was in state [TEXT_PARTIAL_WRITING] which is an invalid state for called method
  at org.apache.tomcat.websocket.WsRemoteEndpointImplBase$StateMachine.checkState(WsRemoteEndpointImplBase.java:1250)
  ```
  -> 이를 해결하기 위해 SessionHandler를 만들고 Message를 큐에 넣어 하나씩 보내고 완료되면 다음껄 보내도록 수정
- 해야할 일 (부족하다고 느끼는 것)
  - WebSocket을 관리하는 `SignalingHandler`와 `PeerConnectionObserver`를 implements하는 `ServerConnection`의 강한 결합
    <br>-> `onIceCandidate` 이벤트를 `SignalingHandler`가 직접 해결할 수 없기 때문에 `ServerConnection` 내부에서 직접 session을 의존하는 구조
    - 이를 해결하기 위해 event listner를 추가해 느슨한 결합 구조로 바꾸고자함.
  - Prototype 완성하기
    - client-prototype 브랜치를 만들고 데이터 송수신까지 해서 올리기

## 2025-01-31

### WebRTC troublue shooting

- Meida 설정과 Data Channel을 열지 않은 채로 Create Offer를 수동으로 하고 Answer를 받으면 negotiatioNeeded event가 발생하지 않는다.
- 원래는 Offer와 Answer를 주고받은 후에 Data Channel을 만들었는데 이러면 negotiatioNeeded 가 한번 더 트리거 된다는 사실을 알게 되었다.
- 처음 PeerConnection을 만들 때 한쪽에서만 Data Channel을 열고 반대 쪽은 onDataChannel 이벤트를 설정해놓으니 알맞게 이벤트가 트리거 됐다.
- webrtc java 와 javascript RTC api가 서로 다른 형식의 Ice Candidate 구조체를 사용하는 부분에서 에러가 발생했다.
  - webrtc java 는
  ```json
  {
      type: "new-ice-candidate" // custom 가능
      candidate: {
          sdp : {
              // candidate 내용
          }
      }
  }
  ```
  - javascript는
  ```json
  {
      type: "new-ice-candidate" // custom 가능
      candidate: {
          candidate : {
              // candidate 내용
          }
      }
  }
  ```
- 이에 대한 처리가 올바르게 되지 않아 server 쪽은 ICEConnectionState가 Connecting으로 넘어갔는데 클라이언트 쪽은 new 에서 다른 State로 넘어가지 못했다.
  - 다른게 문제인 줄 알고 한참을 고민했다...

### 도커 사용 TURN server 구축 관련 삽질

- 처음 사용한 명령어
  ```docker
  docker run -d --name coturn \
  --restart always \
  -p 3478:3478/udp \
  -p 3478:3478/tcp \
  -p 5349:5349/tcp \
  -p 50000-51000:50000-51000/udp \
  -v ~/coturn/turnserver.conf:/etc/coturn/turnserver.conf \
  coturn/coturn:latest turnserver -c /etc/coturn/turnserver.conf
  ```

1. Error starting userland proxy: listen tcp4 0.0.0.0:3478: bind: address already in use.
   - 이유: ec2 인스턴스에 직접 coturn을 설치해서 테스트 해봤다가 해당 서비스가 켜져 있어서 에러가 발생했다
2. No relay server relay-ip
   - 이유: turnserver.conf에 relay-ip를 설정하지 않음
3. Cannot bind TLS/TCP listener
   - 이유: tls 관련 설정이 되지 않은 상태에서 no-tls 옵션을 넣지 않음
4. external-ip, relay-ip
   - 위 항목들에 각각 어떤 값을 넣어야하는지 제대로 이해하지 못했다.
   - external-ip는 인스턴스의 공개 ip, relay-ip는 docker가 부여받은 사설 ip

- 처음에는 TURN에서 사용하는 모든 포트를 사용하게 열었다가 너무 처음 시작하는데 오래 걸리는 것 같아 50000에서 51000개로 줄였다.
  - 그러나 이게 실제로 실행 속도에 영향을 미치는 지는 정확히 모르겠다.
  - linux 환경과 shell script에 대해 다시 공부를 해야겠다.
- 원래는 turnserver -c /etc/coturn/turnserver.conf 명령어가 뒤에 붙어 있었는데 실행되지 않아서 해당 명령어를 제거하니 제대로 실행됐다.
  - 이유에 대해서도 명확히 알고 싶은데 잘모르겠다...
- ```docker
  docker run --name coturn -p 3478:3478/udp -p 3478:3478/tcp -p 50000-51000:50000-51000/udp -v ~/coturn/turnserver.conf:/etc/coturn/turnserver.conf coturn/coturn:latest
  ```

## 2025-02-03

### 배포 관련

- nginx, spring boot, mysql 세개의 이미지를 활용해 docker compose를 사용해서 간단히 ec2에 배포를 해봤다.

## 2025-02-05

### TDD

- Test Deriven Development: 테스트 먼저, 구현은 나중에
- Behavior Deriven Development: 모든 함수와 조건문에 대한 테스트를 만들기 보다 유저의 행동에 집중하여 (Given When Then)

### 배포 관련

1. frontend

- node 이미지에서 NODE_ENV는 기본적으로 production인데 build 시에 devDependency(typescript)가 필요
- 인스톨 시에는 production을 false로로
  `RUN npm install -g pnpm && pnpm install --frozen-lockfile --production=false`

2. backend

- webrtc-java는 os에 따라 다른 네이티브 라이브러리를 필요로 하는데 build.gradle에 windows 것만 명시됨
- webrtc-java의 네이티브 라이브러리가 사용하는 특정 라이브러리가 openjdk:17-jdk-slim 이미지에 미설치
  ```Docker
  RUN apt-get update
  RUN apt-get install -y libpulse0
  RUN apt-get install -y libx11-6
  ```

3. nginx

- js의 getUserMedia는 ssl 환경에서만 작동함
- Let's Encrypt를 사용해서 무료 인증서를 받고 90일 마다 renew 하는 봇 코드 추가
  - 빌드할 때마다 발급 받다가 뭔가 이상하다고 느낄 쯤 5개 제한을 채워서 일단은 staging으로 받음
  - 서버에 저장해두고 볼륨에 넣어주는 방식으로 변경 필요

4. 그 외

- 프론트와 백엔드가 통신은 candidate를 주고 받는데 연결 수립이 안됨
  - STUN 구글이 테스트 용이라서?
  - backend가 도커의 내부 네트워크 안이라서 (사설 망) TURN이 필요해서?
- 둘 중 뭐가 됐든 TURN 서버가 필요했다
  - 전에 세팅해둔 TURN 서버를 켜서 작동을 확인했는데 RTC 연결 수립이 됐다 안됐다 한다 이유를 좀 더 알아봐야 겠다.
  - TURN이 필요한거라면 중간 서버를 반드시 거쳐야 하기 때문에 지연이 필연적이다.

## 2025-02-05

### turnserver 관련

- 여전히 정확한 이유는 파악하지 못했지만 relay만으로 TURN이 되도록 구현했을 때 연결 설립이 불안정한 것으로 보인다.
- IceTranspolicy를 ALL로 두고 TURN 서버 설정을 해두면 일단은 문제없이 작동하는 것으로 보인다.
- 매우 답답하다...

## 2025-02-06

### Pose 처리 관련 의존성 관리

- Pose를 분석하는 객체가 분석 세션, 탐지의 시작과 종료를 담당할 Service들을 의존해야한다.
- 이 의존성을 주입시켜주기 위해서는 의존성이 Signaling Handler까지 전파된다.
- Factory 패턴을 사용하면 Factory는 SessionService와 DetectionService를 의존하지만 SignalingHandler는 그렇지 않다.
- 여전히 뭔가 좀 의존 관계가 깔끔해보이지 않는다.

### .sh 파일의 EOL 처리

- certbot-renew.sh 파일이 다른 팀원이 로컬에서 docker compose up 했을 때 not found라고 나오는 이슈가 있었다.
- not found라고 하지만 exec로 직접 들어가서 확인하면 파일은 있었다.
- 정확한 이유를 알아보니 Windows에서 저장된 파일이 CRLF로 저장되어 linux 환경에서 제대로 인식되지 않아서 발생한 문제였다.

## 2025-02-07

### nginx 설정

- nginx 에서 /api/ 로 온 요청을 backend:8080/으로 보내면 /api/는 떨어지고 바로 root로 가는 거였다.
- 이게 알듯 말듯 해서 오늘 Spring Security merge된 코드에서 요청이 넘어가질 않았다.

## 2025-02-10

### SPA Router, nginx 관련

- 정적 파일을 nginx에서 서빙할 때 SPA router에 대한 고려를 하지 않아 제대로 동작하지 않았다.
- ```
  location / {
    try_files $uri /index.html;
  }
  ```
  해당 내용을 추가하여 사용자가 요청한 uri에 해당하는 파일이 없으면 index.html을 주도록 하고 그 안에서 router가 동작하도록 바꿔줬더니 잘 동작했다.
- [참고](https://github.com/adriabama06/react-route-nginx-docker-example/blob/main/nginx.conf)

## 2025-02-11, 2025-02-12

### Websocket 연결에서의 인증

- 로컬에서 테스트를 진행하던 중 로그인된 유저에 대한 정보를 알아오는데 문제가 있었다.
- `Signaling Handler에서 직접 SecurityContextHolder.getContext().getAuthentication()` 을 실행하면 getContext()가 `null`이 나왔다.
- 지금까지 알아낸 바로는 WebSocket 통신이 http를 사용하지 않기 때문에 security filter chain을 타지 않는 것으로 보인다.
- 따라서 HandShake 과정에서 인증 정보를 WebSocket session의 attributes에 넣어주는 방식으로 해결했다.

## 2025-02-14

### CORS

- 정확한 이유를 파악하지 못했지만 이전에 발생하지 않던 CORS 에러가 발생했다.
- 문제가 발생했을 때 사용중인 CorsConfigurationSource 는 setAllowedOrigins로 로컬 테스트 용 origin 및 포트인 http://localhost:5173만 열어두었다.
- 문제는 이 상태로 배포가 되었을 때 무리없이 돌아가고 있었다는 사실이다.
- 이 후 로컬 도커 테스트용 https://localhost와 배포 도메인인 https:/i12a601.p.ssafy.io를 모두 명시하니 해결됐다.

## 2025-02-15

### CI CD

- gitlab CI/CD 와 Jenkins 중 어느 것을 선택할 지 고민하다가 gitlab CI/CD가 local에서 runner를 세팅할 수 있다고 하여 server의 자원을 사용하지 않고도 CI/CD를 진행할 수 있을 것 같아 gitlab CI/CD를 골랐다.
- 그러나 Windows local에서 docker.sock을 사용하는 방법을 제대로 파악하지 못해 결국 배포 서버에 runner를 세팅했다.
- 구성은 크게 build push pull로 나뉘었다.
- test를 하고 싶은 마음은 있었지만 제대로 테스트를 구축하지 않아서 아쉬웠다.
- 막상 그렇게 하고보니 사용하는 docker가 배포 서버의 그것이라서 docker hub에 push pull을 할 이유가 딱히 없었다.
- 다만 다음번에는 어떻게 사용할지 모르기도 하고 외부 저장소에서 버전 관리를 하는 셈치고 일단은 구조를 유지했다.
- 이번에 가장 크게 고민했던 부분은 frontend는 정적 파일을 빌드하는 순간에 env가 필요하다는 점이다.
  - [https://ko.vite.dev/guide/env-and-mode](vite 공식 문서)를 보면 .env.환경.local 로 git에 의해 무시될 환경 변수를 설정해뒀다.
  - 이는 .env.환경 파일들은 git으로 관리해야한다는 뜻이라고 파악했다.
  - 그렇다고 하면 .env.환경.local에 들어가야할 api key라든가 외부에 노출되면 안되는 값들은 결과적으로 어느 시점에 어떻게 주입할 지를 잘 모르겠다.
  - docker compose.yml 을 override 하는 방식이 있던데 그렇게 하는 것일까?
