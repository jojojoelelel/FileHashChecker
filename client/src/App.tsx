import React, { useState } from 'react';
import './App.css';
import { Button, Upload, message } from 'antd';
import { UploadOutlined, ExperimentFilled, DeleteOutlined, TranslationOutlined, CheckOutlined, CloseOutlined, InboxOutlined } from '@ant-design/icons';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import type { UploadProps } from 'antd';
import axios from 'axios'

function App() {
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [md5Checksums, setMd5Checksums] = useState<string[]>([]);
  const [uploadCompleted, setUploadCompleted] = useState<boolean>(false);
  const [fileLSelected, setfileLSelected] = useState<boolean>(false);
  const [fileRSelected, setfileRSelected] = useState<boolean>(false);
  const [fileL, setfileL] = useState<File[]>([]);
  const [fileR, setfileR] = useState<File[]>([]);

  const [size, setSize] = useState<SizeType>('large');

  const uploadButton = (
    <div>
      <UploadOutlined />
      <div style={{ marginTop: 8 }}>Click or drag files to this area to upload</div>
    </div>
  );

  const uploadedButtonL = (
    <div>
      {fileLSelected && <div>{fileL[0].name}</div>}
    </div>
  )

  const uploadedButtonR = (
    <div>
      {fileRSelected && <div>{fileR[0].name}</div>}
    </div>
  )
  /*
  const dummyRequest = ({ file, onSuccess }:any ) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  }; */

  const uploadPropsL = {
    name:'file',
    beforeUpload: (file: File) => {
      setSelectedFiles((prevSelectedFiles) => [...prevSelectedFiles, file]);
      setfileL((prevSelectedFiles) => [...prevSelectedFiles, file]);
      setfileLSelected(true);
      console.log("selectedFiles => "+ selectedFiles)
      return false;
    }
  };

  const uploadPropsR = {
    name:'file',
    beforeUpload: (file: File) => {
      setSelectedFiles((prevSelectedFiles) => [...prevSelectedFiles, file]);
      setfileR((prevSelectedFiles) => [...prevSelectedFiles, file]);
      setfileRSelected(true);
      console.log("selectedFiles => "+ selectedFiles)
      return false;
    }
  };
  /*
  const uploadFile2Props: UploadProps = {
    name: 'file',
    multiple: true,
    customRequest: dummyRequest,
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }

      console.log(info.file.type)
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  const uploadFile1Props: UploadProps = {
    name: 'file',
    multiple: true,
    customRequest: dummyRequest,
    onChange(info) {   
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
      console.log(info.file.uid)
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  }; */

  const isChecksumsEqual = (checksumArray: string[]): boolean => {
    const firstChecksum = checksumArray[0];
    return checksumArray.every((checksum) => checksum === firstChecksum);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    selectedFiles.forEach((file, index) => {
      formData.append(`file-${index}`, file);
    });

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {"Content-Type": 'multipart/form-data'},
      });

      if (response.status === 200) {
        const checksumResults = response.data;
        setMd5Checksums(checksumResults);
        setUploadCompleted(true);
        console.log('MD5 Checksums:', checksumResults);
        console.log('File uploaded successfully');
      } else {
        console.error('File upload failed');
      }
    } catch (error) {
      console.error('An error occurred', error);
    }
  };


  const clearFiles = () => {
    setSelectedFiles([]);
    setMd5Checksums([]);
    setfileL([]);
    setfileR([]);
    setfileLSelected(false);
    setfileRSelected(false);
    setUploadCompleted(false);
  };


  return (
    <div className="App">

      <nav className="nav-bar">
        <div>
          <TranslationOutlined style={{ fontSize: '70px', color: '#FF0000' }}/>
        </div>
      </nav>

      <div className='fileUpload-container'>

        <div className="fileUpload">
          <Upload.Dragger multiple={false} {...uploadPropsL} disabled={fileLSelected} fileList={[]}>
            {fileLSelected ? uploadedButtonL : uploadButton}
          </Upload.Dragger>
        </div>

        <div className="fileUpload">
          <Upload.Dragger multiple={false} {...uploadPropsR} disabled={fileRSelected} fileList={[]}>
            {fileRSelected ? uploadedButtonR : uploadButton}
          </Upload.Dragger>
        </div>

      </div>

      <div className="button-container">

        <div className="fileSubmit">
          <Button onClick={handleSubmit} size={size}>
            <ExperimentFilled style={{color: '#FF0000' }}/>
          </Button>
        </div>

        <div className="fileSubmit">
          <Button onClick={clearFiles} size={size}>
            <DeleteOutlined style={{color: '#FF0000' }}/>
          </Button>
        </div>

      </div>
      {uploadCompleted && (selectedFiles.length === 2) && (md5Checksums.length === 2) &&(
        <div className="checksum-container">
          <div className="results">
            {fileL[0]?.name + ' => '}
            {md5Checksums[0]}
          </div>

          <div className="results">
            {fileR[0]?.name + ' => '}
            {md5Checksums[1]}
          </div>

          {uploadCompleted && (selectedFiles.length === 2) && (md5Checksums.length === 2) &&(
            <div className="results">{isChecksumsEqual(md5Checksums) ? <CheckOutlined /> : <CloseOutlined /> }</div>
          )}
        </div>
      )}
    
    </div>
  );
}

export default App;