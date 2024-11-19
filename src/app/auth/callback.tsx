"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");

    if (code) {
      // 네이버 인증 후 요청 보내기
      fetch(`/login/oauth2/code/naver?code=${code}&state=${state}`, {
        method: "GET",
        redirect: "manual", // 리다이렉트 방지
      })
        .then((response) => {
          console.log("응답 상태 코드:", response.status); // 상태 코드 확인
          console.log("응답 헤더:", Array.from(response.headers.entries())); // 모든 헤더 확인
          
          if (response.status === 302) {
            // 리다이렉트 응답 처리
            const authHeader = response.headers.get("authorization");
            if (authHeader && authHeader.startsWith("Bearer ")) {
              const token = authHeader.split(" ")[1]; // 'Bearer ' 이후의 토큰 추출
              localStorage.setItem("authToken", token); // 로컬스토리지에 저장
              console.log("토큰 저장 성공:", token);
              router.push("/onboarding"); // 온보딩 페이지로 이동
            } else {
              console.error("Authorization 헤더가 없습니다.");
              router.push("/login");
            }
          } else {
            throw new Error(`예상치 못한 상태 코드: ${response.status}`);
          }
        })
        .catch((error) => {
          console.error("오류 발생:", error);
          router.push("/login");
        });
    } else {
      console.error("Authorization Code가 없습니다.");
      router.push("/login");
    }
  }, [router]);

  return <div>로그인 처리 중...</div>;
}
