import React, { Dispatch, SetStateAction, useState, useContext, useEffect } from 'react'
import { createSpace, CreateSpaceRequest } from '../../../../networking/spaces'
import { BasicModal } from '../../../SubComponents/Modal'
import './AllSpacesPage.css'

import { notify } from './../../../Inc/Toastr';
import { Toaster } from 'react-hot-toast';

import { AppContext } from './../../../../context/AppContext'

import { Loader } from '../../../SubComponents/Loader';
import { useNavigate } from 'react-router-dom';
import { BasicCKEditor } from '../../../Inc/BasicCKEditor'




interface Props {
  showModal: Boolean
  setShowModal: Dispatch<SetStateAction<Boolean>>
  setShowAlert: Dispatch<SetStateAction<Boolean>>
}

export const CreateSpaceModal: React.FC<Props> = (props) => {
  const [loading, setLoading] = useState(false);
  const [editorData, setEditorData] = React.useState('');
  const { user, spaceDat, setisCreated, setWidget} = useContext(AppContext);
  const [formErrors, setFormErrors]:any =  useState({});
  const [isSubmit, setIsSubmit]:any =  useState(false);
  const navigate = useNavigate();
  type FormValues = {
    title: string,
    legalCustodian: string,
    ipDescription: string,
    officialWebsite: string,
    twitter: string,
    discord: string,
    hideFromHomepage: boolean,
    resources: string,
    logoImg: File | null,
    logoUrl: String | null,
    bannerImg: File | null,
    bannerUrl: String | null,
    featuredImg: File | null,
    featuredUrl: String | null,
  }

  const [values, setValues] = useState<FormValues>({
    title: '',
    legalCustodian: '',
    ipDescription: '',
    officialWebsite: '',
    twitter: '',
    discord: '',
    hideFromHomepage: false,
    resources: '',
    logoImg: null,
    logoUrl: null,
    bannerImg: null,
    bannerUrl: null,
    featuredImg: null,
    featuredUrl: null,
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement> & React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = event.target
    let value

    if (target.type === 'checkbox') {
      value = target.checked
    } else if (target.files instanceof FileList) {
      value = target.files[0]
    } else {
      value = target.value
    }

    setValues({ ...values, [target.name]: value })
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    validate(values);
    setIsSubmit(true);
  }

  useEffect(() => {

   const postData = async () => {
    if(Object.keys(formErrors).length === 0 && isSubmit){
      setLoading(true);
      const request: CreateSpaceRequest = {
        title: values.title,
        legalCustodian: values.legalCustodian,
        ipDescription: editorData,
        officialWebsite: values.officialWebsite,
        twitter: values.twitter,
        discord: values.discord,
        hideFromHomepage: values.hideFromHomepage,
        resources: values.resources,
        logoImg: values.logoImg!,
        bannerImg: values.bannerImg!,
        featuredImg: values.featuredImg!
      }
  
      try{
        await createSpace(request, user).then((data:any )=> {
          if(data.data.status){
            props.setShowModal(false);
            notify("Space created!", "success", 6000);
            navigate(`/space/projects/${data.data.data.id}`)
            setWidget((prev:any) => [...prev, {linkTo:data.data.data.id, linkTitle: data.data.data.title, img: data.data.data.logoImg}]);
            setisCreated(true);
            setLoading(false)
          }else{
            setLoading(false)
            setisCreated(false);
            notify('Something went wrong!', "error", 6000);
          }  
       })
      }catch(err:any){
        setLoading(false)
        setisCreated(false);
        notify(err.message, "error", 8000);
      }
    }   
  }
  postData().catch(console.error);
  }, [formErrors])


  const validate = (values:any) => {
    const isImage = (file:any) => file['type'].includes('image');
    const errors:any = {};
    if(!values.title){
       errors.title = "Title is required";
     }
     if(!values.legalCustodian){
      errors.legalCustodian = "Legal custodian is required";
    }
     if(editorData.length < 1){
      errors.ipDescription = "Description is required";
    }
    if(!values.logoImg){
      errors.logoImg = "Logo image is required";
    }else{
      if(!isImage(values.logoImg)){
        errors.logoImg = "Logo image is not supported";
       }
    }   
    if(!values.featuredImg){
      errors.featuredImg = "Featured image is required";
    }else{
      if(!isImage(values.featuredImg)){
        errors.featuredImg = "Featured image is not supported";
       }
    }   
    if(!values.bannerImg){
      errors.bannerImg = "Banner image is required";
    }else{
      if(!isImage(values.bannerImg)){
        errors.bannerImg = "Banner image is not supported";
       }
    }
    setFormErrors(errors);
  }


  return (
    <>
    <BasicModal setShowModal={props.setShowModal} showModal={props.showModal}>
      <div className="modalMain w-full h-full overflow-hidden rounded-2xl mb-10">
        <div className="modalHeader flex items-center justify-between pt-10 px-5 sm:px-8 pb-4">
          <h1 className="text-white w-1/2 sm:w-auto sm:text-lg font-bold">
            Create a new space
          </h1>
          <button
            onClick={() => {
              props.setShowModal(false)
            }}
            className="text-white text-xs sm:text-sm font-bold"
            type="button"
          >
            Cancel
          </button>
         
        </div>
        
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="modalContent h-full overflow-auto px-5 sm:px-8 py-8 flex flex-col gap-y-20">


            <div className="flex flex-col gap-y-10 relative">

              <h1 className="text-white text-lg font-bold">IP details </h1>
              
              <Toaster />

              <div className="flex flex-col gap-y-1">
                <label className="text-white text-md font-bold">Title</label>
                <input
                  type="text"
                  placeholder="IP title..."
                  onChange={handleChange}
                  name='title'
                  className="typeInput text-white bg-transparent text-sm px-0 shadow-none outlin-none"
                />
                <p className='form-display-error'>{formErrors.title}</p>
              </div>

              <div className="flex flex-col gap-y-1">
                <label className="text-white text-md font-bold">
                  Legal custodian of this IP
                </label>
                <input
                  type="text"
                  placeholder="Enter name..."
                  onChange={handleChange}
                  name='legalCustodian'
                  className="typeInput text-white bg-transparent text-sm px-0 shadow-none outlin-none"
                />
                <p className='form-display-error'>{formErrors.legalCustodian}</p>
              </div>

              <div className="flex flex-col gap-y-1">
                <label className="text-white text-md font-bold">
                  IP Description
                </label>
                <BasicCKEditor data={values.ipDescription} setEditorData={setEditorData}  />
                <p className='form-display-error'>{formErrors.ipDescription}</p>
              </div>

              <div className="flex flex-col gap-y-5">
                <label className="text-white text-md font-bold">Links</label>
                <div className="flex flex-col sm:flex-row gap-y-4 sm:gap-y-0 sm:items-center sm:gap-x-5">
                  <label className="text-white text-sm sm:w-32">
                    Official website
                  </label>
                  <input
                    type="text"
                    placeholder="Website URL..."
                    onChange={handleChange}
                    name='officialWebsite'
                    className="typeInput text-white w-full sm:w-3/5 bg-transparent text-sm px-0 shadow-none outlin-none"
                  />
                </div> 
                <div className="flex flex-col sm:flex-row gap-y-4 sm:gap-y-0 sm:items-center sm:gap-x-5">
                  <label className="text-white text-sm sm:w-32">Twitter</label>
                  <input
                    type="text"
                    placeholder="Twitter URL..."
                    onChange={handleChange}
                    name='twitter'
                    className="typeInput text-white w-full sm:w-3/5 bg-transparent text-sm px-0 shadow-none outlin-none"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-y-4 sm:gap-y-0 sm:items-center sm:gap-x-5">
                  <label className="text-white text-sm sm:w-32">Discord</label>
                  <input
                    type="text"
                    placeholder="Discord URL..."
                    onChange={handleChange}
                    name='discord'
                    className="typeInput text-white w-full sm:w-3/5 bg-transparent text-sm px-0 shadow-none outlin-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-x-3">
                <input
                  type="checkbox"
                  onChange={handleChange}
                  name='hideFromHomepage'
                  className="w-4 h-4 p-2 border-2 bg-transparent rounded-md"
                />
                <label className="text-white text-sm">
                  Hide this space from the Greenlit homepage
                </label>
              </div>

            </div>

            <div className="flex flex-col gap-y-10">

              <h1 className="text-white text-lg font-bold">Branding</h1>

              <div className="flex flex-col gap-y-1">

                <label className="text-white text-md font-bold">Logo</label>

                <span className="text-xs text-white">
                  This will display on Greenlit navigation. 800 x 800 recommended.
                </span>
                {values.logoImg ? (
                  <div>
                    <img
                      src={URL.createObjectURL(values.logoImg)}
                      alt="logo"
                      className="fileInput mt-4 w-10 sm:w-20 object-cover"
                    />
                    <div className="flex items-center gap-x-2 mt-2">
                      <span className="text-white text-sm underline">
                        {values.logoImg.name}
                      </span>
                      <div className="border-r-2 border-white h-3 mt-1"></div>
                      <button
                        onClick={() => {
                          setValues({ ...values, ['logoImg']: null })
                        }}
                        className="text-white text-sm underline"
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="fileInput py-8 w-full mt-4 flex justify-center px-3">
                    <input
                      onChange={handleChange}
                      name='logoImg'
                      type="file"
                      className="hidden"
                    />
                    <span className="text-white text-md">
                      Drag & drop or <u>upload</u>
                    </span>
                  </label>
                )}
                <p className='form-display-error'>{formErrors.logoImg}</p>
              </div>
              <div className="flex flex-col gap-y-1">
                <label className="text-white text-md font-bold">
                  Banner Image
                </label>
                <span className="text-xs text-white">
                  This will be the header image for your space. 1200 x 800
                  recommended.
                </span>
                {values.bannerImg ? (
                  <div>
                    <img
                      src={URL.createObjectURL(values.bannerImg)}
                      alt="logo"
                      className="fileInput mt-4 p-2 h-40 w-full sm:w-2/3 object-cover"
                    />
                    <div className="flex items-center gap-x-2 mt-2">
                      <span className="text-white text-sm underline">
                        {values.bannerImg.name}
                      </span>
                      <div className="border-r-2 border-white h-3 mt-1"></div>
                      <button
                        onClick={() => {
                          setValues({ ...values, ['bannerImg']: null })
                        }}
                        className="text-white text-sm underline"
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="fileInput py-8 w-full mt-4 flex justify-center px-3">
                    <input
                      type="file"
                      onChange={handleChange}
                      name='bannerImg'
                      className="hidden"
                    />
                    <span className="text-white text-md">
                      Drag & drop or <u>upload</u>
                    </span>
                  </label>
                )}
                <p className='form-display-error'>{formErrors.bannerImg}</p>
              </div>
              <div className="flex flex-col gap-y-1">
                <label className="text-white text-md font-bold">
                  Featured Image
                </label>
                <span className="text-xs text-white">
                  This will display on the Greenlit spaces directory and as the
                  default image on user projects. 1920 x 1080 recommended.
                </span>
                {values.featuredImg ? (
                  <div>
                    <img
                      src={URL.createObjectURL(values.featuredImg)}
                      alt="logo"
                      className="fileInput mt-4 p-2 h-52 w-full sm:w-1/2 object-cover"
                    />
                    <div className="flex items-center gap-x-2 mt-2">
                      <span className="text-white text-sm underline">
                        {values.featuredImg.name}
                      </span>
                      <div className="border-r-2 border-white h-3 mt-1"></div>
                      <button
                        onClick={() => {
                          setValues({ ...values, ['featuredImg']: null })
                        }}
                        className="text-white text-sm underline"
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="fileInput py-8 w-full mt-4 flex justify-center px-3">
                    <input
                      onChange={handleChange}
                      name='featuredImg'
                      type="file"
                      className="hidden"
                    />
                    <span className="text-white text-md">
                      Drag & drop or <u>upload</u>
                    </span>
                  </label>
                )}
                <p className='form-display-error'>{formErrors.featuredImg}</p>
              </div>
              <div className="flex justify-start">
                <button disabled={loading}
                  type="submit"
                  className="text-white text-sm font-semibold rounded-full px-8 py-2 createSpaceModalBtn"
                >
                  Create space 
                    { loading && (
                      <Loader />
                    )}
                </button>
              </div>
            </div>

          </div>
        </form>
      
      </div>
    </BasicModal>
    </>
  )
}
