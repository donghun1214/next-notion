'use client';

import { useState } from 'react';
import { updateProfileImage } from '@/action';

export default function Profile() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [profileImage, setProfileImage] = useState('/profile.jpg');
  const [userId] = useState(1); // 예제 사용자 ID

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    // 미리보기
    const reader = new FileReader();
    reader.onload = () => {
      setProfileImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select an image to upload.');
      return;
    }

    try {
      await updateProfileImage(userId, profileImage);
      alert('Profile image updated successfully!');
    } catch (error) {
      console.error('Error updating profile image:', error);
      alert('Failed to update profile image.');
    }
  };

  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Update Profile</h1>
      {/* 프로필 이미지 */}
      <img
        src={profileImage}
        alt="Profile"
        className="w-32 h-32 rounded-full mb-6 object-cover border-2 border-gray-300 shadow-md"
      />
      {/* 파일 선택 및 버튼 */}
      <div className="flex items-center gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file-input file:mr-4 file:py-2 file:px-4 file:rounded file:bg-gray-200 file:border-0"
        />
        <button
          onClick={handleUpload}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Change
        </button>
      </div>
    </div>
  );
}
