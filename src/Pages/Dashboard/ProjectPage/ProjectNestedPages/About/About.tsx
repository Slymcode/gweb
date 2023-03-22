import { useEffect, useState, useContext } from 'react'
import { AppContext } from '../../../../../context/AppContext';
import { editProject, getProject, isProjectAdmin, setProjectStatus } from '../../../../../networking/projects';
import './../../../../../Components/Dashboard/ProjectsComponets/AllProjectsPageComponents/AllProjectsPage.css'
import './About.css'

export const About = () => {

  const { navHeadData} = useContext(AppContext);
  const [tokensTab, setTokensTab] = useState<any>('default')

  const bgImage = navHeadData.banner;


  return (
    <div className="reative overflow-hidden">
      <div className="aboutHeader h-60 p-10 flex items-end" style={{backgroundImage: `url(${bgImage})` }}>
        <h1 className="aboutHeader_heading text-white font-bold">
          About
        </h1>
      </div>

    <div className="w-full m-4 sm:m-10 xl:pr-20">
      
        <div className="grid grid-cols-12 gap-y-5 xl:gap-y-0 sm:gap-x-10">
          <div className="col-span-12 sm:col-span-9 xl:col-span-9">
            <div className='projectContent mb-20'>
                  <div className='projectFeaturedImage'>
                    <div className="aboutHeader rounded-lg h-60 p-10" style={{backgroundImage: `url(${bgImage})` }}></div>
                  </div>
                  <div className='text-gray-200'>
                    <h2 className='text-gray-200 font-regular mt-4 mb-4'>The HIDDEN LAKES CINEMATIC UNIVERSE is a decentralized movie IP 
                      where supernatural 
                      beings threaten the sanity of every denizen of the metaverse! Cryptids, monsters, and paranormal phenomena 
                      run rampant. The HLCU was incepted by the first-ever movie released exclusively as an NFT: the monster mystery 
                      mockumentary “He Who Lives In Hidden Lakes,” about a town’s obsession with a supernatural hobo known as the 
                      HIDDEN MAN.
                      Since then, the HLCU has also become the world’s first truly decentralized media IP where the fanbase IS the studio. We do this 
                      via proof-of-stake licensing. Using this platform, any owner of HIDDEN ONES Cryptids can stake their NFTs in exchange 
                      for a commercial license to the HLCU. Unlike prior web3 projects, staking creators can use the entire HLCU 
                      brand and any and all characters, stories and concepts completely freely—not just the NFT artwork they own. 
                      Creators in the HLCU receive exclusive access to resources, grants, and a built-in community to help them 
                      realize their visions!
                    </h2>
                  </div>
                
            </div>
          </div>
        </div>
      </div>




    </div>
  )
}










