import React from 'react'
import {AiOutlineHome} from "react-icons/ai"
import {MdOutlineExplore, MdOutlineSubscriptions, MdOutlineVideoLibrary} from "react-icons/md"
import './LeftSidebar.css'
import shorts from './shorts.png'
import {NavLink}from "react-router-dom"
import { MdGroups } from "react-icons/md";
import { RiChatPrivateFill } from "react-icons/ri";
function LeftSidebar() {
  return (
    <div className='container_leftSidebar'>
        <NavLink to={'/'} className='icon_sidebar_div' >
            <AiOutlineHome size={22} className="icon_sidebar"/>
            <div className="text_sidebar_icon">Home</div>
        </NavLink>
        <div className='icon_sidebar_div' >
            <MdOutlineExplore size={22} className="icon_sidebar"/>
            <div className="text_sidebar_icon">Explore</div>
        </div>
        <div className='icon_sidebar_div' >
            <img src={shorts} width={22} className="icon_sidebar"/>
            <div className="text_sidebar_icon">Shorts</div>
        </div>
        <div className='icon_sidebar_div' >
            <MdOutlineSubscriptions size={22} className="icon_sidebar"/>
            <div className="text_sidebar_icon" style={{fontSize:"12px"}}>Subcriptions</div>
        </div>
        <NavLink to={'/library'} className='icon_sidebar_div' >
            <MdOutlineVideoLibrary size={22} className="icon_sidebar"/>
            <div className="text_sidebar_icon">Library</div>
        </NavLink>
        <NavLink to={'/privatechat'} className='icon_sidebar_div' >
            <RiChatPrivateFill size={22} className="icon_sidebar"/>
            <div className="text_sidebar_icon">Private Chat</div>
        </NavLink>
      
        <NavLink to={'/groupchat'} className='icon_sidebar_div' >
            <MdGroups size={22} className="icon_sidebar"/>
            <div className="text_sidebar_icon">Group Chat</div>
        </NavLink>
    </div>
  )
}

export default LeftSidebar

