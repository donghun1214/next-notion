'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { updateProfileImage, getProfileImage } from '@/action';

export default function Profile() {
  const { data: session } = useSession();
  const [selectedFile, setSelectedFile] = useState(null);
  const [profileImage, setProfileImage] = useState(session?.user?.profileImage || '/profile.jpg');
  useEffect(() => {
    if (session && session.user) {
      // 프로필 이미지를 데이터베이스에서 가져오기
      const fetchProfileImage = async () => {
        try {
          const image = await getProfileImage(session.user.id);
          if (image) {
            setProfileImage(`data:image/jpeg;base64,${image}`);
          }
        } catch (error) {
          console.error('Failed to fetch profile image:', error);
        }
      };
      fetchProfileImage();
    }
  }, [session]);

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
    alert(profileImage);
    if (!selectedFile) {
      alert('Please select an image to upload.');
      return;
    }
    if (!session || !session.user) {
      alert('No session found. Please log in.');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
        await updateProfileImage(session.user.id, base64String);
        setProfileImage(reader.result); // 프로필 이미지 상태 업데이트
        await update({ ...session, user: { ...session.user, profileImage: reader.result } }); // 세션 업데이트
        alert('Profile image updated successfully!');
      };
      reader.readAsDataURL(selectedFile);
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
