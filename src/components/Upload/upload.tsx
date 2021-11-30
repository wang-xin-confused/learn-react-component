import React, { FC, useRef, ChangeEvent, useState } from 'react'
import axios from 'axios'
import UploadList from './uploadList'
import Dragger from './dragger'

export type UploadFileStatus = 'ready' | 'uploading' | 'success' | 'error'

export interface UploadFile {
  uid: string;
  size: number; // input=file 默认属性
  name: string;// input=file 默认属性
  status?: UploadFileStatus; // 几种上传的状态
  percent?: number; // 上传百分比
  raw?: File; // 原上传文件
  response?: any; // 服务响应
  error?: any; // 上传错误信息
}

// 组件对使用者暴露的属性
export interface UploadProps {
  action: string; // 上传地址
  defaultFileList?: UploadFile[]; // 默认的文件列表数据
  beforeUpload? : (file: File) => boolean | Promise<File>;
  onProgress?: (percentage: number, file: File) => void;
  onSuccess?: (data: any, file: File) => void;
  onError?: (err: any, file: File) => void;
  onChange?: (file: File) => void;
  onRemove?: (file: UploadFile) => void;
  headers?: {[key: string]: any }; // 自定义请求头
  name?: string; // 与后端定义好的name字段名
  data?: {[key: string]: any }; // 额外提交数据
  withCredentials?: boolean; // 携带cookie
  accept?: string; // 支持上传的类型
  multiple?: boolean; // 能否多选
  drag?: boolean; // 拖拽
}

export const Upload: FC<UploadProps> = (props) => {
  const {
    action,
    defaultFileList,
    beforeUpload,
    onProgress,
    onSuccess,
    onError,
    onChange,
    onRemove,
    name,
    headers,
    data,
    withCredentials,
    accept,
    multiple,
    children,
    drag,
  } = props
  // *隐藏input 通过button点击触发 原生input=file的上传行为
  const fileInput = useRef<HTMLInputElement>(null)
  // *上传文件列表的设置 有默认就用默认值 没有就为空[]
  const [ fileList, setFileList ] = useState<UploadFile[]>(defaultFileList || [])

  // * 跟新上传文件进度方法  updateObj 表示更新的属性对象  使用Partial 表示updateObj 里的属性都是UploadFile中可选的
  const updateFileList = (updateFile: UploadFile, updateObj: Partial<UploadFile>) => {
    setFileList(prevList => {
      return prevList.map(file => {
        // 找到正在更新的那个文件对象
        if (file.uid === updateFile.uid) {
          return { ...file, ...updateObj }
        } else {
          return file // 没有的话表示是第一次
        }
      })
    })
  }

  // * button点击触发的click事件 再调用input 的click事件
  const handleClick = () => {
    if (fileInput.current) {
      fileInput.current.click()
    }
  }

  // *input 接受到文件后触发
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if(!files) {
      return
    }
    uploadFiles(files)
    if (fileInput.current) { // * 重置input value 为空
      fileInput.current.value = ''
    }
  }
  const handleRemove = (file: UploadFile) => {
    setFileList((prevList) => {
      return prevList.filter(item => item.uid !== file.uid)
    })
    if (onRemove) {
      onRemove(file)
    }
  }

  // * 上传文件
  const uploadFiles = (files: FileList) => {
    let postFiles = Array.from(files) // 将file伪数组转换成数组
    postFiles.forEach(file => {
      if (!beforeUpload) { // 没有beforeUpload 直接调接口
        post(file)
      } else { // 有beforeUpload 调用beforeUpload()
        const result = beforeUpload(file)
        if (result && result instanceof Promise) {
          result.then(processedFile => {
            post(processedFile)
          })
        } else if (result !== false) {
          post(file)
        }
      }
    })
  }
  // * 上传文件调用后端接口
  const post = (file: File) => {
    // 这个对象用于前端界面使用的
    let _file: UploadFile = {
      uid: Date.now() + 'upload-file',
      status: 'ready',
      name: file.name,
      size: file.size,
      percent: 0,
      raw: file
    }
    //setFileList([_file, ...fileList])
    // * 这里使用函数的方式可以获取到上一次的state
    setFileList(prevList => {
      return [_file, ...prevList]
    })
    const formData = new FormData()
    formData.append(name || 'file', file)
    // *除了文件还有别的传参  使用data属性用户传入
    if (data) {
      Object.keys(data).forEach(key => {
        formData.append(key, data[key])
      })
    } 
    axios.post(action, formData, {
      headers: {
        ...headers,
        'Content-Type': 'multipart/form-data',
      },
      withCredentials,
      // * axios自带的上传进度回调
      onUploadProgress: (e) => {
        let percentage = Math.round((e.loaded * 100) / e.total) || 0;
        // 上传未完成
        if (percentage < 100) {
          // 更新fileList 状态 为上传中
          updateFileList(_file, { percent: percentage, status: 'uploading'})
          // 如果有要显示进度条
          if (onProgress) {
            onProgress(percentage, file)
          }
        }
      }
    }).then(resp => { // 接口返回成功
      // * 更新fileList状态为 success
      updateFileList(_file, {status: 'success', response: resp.data})
      // 调用成功回调
      if (onSuccess) {
        onSuccess(resp.data, file)
      }
      // 调用onChange回调
      if (onChange) {
        onChange(file)
      }
    }).catch(err => { // 接口返回失败
      // * 更新fileList 中 某一项上传状态为error
      updateFileList(_file, { status: 'error', error: err})
      // * 调用错误回调
      if (onError) {
        onError(err, file)
      }
      // * 调用onChange回调
      if (onChange) {
        onChange(file)
      }
    })
  }

  return (
    <div 
      className="viking-upload-component"
    >
      <div className="viking-upload-input"
        style={{display: 'inline-block'}}
        onClick={handleClick}>
          {drag ? 
            <Dragger onFile={(files) => {uploadFiles(files)}}>
              {children}
            </Dragger>:
            children
          }
        <input
          className="viking-file-input"
          style={{display: 'none'}}
          ref={fileInput}
          onChange={handleFileChange}
          type="file"
          accept={accept}
          multiple={multiple}
        />
      </div>

      <UploadList 
        fileList={fileList}
        onRemove={handleRemove}
      />
    </div>
  )
}

Upload.defaultProps = {
  name: 'file'
}
export default Upload;