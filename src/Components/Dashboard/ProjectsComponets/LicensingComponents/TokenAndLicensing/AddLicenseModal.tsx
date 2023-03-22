import React, { useState, useContext, useEffect } from 'react'
import { BasicModal } from '../../../../SubComponents/Modal'
import { addLicense, editLicense, deleteLicense, FormLicenseRequest } from '../../../../../networking/license'
import { notify } from './../../../../Inc/Toastr';
import { Loader } from '../../../../SubComponents/Loader';
import { AppContext } from './../../../../../context/AppContext'

import "./AddLicenseModal.css"

import { BasicCKEditor, extractContent } from '../../../../Inc/BasicCKEditor';
import { Toaster } from 'react-hot-toast';


export const AddLicenseModal = (props: any) => {
  
  const [licenseTemplateImg, setLicenseTemplateImg] = useState<null | any>('')
  const [liFileName, setLiFileName] = useState<null | any>('')
  const [loading, setLoading] = useState(false);
  const [editorData, setEditorData] = React.useState('');
  const pathArray = window.location.pathname.split('/');
  const { navHeadData} = useContext(AppContext);

  const [formErrors, setFormErrors]:any =  useState({});
  const [isSubmit, setIsSubmit]:any =  useState(false);

  const spaceId = pathArray[3];
  const errors:any = {};

  type FormValues = {
    licenseName: string,
    licenseSummary: string,
    licenseFile: File | null,
    licenseFileName: String | null,
    licenseFileUrl: String | null,
  }

  const [values, setValues] = useState<FormValues>({
    licenseName: '',
    licenseSummary: '',
    licenseFile: null,
    licenseFileName: '',
    licenseFileUrl: null,
  })


  const handleChange = (event: React.ChangeEvent<HTMLInputElement> & React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = event.target
    let value
    const isPdf = (file:any) => file['type'].includes('pdf');

    if (target.files instanceof FileList) {
      value = target.files[0];
      if(!isPdf(value)){
        setFormErrors((prevState:any) => ({
          ...prevState,
          licenseFile: 'License file is not supported',
        }));
        return
      }else{
        setFormErrors((current:any) => {
          const {licenseFile, ...rest} = current;
          return rest;
        });
      }
      setLicenseTemplateImg(URL.createObjectURL(value))
      setLiFileName(value.name)
    } else {
      value = target.value
    }
    setValues({ ...values, [target.name]: value })
  }

  useEffect(() => {
    setLicenseTemplateImg(props.req.licenseFile)
    setLiFileName(props.req.licenseFileName);
    setValues({
        licenseName: props.req ? props.req.licenseName : '',
        licenseSummary: props.req ? props.req.licenseSummary : '',
        licenseFile: null,
        licenseFileName: props.req ? props.req.licenseFileName : '',
        licenseFileUrl: props.req ? props.req.licenseFile : '',
      })
  },[props.req])
   
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    validate(values);
    
    if(Object.keys(formErrors).length === 0){
      setIsSubmit(true);
    }else{
      setIsSubmit(false); 
    }
    
  }

 useEffect(() => {
    const postData = async () => {
       if(Object.keys(formErrors).length === 0 && isSubmit){
         setLoading(true);
         props.setIsSaved(false);
    if(props.req){

     const request: any = {
        id: props.req.id,
        licenseName: values.licenseName,
        licenseSummary: editorData,
        licenseFile: values.licenseFile!,
        licenseFileName: values.licenseFileUrl,
      }
      try
      {
        await editLicense(request).then((data:any )=> {
          if(data.data.status){
            props.setShowLicenseModal(false);
            props.setIsSaved(true)
            notify("License updated.", "success", 6000);
            setLoading(false)
            setIsSubmit(false);
          }else{
            setLoading(false)
            setIsSubmit(false);
            props.setIsSaved(false)
            notify('Something went wrong!', "error", 6000);
          }  
       })
      }catch(err:any){
        setLoading(false)
        setIsSubmit(false);
        props.setIsSaved(false)
        notify(err.message, "error", 8000);
      }


    }else{
      const request: FormLicenseRequest = {
        licenseName: values.licenseName,
        licenseSummary: editorData,
        licenseFile: values.licenseFile!,
        licenseFileName: values.licenseFile?.name!,
      }
      try
      {
        await addLicense(request, spaceId).then((data:any )=> {
          if(data.data.status){
            props.setShowLicenseModal(false);
            props.setIsSaved(true)
            notify("License added!", "success", 6000);
            setLoading(false)
            setIsSubmit(false);
            setValues({
              licenseName: '',
              licenseSummary: '',
              licenseFile: null,
              licenseFileName: '',
              licenseFileUrl: null,
            })
            setLicenseTemplateImg('')
            setLiFileName('');
          }else{
            setLoading(false)
            setIsSubmit(false);
            props.setIsSaved(false)
            notify('Something went wrong!', "error", 6000);
          }  
       })
      }catch(err:any){
        setLoading(false)
        setIsSubmit(false);
        props.setIsSaved(false)
        notify(err.message, "error", 8000);
      }
    }   
  }
}
  postData().catch(console.error);
  }, [formErrors])


  const validate = (values:any) => {
    const isPdf = (file:any) => file['type'].includes('pdf');
    
    if(!values.licenseName){
       errors.licenseName = "License name is required";
     }
     if(editorData.length < 1){
      errors.licenseSummary = "License summary is required";
    }
    if(!values.licenseFile &&  licenseTemplateImg == null){
      errors.licenseFile = "License file is required";
    }else{
      if(!licenseTemplateImg){
        if(!isPdf(values.licenseFile)){
          errors.licenseFile = "License file is not supported";
         }
      }
    }

    setFormErrors(errors);
  }


  const handleDelete = async (id:string, spaceId:string) => {
    if(props.req.licensetiers.length > 0){
      props.setShowLicenseModal(false);
      notify('Delete Error! License is currently in use.', "error", 8000); 
      return
    }
   
    if(window.confirm('Are you sure to continue? This action can not be undone!')){
      setLoading(true)
      props.setIsSaved(false)
      try{
        await deleteLicense(id, spaceId).then(res => {
          if(res.status){
            props.setShowLicenseModal(false);
            props.setIsSaved(true)
            setLoading(false)
            notify("License deleted.", "success", 6000);
          }else{
            setLoading(false)
            props.setIsSaved(false)
            notify('Failed to complete delete operation', "error", 8000); 
          }       
        })
      }catch(err:any){
        setLoading(false)
        props.setIsSaved(false)
        notify(err.message, "error", 8000);
      }
       
    }
  }

  


  return (
    <BasicModal setShowModal={props.setShowLicenseModal} showModal={props.showLicenseModal}>
      <div className="licenseModalMain w-full h-full overflow-hidden rounded-2xl mb-10">
        <div className="licenseModalHeader flex items-end justify-between pt-5 px-5 sm:px-8 pb-4">
          <div className='relative'>
            <p className="text-sm text-white font-semibold">
              {navHeadData.title}
            </p>
            <h1 className="text-white w-1/2 sm:w-auto sm:text-lg font-bold mt-2">
               {props.req ? 'Edit license' : 'Add a license'}  
            </h1>
            <Toaster/>
          </div>
          <button
            onClick={() => {
              props.setShowLicenseModal(false)
            }}
            className="text-white text-xs sm:text-sm font-bold"
          >
            Cancel
          </button>
        </div>
        <div className="licenseModalContent h-full overflow-auto px-5 sm:px-8 py-8 flex flex-col gap-y-10">
        <form id='licenseForm' onSubmit={(e) => handleSubmit(e)}>
        <div className="flex flex-col">
              <label className="text-white text-md font-bold">
                 Upload a license template
              </label>
              {licenseTemplateImg ? (
                <div>
                  <div
                    className="fileInput mt-4 p-2 w-full object-cover text-center text-lg text-white"
                  >{liFileName}</div>
                  <div className="flex items-center gap-x-2 mt-2">
                    <span className="text-white text-sm underline">
                      {liFileName}
                    </span>
                    <div className="border-r-2 border-white h-3 mt-1"></div>
                    <button onClick={() => {setLicenseTemplateImg(null)}} className="text-white text-sm underline">
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <label className="fileInput py-8 w-full mt-4 flex justify-center px-3">
                  <input                   
                    onChange={handleChange}
                    type="file"
                    name='licenseFile'
                    className="hidden"
                  />
                  <span className="text-white text-md">
                    Drag & drop or <u>upload</u>
                  </span>
                </label>
              )
              }
              <p className='form-display-error'>{formErrors.licenseFile}</p>
            </div>
          <div className='w-full'>
            <h1 className="text-white text-md font-semibold mt-4">License name</h1>
            <input
              type="text"
              name='licenseName'
              value={values.licenseName}
              onChange={handleChange}
              placeholder="Paste contract address..."
              className="py-3 px-0 w-full text-xs text-white border-b border-0 border-zinc-700 licenseModalInput outline-0 shadow-none bg-transparent"
            />
            <p className='form-display-error'>{formErrors.licenseName}</p>
          </div>
          <div className='w-full' style={{position: 'relative'}}>
            <h1 className="text-white text-md font-semibold mt-4">
              License summary
            </h1>
               <BasicCKEditor data={values.licenseSummary} setEditorData={setEditorData}  />
               <p className='form-display-error'>{formErrors.licenseSummary}</p>
            <p className="text-zinc-500 text-xs text-right mt-1 font-semibold">
            {extractContent(editorData).length}/2000
            </p>
          </div>
          <div className="flex items-center justify-between gap-x-5 mt-5">
            <div>
            <button type='submit'
              className="text-white text-xs font-semibold py-2 px-4 rounded-full addLicenseModalBtn"
            >
              {props.req ? 'Edit license' : ' Add a license' }
             
              { loading && (
                      <Loader />
                    )}
            </button>
            <button type='button'
             onClick={() => {
              props.setShowLicenseModal(false)
            }}
            className="text-white text-xs font-semibold ml-4">Cancel</button>
            </div>
            {props.req && (<button type='button' onClick={() => handleDelete(props.req.id, props.req.spaceId)} className='text-white text-xs font-semibold py-2 px-4 rounded-full projectBtn dangerBtn'>
               Delete license
          
            </button>)}  
            
          </div>
          </form>
        </div>
      </div>
    </BasicModal>
  )
}
