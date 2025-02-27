# TIL (Today I Learned)
## 2025.01.13.
 - 기획 회의를 계속하며 와이어프레임을 제작하였습니다.
 - week point와 charming point가 기획에서 중요함을 알 수 있었습니다.

## 2025.01.14.
 - 기획 회의를 계속하였다.
 - 컨설턴트님과 코치님들께 피드백을 받은 결과 너무 생각이 고정되어 있다는 조언을 받았다.
 - 키워드를 통한 브레인스토밍을 진행하였다.

## 2025.01.15.
 - git을 사용할 때 다양한 브랜치 전략이 있다는 것을 알 수 있었다. (git flow, github flow, gitlab flow)
 - 개발을 시작하기 전에 브랜치 전략과 커밋 규칙을 결정해야 하며 매우 중요하다는 것을 배웠다.
 - 기획회의를 계속하여 MVP의 중요성과 타겟팅의 중요성을 다시금 느꼈다.

## 2025.01.16.
 - 프로젝트 기획 확정
 - 다양한 프로젝트 명과 로고 디자인
 - 기술스택 의논
 - 구현 방법토의

## 2025.01.17.
 - 유스케이스 설계를 위한 API 명세, 엔드포인트 논의
 - 예상되는 문제점 의논
 - 와이어프레임 작성

## 2025.01.20.
 **탐지 및 보고서 관련 DB 설계**
 - 실시간 탐지 서비스 특성상 한번 탐지된 내용에 변화가 일어날 가능성이 매우 낮다
 - 각 session은 user_id를 참조한다
 - 각 detection은 session_id를 참조한다
 - 각 session에 대한 통계 데이터를 미리 캐싱한다면 성능을 높일 수 있지 않을까?
 - report 테이블을 유지한다?
    예상 문제점
    1. report 내부의 데이터들은 무결성을 보장할 수 없다
    -> session과 detection은 session이 종료된 순간 수정될 여지가 없다.
       
    2. report 내부의 데이터를 정규화하는 것이 더 큰 오버헤드를 발생 시킨다.
    -> nosql을 써본다? user 테이블을 nosql과 rdbms 양쪽에 유지해야할 만큼 의미는 없을 것    
    - 결론: 비정규화된 형태로 report 테이블을 구성해보는 것도 좋을 듯 → 추가 성능 향상 필요 시 고려
 - 웹 RTC에 대해 공부 - Peer to Peer로 연결하고 그것을 유지하며 연속적 데이터(음악/영상)을 교환할 수 있게 해준다
 - kurento hello 작동시켜보았다.

## 2025.01.21.
 - JPA, ORM 공부해 볼 것
 - Redis는 TTL을 활용하여 블랙리스트로 토큰을 관리할 수 있으며, 휘발성을 보완하기 위해 AOF 및 클러스터링을 적용할 수 있다.
 - WebRTC는 P2P 통신을 위해 사용되며, NAT 환경에서 직접 연결이 어려울 경우 STUN과 TURN을 사용한다.
 - NAT는 내부 네트워크 보안을 유지하기 위해 사설 IP를 공인 IP로 변환하며, P2P 통신을 어렵게 만든다.
 - STUN은 클라이언트가 자신의 공인 IP를 알아내어 P2P 연결을 시도하도록 도와주며, 제한적인 NAT 환경에서는 실패할 수 있다.
 - TURN은 STUN으로 연결이 불가능할 경우, 중계 서버를 통해 우회하여 연결을 유지한다.
 - WebRTC는 실시간 P2P 연결을 지원하며, 연결 설정을 위해 WebSocket을 활용하여 시그널링을 수행할 수 있다.
 - ICE 프레임워크는 최적의 연결 방식을 결정하기 위해 STUN 시도 후 TURN을 조합하여 사용한다.

## 2025.01.22.
 - WebRTC를 공부하며 https://github.com/devopvoid/webrtc-java 연구중
 - RTCiceCandiate 가 문제가 되고 있다
 - 커넥션을 팩토리로 만들고 리스트로 관리해야 할텐데 요청 옵저버를 어떻게 만들어야하는지 모르겠었다.
 - 옵저버가 옵저버가 아닌 것 같다 생성에 팩토리가 필요하고 자기자신으로 커넥션을 만드는데 커넥션엔 옵저버가 필요하다 근데 sdpMid 필수다 - 우린 미디어를 안보내기에 sdpMid가 없다 -> ???

## 2025.01.23.
 - WebRTC 구현을 하며 일단 RTCIceCandidate를 교환하여 커넥션을 만드는데 까지는 가능했다
 - 웹소켓으로 연결된 상태에서 옵저버가 연결을 해준다. 커넥션 요청을 보내면 받고, 다른 쪽에서 응답(answer)을 보낸 후 응답받은 클라이언트가 icecandidate를 다시 보내고 받으며 교환한다
 - 근데 이게 어떻게 이루어지는 것인지 모르겠다...
 - 일단 자동으로 stun 서버에 요청하고 받는 것 같다
 - 근데 data channel은 아직 안열린다 -> 내일 할 일이다.

## 2025.01.24.
 - Data channel은 양방향으로 한쪽에서 연결된 후 open하면 반대쪽에서 onDataChannel 이벤트로 message를 생성하여여 주고받을 수 있다(open하여 데이터 보내기,message 쪽은 open에 대한 반환)
 - WebSoket으로 연결을 하는데 메시지를 동시에 보내며 충돌, 에러 발생 -> Answer 메시지가 도착하기전에 Ice Candidate 메시지를 보내서 발생했다.-> 이를 해결하기 위해 SessionHandler를 만들고 Message를 큐에 넣어 하나씩 보내고 완료되면 다음껄 보내도록 수정

## 2025.01.31
 - API first 디자인에 대해 배웠습니다.
 - 완성된 RTC 코드 위에 자세분석 알고리즘 구현 시작하였습니다.
 - 데이터를 받아 파싱 성공

## 2025.02.03
 - 자세분석 알고리즘 프로토타입 작성
 - 50개의 프레임이 유효하면 기준 자세 세팅 유효하지 않을 시 오래된 데이터부터 제거
 - 11, 12번 노드의 정보(양 어깨)의 y좌표를 통해 감지

## 2025.02.04
 - TDD의 개념을 배웠습니다.
 - 변수명에대한 강한 피드백을 받고 수정 중 입니다.
 - 끝나면 detection과 session 도메인 작성 예정입니다.

## 2025.02.05
 - 리눅스 관련 명령어를 배웠습니다.
   - vi 탈출은 :q<enter>
   - scp로 파일 옮기기(배포서버에)
   - top로 서버가 몇 코어인지 볼 수 있다 2코어 정도면 쓸만하다 4코어는 훌륭하지만 비싸다
   - nohup no hang up 이라는 뜻으로 터미널이 종료되도 계속 실행하게 함
 - spring JPA 학습중...
 - detection, session 도메인 작성중...

## 2025.02.06
 - detection, session 도메인 작성
 - LocalDateTime와 Instant의 차이
    - Instant는 UTC정보를 포함한 시간이다
    - MySQL에서는 두 자료형 상관없이 DateTime(6)으로 들어간다다

## 2025.02.07
 - 굉장한 량의 피드백
    - 변수명 적절하게 정하고 통일성 좀 높이자
    - 함수의 역할을 보자마자 알 수 있어야 한다.
    - 절차적으로 어디 보내면서 response 만들지 마라 한 함수 안에서 해야한다.

## 2025.02.10
 - 드디어 알고리즘 개발 시작
 - 목부분의 이상을 발견하는 방법
    - 양 어깨 Z의 중간과 양 귀 Z의 중간을 비교하여 기준의 값과 비교 고개의 상대적 위치 판단단
    - 양 귀의 Y의 차이를 기준 포즈의 값과 비교하여 기울기 판단단
