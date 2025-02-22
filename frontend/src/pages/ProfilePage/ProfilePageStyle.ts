import styled from "styled-components";

export const ProfilePageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-left: 4rem;
  padding: 4rem;
  background-color: var(--navy-100);
`;

export const ContentContainer = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;

  width: 100%;
  max-width: 36rem;
  max-height: 80vh;

  padding: 3rem 2rem;
  border-radius: 12px;
  background-color: var(--cream);

  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const Title = styled.h2``;

export const HiddenImageInput = styled.input`
  display: none;
`;

export const UploadProfileImageButton = styled.label`
  position: relative;
  width: 6rem;
  height: 6rem;
  border-radius: 999px;
  cursor: pointer;
`;

export const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 999px;
  border: 2px solid var(--gray-100);
`;

export const CameraIcon = styled.img`
  position: absolute;
  right: -0.3rem;
  bottom: -0.3rem;
`;

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;

  width: 100%;
  max-width: 36rem;
  max-height: 80vh;

  border-radius: 12px;
  background-color: var(--cream);
`;

export const SubmitButton = styled.button`
  width: 100%;
  max-width: 16rem;
  margin-top: 1.5rem;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  background-color: var(--mint);
  color: var(--white);
  font-size: 1rem;
  font-weight: 600;

  &:disabled {
    background-color: var(--gray-200);
  }
`;
