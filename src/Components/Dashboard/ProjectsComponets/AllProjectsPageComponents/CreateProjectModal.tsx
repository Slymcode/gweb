import React, { useState, useContext, useEffect } from 'react'

import { BasicModal } from '../../../SubComponents/Modal'
import { createProject, CreateProjectRequest } from '../../../../networking/projects'
import { getStakingTier } from '../../../../networking/license'


import './AllProjectsPage.css'
import { notify } from '../../../Inc/Toastr';

import { AppContext } from '../../../../context/AppContext'

import { Loader } from '../../../SubComponents/Loader';
import { useNavigate } from 'react-router-dom';
import { BasicCKEditor, extractContent } from '../../../Inc/BasicCKEditor';
import { Toaster } from 'react-hot-toast'


export const CreateProjectModal: React.FC<any> = (props) => {


  const { user, setisCreated} = useContext(AppContext);
  const [showStakingTierModal, setShowStakingTierModal] = useState<Boolean>(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState<Boolean>(false);
  const [loading, setLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState('');
  const [selectedTierCategory, setSelectedTierCAtegory] = useState('');
  const [adminApproval, setAdminApproval] = useState(null);
  const [stakingData, setStakingData] = useState<any>([])
  const [editorData, setEditorData] = React.useState('');
  const [formErrors, setFormErrors]:any =  useState({});
  const [isSubmit, setIsSubmit]:any =  useState(false);
  const navigate = useNavigate();

  
  const pathArray = window.location.pathname.split('/');
  const spaceId = pathArray[3];



  const handleShowStakingTierModal = () => {
    setShowStakingTierModal(true)
  }
  const handleShowNewProjectModal = () => {
    setShowNewProjectModal(true)
  }

  const handleSelectedTier = (e:any) => {
    document.querySelectorAll('.active').forEach(activeDiv => {
      activeDiv.classList.remove('active');
  });
    e.currentTarget.classList.add('active');
     setSelectedTier(e.currentTarget.getAttribute('data-id'))
     setAdminApproval(e.currentTarget.getAttribute('data-name'))
     setSelectedTierCAtegory(e.currentTarget.getAttribute('data-value'));
  }


  type FormValues = {
    projectTitle: string,
    projectDescription: string,
    projectEmail: string,
    projectCategory: string,
    projectAnticipatedRelease: string,
    twitter: string,
    discord: string,
    bannerImg: File | null,
    bannerUrl: String | null,
    featuredImg: File | null,
    featuredUrl: String | null,
  }

  const [values, setValues] = useState<FormValues>({
    projectTitle: '',
    projectDescription: '',
    projectEmail: '',
    projectCategory: '',
    projectAnticipatedRelease: '',
    twitter: '',
    discord: '',
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

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const target = event.target
    const  value = target.value
   setValues({ ...values, [target.name]: value })
 }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault() 
    validate(values);
    setIsSubmit(true);
  }

  useEffect( () => {

    const postData = async () => {
    if(Object.keys(formErrors).length === 0 && isSubmit){
      // Submit the form
      setLoading(true);
      const request = {
       tid: selectedTier,
       adminApproval: adminApproval,
       projectTitle: values.projectTitle,
       projectDescription: editorData,
       projectEmail: values.projectEmail,
       projectCategory: values.projectCategory,
       projectAnticipatedRelease: values.projectAnticipatedRelease,
       twitter: values.twitter,
       discord: values.discord,
       bannerImg: values.bannerImg!,
       featuredImg: values.featuredImg!
     }
 
     try{
       await createProject(request, user, spaceId).then((data:any )=> {
         if(data.data.status){
            props.setShowIntroModal(false)
            notify("Project created!", "success", 6000);
            navigate(`/space/projects/${spaceId}`)
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
    if(!values.projectTitle){
       errors.projectTitle = "Title is required";
     }
     if(editorData.length < 1){
      errors.projectDescription = "Description is required";
    }
    if(!values.projectEmail){
      errors.projectEmail = "Email is required";
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

  const getAllStakingTier = async (spaceId: string) => {
    await getStakingTier(spaceId).then(res => {
      setStakingData(res)
    })
   }
   useEffect(() => {
    getAllStakingTier(spaceId);
  }, [])

  return (
    <>    
        <BasicModal setShowModal={props.setShowIntroModal} showModal={props.showIntroModal}>
        <div className="modalMain h-full overflow-hidden rounded-2xl mb-10" style={{maxWidth: '650px'}}>
          <div className="modalHeader flex items-center justify-between pt-10 px-5 sm:px-8 pb-4">
            <h1 className="text-white w-1/2 sm:w-auto sm:text-lg font-bold">
              New project
            </h1>
            
            <button
              onClick={() => {
                props.setShowIntroModal(false)
              }}
              className="text-white text-xs sm:text-sm font-bold"
              type="button"
            >
              Cancel
            </button>         
          </div>
            <div className="modalContent h-full overflow-auto px-5 sm:px-8 py-5 flex flex-col gap-y-5">
              <div className="flex flex-col gap">
                  <p dangerouslySetInnerHTML={{__html: props.space.ipDescription}} className='text-gray-200 text-sm' style={{lineHeight: '20px', fontSize: '12px'}}></p>     
              </div>
              <div className="flex justify-start">
                      <button onClick={handleShowStakingTierModal}
                      className="text-gray-200 text-sm font-semibold rounded-full px-8 py-2 createProject_btn"
                      >
                      Continue
                      </button>
              </div>
            </div>
           
        </div>
      </BasicModal>

      {showStakingTierModal && (
     
     <BasicModal setShowModal={setShowStakingTierModal} showModal={showStakingTierModal}>
        <div className="modalMain h-full overflow-hidden rounded-2xl mb-10" style={{maxWidth: '700px'}}>
        <div className="modalHeader flex items-center justify-between pt-10 px-5 sm:px-8 pb-4">
          <h1 className="text-white w-1/2 sm:w-auto sm:text-lg font-bold">
            New project
          </h1>
          <button
            onClick={() => {
              setShowStakingTierModal(false);
              props.setShowIntroModal(false)
            }}
            className="text-white text-xs sm:text-sm font-bold"
            type="button"
          >
            Cancel
          </button>
         
        </div>
          <div className="modalContent h-full overflow-auto px-5 sm:px-8 py-8 flex flex-col">
             <div className="flex flex-col">
             <h1 className="text-white w-1/2 sm:w-auto sm:text-lg font-bold">
               Select staking tier
            </h1>
             <small className='text-gray-200'>Select the tier that best suits your project. You won’t be prompted to stake tokens or sign your license yet.</small>
             {props.space.tiers && props.space.tiers.length > 0 ? (
        <div className="flex flex-col mt-5">
          {stakingData.map((data: any, ind: any) => (    
              data.status && (
                <div data-id={data.id}  data-name={data.adminApproval} data-value={data.projectCategory} onClick={handleSelectedTier} key={ind + 1} className="stakingCard px-6 py-4 rounded-sm mb-5" style={{background: '##0D0C0C', borderRadius: '5px'}}>
                <div className="flex items-center justify-between">
                  <h1 className="text-white text-sm font-bold">{data.tierName}</h1>
                </div>
                <p dangerouslySetInnerHTML={{ __html: data.tierSummary }}  className="text-white text-xs mt-1"/>
                <div className="mt-5 flex items-center gap-y-5 sm:gap-y-0 flex-wrap sm:flex-nowrap gap-x-10 lg:gap-x-5 xl:gap-x-10">
                  <div>
                    <h3 className="uppercase text-xs text-white font-bold" style={{fontSize: '11px'}}>
                      Required stake
                    </h3>
                    <p className="text-xs text-white mt-2" style={{fontSize: '11px'}}>
                      {data.requiredStake} {data.token.tokenName} 
                    </p>
                  </div>
                  <div>
                    <h3 className="uppercase text-xs text-white font-bold" style={{fontSize: '11px'}}>
                      License
                    </h3>
                    <p className="text-xs text-white mt-2" style={{fontSize: '11px'}}>{data.license.licenseName}</p>
                  </div>
                  <div>
                    <h3 className="uppercase text-xs text-white font-bold" style={{fontSize: '11px'}}>
                      BUDGET
                    </h3>
                    <p className="text-xs text-white mt-2" style={{fontSize: '11px'}}>{data.projectBudgetRange}</p>
                  </div>
                  <div>
                    <h3 className="uppercase text-xs text-white font-bold" style={{fontSize: '11px'}}>
                      CATEGORIES
                    </h3>
                    <p className="text-xs text-white mt-2" style={{fontSize: '11px'}}>{data.projectCategory}</p>
                  </div>
                  <div>
                    <h3 className="uppercase text-xs text-white font-bold" style={{fontSize: '11px'}}>
                      Royalty
                    </h3>
                    <p className="text-xs text-white mt-2" style={{fontSize: '11px'}}>{data.royalty}</p>
                  </div>
                </div>
              </div>
              )       
             
            ))}
        </div>
      ) : (
        <p className="text-sm mt-5 italic text-white">No staking tiers yet</p>
      )}
             </div>
              <div className="flex justify-end mt-6">
                 <button disabled={selectedTier == ''? true : false } onClick={handleShowNewProjectModal}
                      className="text-white text-sm font-semibold rounded-full px-8 py-2 createProject_btn"
                      >
                      Next
                 </button>
              </div>
          </div>
      </div>
      </BasicModal>

      )}
       {showNewProjectModal && (
         <BasicModal setShowModal={setShowNewProjectModal} showModal={showNewProjectModal}>
         <div className="modalMain w-full h-full overflow-hidden rounded-2xl mb-10">
        <div className="modalHeader flex items-center justify-between pt-10 px-5 sm:px-8 pb-4 relative">
          <h1 className="text-white w-1/2 sm:w-auto sm:text-lg font-bold">
            Create a new project
          </h1>
          <Toaster />
          <button
            onClick={() => {
              setShowNewProjectModal(false)
              props.setShowIntroModal(false)
            }}
            className="text-white text-xs sm:text-sm font-bold"
            type="button"
          >
            Cancel
          </button>         
        </div>
        
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="modalContent h-full overflow-auto px-5 sm:px-8 py-8 flex flex-col gap-y-20">
            <div className="flex flex-col gap-y-10">
              <h1 className="text-white text-lg font-bold">Project details </h1>
              <div className="flex flex-col gap-y-1">
                <label className="text-white text-md font-bold">Title</label>
                <input
                  type="text"
                  placeholder="Title..."
                  onChange={handleChange}
                  name='projectTitle'
                  className={`typeInput text-white bg-transparent text-sm px-0 shadow-none outlin-none`}
                />
                <p className='form-display-error'>{formErrors.projectTitle}</p>
              </div>
              <div className="flex flex-col gap-y-1">
                <label className="text-white text-md font-bold">
                  Description
                </label>
                
                 <BasicCKEditor data={values.projectDescription} setEditorData={setEditorData} />
                 <p className='form-display-error'>{formErrors.projectDescription}</p>
              </div>
              <div className="flex flex-col gap-y-1">
                <label className="text-white text-md font-bold">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter email address..."
                  onChange={handleChange}
                  name='projectEmail'
                  className={`typeInput text-white bg-transparent text-sm px-0 shadow-none outlin-none`}
                />
                <p className='form-display-error'>{formErrors.projectEmail}</p>
              </div>
              <div className="w-full sm:w-1/2">
            <h1 className="text-white text-md font-semibold">
              Category
            </h1>
              <select onChange={handleSelect}
               name='projectCategory'
               className="capitalize mt-2 py-3 px-4 w-full text-xs text-white border border-zinc-700 stakingModalInput outline-0 shadow-none select rounded-md">
                <option></option>
              {selectedTierCategory != '' && (
               selectedTierCategory.split(',').map(item => (   
                <option>{item}</option>
               ))
             )}
             </select>
          </div>
          <div className="w-full sm:w-1/2">
            <h1 className="text-white text-md font-semibold">
              Anticipated Release
            </h1>
            <input onChange={handleChange}
                  type="date"
                  name='projectAnticipatedRelease'
                  placeholder="MM / DD / YY"
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
                      alt="featuredImg"
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

              <div className="flex flex-col gap-y-1">
                <label className="text-white text-md font-bold">
                  Banner Image
                </label>
                <span className="text-xs text-white">
                  This will display on the Greenlit spaces directory and as the
                  default image on user projects. 1920 x 1080 recommended.
                </span>
                {values.bannerImg ? (
                  <div>
                    <img
                      src={URL.createObjectURL(values.bannerImg)}
                      alt="bannerImg"
                      className="fileInput mt-4 p-2 h-52 w-full sm:w-1/2 object-cover"
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
                      onChange={handleChange}
                      name='bannerImg'
                      type="file"
                      className="hidden"
                    />
                    <span className="text-white text-md">
                      Drag & drop or <u>upload</u>
                    </span>
                  </label>
                )}
                <p className='form-display-error'>{formErrors.bannerImg}</p>
              </div>

           <div className='flex flex-row justify-between'>
            <div className="">
                <button
                  onClick={() => {
                    setShowNewProjectModal(false)
                  }}
                  type="submit"
                  className="text-white text-sm font-semibold rounded-full px-8 py-2 createProject_back_btn"
                >
                  Back 
                   
                </button>
              </div>

              <div className="">
                <button
                  type="submit"
                  className="text-white text-sm font-semibold rounded-full px-8 py-2 createSpaceModalBtn"
                >
                  Create project 
                  { loading && (
                      <Loader />
                    )} 
                </button>
              </div>
            </div>
            </div>
          </div>
        </form>
       
      </div>
    </BasicModal>
       
       )}
    </>
  )
}
