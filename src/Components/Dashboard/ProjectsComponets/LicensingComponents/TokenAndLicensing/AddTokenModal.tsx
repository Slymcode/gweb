import React, {useState,useContext, useEffect} from 'react'
import { BasicModal } from '../../../../SubComponents/Modal'
import { editToken, addToken, FormTokenRequest, deleteToken } from '../../../../../networking/license'
import { notify } from './../../../../Inc/Toastr';
import { Loader } from '../../../../SubComponents/Loader';
import { AppContext } from './../../../../../context/AppContext'

import { BasicCKEditor, extractContent } from '../../../../Inc/BasicCKEditor';


import './AddTokenModal.css'
import { Toaster } from 'react-hot-toast';
export const AddTokenModal = (props: any) => {

  const [loading, setLoading] = useState(false);
  const [editorData, setEditorData] = React.useState('');
  const { navHeadData} = useContext(AppContext);

  const [formErrors, setFormErrors]:any =  useState({});
  const [isSubmit, setIsSubmit]:any =  useState(false);

  const pathArray = window.location.pathname.split('/');
  const spaceId = pathArray[3];


  type FormValues = {
    tokenName: string,
    network: string,
    tokenId: string
    contractAddress: string,
    description: string,
  }

  const [values, setValues] = useState<FormValues>({
    tokenName: '',
    tokenId: '',
    network: 'Ethereum Mainnet',
    contractAddress: '',
    description: ''
  })

  useEffect(() => {
    setValues({
        tokenName: props.req ? props.req.tokenName : '',
        tokenId: props.req ? props.req.tokenId : '',
        contractAddress: props.req ? props.req.contractAddress : '',
        network: props.req ? props.req.network : 'Ethereum Mainnet',
        description: props.req ? props.req.description : '',
      })
      
  },[props.req])


  const handleChange = (event: React.ChangeEvent<HTMLInputElement> & React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = event.target
    const  value = target.value
    
    setValues({ ...values, [target.name]: value })
  }

  const handlePasteChange = (event:any) => {
    const target = event.target
    const  value = target.value
    
    setValues({ ...values, [target.name]: value })
  }

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const target = event.target
    const  value = target.value
   setValues({ ...values, [target.name]: value })
 }

 function makeName(length:number) {// this is just for test to ensure hat token name looks different
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
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
          props.setIsSaved(false);
    if(props.req){
      const request: any = {
        id: props.req.id,
        tokenName: values.tokenName,
        tokenId: props.req.tokenId,
        network: values.network,
        contractAddress: values.contractAddress,
        description: editorData,
      }
      try{
  
        await editToken(request).then((data:any )=> {
         if(data.data.status){
           notify("Token updated!", "success", 6000);
           setLoading(false)
           props.setIsSaved(true)
           props.setShowTokenModal(false);
         }else{
           setLoading(false)
           props.setIsSaved(false)
           notify('Something went wrong!', "error", 6000);
         }  
      })
 
     }catch(err:any){
       setLoading(false)
       props.setIsSaved(false)
       notify(err.message, "error", 8000);
     }
     }else{
        const request: FormTokenRequest = {
        tokenName: makeName(4) + ' Hidden Ones (HIDDENONES)',
        tokenId: makeName(8),
        network: values.network,
        contractAddress: values.contractAddress,
        description: editorData,
      }
  
      try{
  
         await addToken(request, spaceId).then((data:any )=> {
          if(data.data.status){
            notify("Token added!", "success", 6000);
            setLoading(false)
            props.setIsSaved(true)
            props.setShowTokenModal(false);
          }else{
            setLoading(false)
            props.setIsSaved(false)
            notify('Something went wrong!', "error", 6000);
          }  
       })
  
      }catch(err:any){
        setLoading(false)
        props.setIsSaved(false)
        notify(err.message, "error", 8000);
      }
    }   
  }
}
  postData().catch(console.error);
  }, [formErrors])

  const validate = (values:any) => {
    const errors:any = {};
    if(!values.network){
       errors.network = "Network is required";
     }
     if(!values.contractAddress){
      errors.contractAddress = "Token Contract Address is required";
    }
    setFormErrors(errors);
  }

 
  const handleDelete = async (id:string, spaceId:string) => {
    if(props.req.tokentiers.length > 0){
      props.setShowTokenModal(false);
      notify('Delete Error! Token is currently in use.', "error", 8000); 
      return
    }
   
    if(window.confirm('Are you sure to continue? This action can not be undone!')){
      setLoading(true)
      props.setIsSaved(false)
      try{
        await deleteToken(id, spaceId).then(res => {
          if(res.status){
            props.setShowTokenModal(false);
            props.setIsSaved(true)
            setLoading(false)
            notify("Token deleted.", "success", 6000);
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
    <BasicModal setShowModal={props.setShowTokenModal} showModal={props.showTokenModal}>
      <div className="tokenModalMain w-full h-full overflow-hidden rounded-2xl mb-10 ">
        <div className="tokenModalHeader flex items-end justify-between pt-5 px-5 sm:px-8 pb-4">
          <div>
            <p className="text-sm text-white font-semibold">
              {navHeadData.title}
            </p>
            <h1 className="text-white w-1/2 sm:w-auto sm:text-lg font-bold mt-2">
            {props.req ? 'Edit token' : 'Add a token'}  
            </h1>
            <Toaster/>
          </div>
          <button
            onClick={() => {
              props.setShowTokenModal(false)
              setLoading(false)
            }}
            className="text-white text-xs sm:text-sm font-bold"
          >
            Cancel
          </button>
        </div>
        <div className="tokenModalContent h-full overflow-auto px-5 sm:px-8 py-8 flex flex-col gap-y-10">
        <form onSubmit={(e) => handleSubmit(e) }>
          <div>
            <h1 className="text-white text-md font-semibold">Network</h1>
            
            <select onChange={handleSelect}
                name='network'
                className=" mt-2 py-3 px-4 w-full text-xs text-white border border-zinc-700 stakingModalInput outline-0 shadow-none select rounded-md">
                 <option>Ethereum Mainnet</option>
            </select> 
            <p className='form-display-error'>{formErrors.network}</p> 
          </div>
          <div>
            <h1 className="text-white text-md font-semibold mt-4">
              Token Contract Address
            </h1>
            <input
              onChange={handlePasteChange}
              type="text"
              value={values.contractAddress}
              name='contractAddress'
              placeholder="Paste contract address..."
              className=" mt-2 py-3 px-0 w-full text-xs text-white border-b border-0 border-zinc-700 tokenModalInput outline-0 shadow-none bg-transparent"
            />
              <p className='form-display-error'>{formErrors.contractAddress}</p>
          </div>
          <div>
            <h1 className="text-white text-md font-semibold mt-4">
              Token description (optional)
            </h1>
            <BasicCKEditor data={values.description} setEditorData={setEditorData}  />
            <p className="text-zinc-500 text-xs text-right mt-1 font-semibold">
            {extractContent(editorData).length}/180
            </p>
          </div>
        <div>
        
        
          <div className='flex items-center justify-between gap-x-5 mt-5'>
            <div>
          <button type='submit' className='text-white text-xs font-semibold py-2 px-4 rounded-full addTokenModalBtn'>
             
            {props.req ? 'Edit token' : ' Add a token' }
          { loading && 
          (
            <Loader />
          )}
          </button>
          <button type='button'
            onClick={() => {
            props.setShowTokenModal(false)
          }}
           className='text-white text-xs font-semibold ml-4'>Cancel</button>
           </div>
           {props.req && (<button type='button' onClick={() => handleDelete(props.req.id, props.req.spaceId)} className='text-white text-xs font-semibold py-2 px-4 rounded-full projectBtn dangerBtn'>
            Delete Token
          
            </button>)}  
          </div>
        </div>
        </form>
        </div>
      </div>
    </BasicModal>
  )
}
