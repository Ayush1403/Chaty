import React , {useState} from 'react'
import { authState } from '../store/userAuth'
import { Calendar1, Camera, Loader2, Mail, User } from 'lucide-react';


const Profile = () => {

  const { useAuth, profile, isUpdatingProfile } = authState();
  const [selectedImage, setselectedImage] = useState()

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file)

    reader.onload=async()=>{
      const  base64Image = reader.result;
      setselectedImage(base64Image)
      await  profile({profilepic: base64Image})
    }
  }

  return (
    <div className='h-screen pt-20'>
      <div className='max-w-2xl mx-auto p-4 py-8'>
        <div className='bg-base-300 rounded-xl p-6 space-y-8'>
          <div className='text-center'>
            <h1 className='text-2xl font-semibold'>Profile</h1>
            <p className='mt-2'>Your Information</p>
          </div>
          <div className=' flex flex-col items-center gap-4'>
            <div className='relative'>
              <img
                src={selectedImage||useAuth.profilepic || "/image/logo.svg"}
                alt=""
                className='border-2 size-32 object-cover rounded-full' />

              <label htmlFor='avatar-upload' className='bottom-0 btn absolute flex items-center justify-center right-0 w-10 h-10 bg-amber-800 p-1 rounded-full' >
                <Camera />
                <input type="file"
              id='avatar-upload'
              className='hidden'
              accept='image/*'
              onChange={handleImageUpload}
              disabled={isUpdatingProfile} />
              </label>
              </div>
                <p className='text text-zinc'>
                  {!isUpdatingProfile?"Click on camera to upload picture":<span><Loader2 className='animate-spin' />Uploading ...</span>}</p>   
            
          </div>
         <div className='space-y-4'>
            {/* Name */}
            <div className='flex items-center gap-4'>
              <User className='text-gray-400' />
              <span className='font-medium w-32'>Name:</span>
              <span className='flex-1 border-2 p-2 rounded-lg border-base-100 text-zinc-500'>{useAuth.username}</span>
            </div>

            {/* Email */}
            <div className='flex items-center gap-4'>
              <Mail className='text-gray-400' />
              <span className='font-medium w-32'>Email:</span>
              <span className='flex-1 border-2 p-2 rounded-lg border-base-100 text-zinc-500'>{useAuth.email}</span>
            </div>

            {/* Member Since */}
            <div className='flex items-center gap-4'>
              <Calendar1 className='text-gray-400' />
              <span className='font-medium w-32'>Member since:</span>
              <span className='flex-1 border-2 p-2 rounded-lg border-base-100 text-zinc-500'>{new Date(useAuth.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Profile