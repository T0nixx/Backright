package com.example.posturepro.domain.member;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@Getter
@Table(name = "member")
public class Member {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "provider_id", unique = true, nullable = false)
	private String providerId;

	@Column(nullable = false)
	private String name;

	@Setter
	@Column(name = "nickname", nullable = false)
	private String nickname;

	@Column(name = "birth_date", nullable = false)
	private LocalDate birthDate;

	@Setter
	@Column(name = "profile_img_url")
	private String profileImgUrl;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Gender gender;

	@Column(updatable = false)
	private LocalDateTime createdAt;

	@PrePersist
	protected void onCreate() {
		this.createdAt = LocalDateTime.now();
	}

	@Builder
	public Member(String providerId, String name, String nickname, LocalDate birthDate, Gender gender,
		String profileImgUrl) {
		this.providerId = providerId;
		this.name = name;
		this.nickname = nickname;
		this.birthDate = birthDate;
		this.gender = gender;
		this.profileImgUrl = profileImgUrl;
	}
}
