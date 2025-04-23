import { useState } from 'react';

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<string>('');

  const handleUpload = async () => {
    if (files.length === 0) return;
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    try {
      const response = await fetch('http://localhost:3111/upload', {
        method: 'POST',
        body: formData,
      });
      const text = await response.text();
      setStatus(text);
    } catch (error) {
      console.error(error);
      setStatus('Upload failed');
    }
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-6 bg-gray-100'>
      <h1 className='text-3xl font-bold mb-6 text-center text-blue-800'>
        📸 Upload Your Images
      </h1>
      <label className='w-full max-w-md cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-blue-300 rounded-2xl p-8 bg-white shadow hover:shadow-md transition'>
        <input
          type='file'
          accept='image/*'
          multiple
          name='files'
          onChange={(e) =>
            setFiles(e.target.files ? Array.from(e.target.files) : [])
          }
          className='hidden'
        />
        <span className='text-gray-600 text-center'>
          {files.length > 0
            ? `${files.length} file(s) selected`
            : 'Click to select one or more images'}
        </span>
      </label>
      <button
        onClick={handleUpload}
        className='mt-6 bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition'
      >
        Upload Image{files.length !== 1 ? 's' : ''}
      </button>
      {status && <p className='mt-4 text-sm text-gray-700'>{status}</p>}
    </div>
  );
}

export default App;
