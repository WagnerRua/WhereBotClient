import React, { useContext, useState, useEffect} from 'react';
import { Context } from '../../Context/AuthContext';
import { FiPower, FiTrash2, FiX } from 'react-icons/fi';
import io from 'socket.io-client';

import { confirmAlert } from 'react-confirm-alert'; // Import

import logoImg from '../../assets/wherebot.svg';
import './styles.css';
import api from '../../api';



export default function Dashboard(){
  const { authenticatedUser, handleLogout } = useContext(Context);
  const [ surveys, setSurveys ] = useState([]);
  const [ robotID, setRobotID ] = useState('');
  const [ robots, setRobots ] = useState([]);
  const [heatmapZoom, setHeatmapZoom] = useState(<div></div>);

  async function getRobots(){
    const response = await api.post('/robot/userrobots', {userID: authenticatedUser._id}, { headers : { Authorization: api.defaults.headers.common['Authorization']}});
    setRobots(response.data.robots);
  }

  async function getSurveys(){
    const response  = await api.post('/robot/userrobots', {userID: authenticatedUser._id}, { headers : { Authorization: api.defaults.headers.common['Authorization']}});
    let array = [];

    for (const robot of response.data.robots){
      const response = await api.post('/survey/index', {robotID: robot}, { headers : { Authorization: api.defaults.headers.common['Authorization']}});
      response.data.surveysArray.forEach((value) => { array.push(value); });
    }
    setSurveys(array.reverse());
  }

  useEffect(() => {
    const socket = io('https://wherebot-backend.herokuapp.com/');
    //const socket = io('http://localhost:8080');

    socket.emit("user.id", {id: authenticatedUser._id});

    socket.on(`${authenticatedUser._id}-survey`, data => {
      getSurveys();

      confirmAlert({
        message: 'Um novo Site Survey foi adicionado!!!',
        buttons: [
          { label: "Close" }
        ]
      })
    });

    socket.on(`${authenticatedUser._id}-robot`, data => {
      getRobots();
    });

    socket.on(`${authenticatedUser._id}-robot-state`, data => {
      getRobots();
    });
    
    getRobots();
    getSurveys();

    return () => socket.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  async function handleLinkKey(e){
    e.preventDefault();

    try{
      await api.put('/robot/link-key', {robotID});
      confirmAlert({
        message: `Robot key link success.`,
        buttons: [ { label: "Close" }]
      })
    }catch(error){
      confirmAlert({
        message: `Error: ${error.response.data.error}.`,
        buttons: [ { label: "Close" }]
      })
    }
  }

  async function handleDeleteSurvey(id){
    try{
      await api.delete(`/survey/delete/${id}`);
      setSurveys(surveys.filter(survey => survey._id !== id));
    }catch(error){
      confirmAlert({
        message: `Error: ${error.response.data.error}.`,
        buttons: [ { label: "Close" }]
      })
    }
  }

  async function handleStartSurvey(robotID){
    try{
      await api.post('/robot/setstate', {robotID, state: "Start"});
      getRobots();
    }catch(error){
      confirmAlert({
        message: `Error: ${error.response.data.error}.`,
        buttons: [ { label: "Close" }]
      })
    }
  }

  function handleCLoseHeatmap(){
    setHeatmapZoom(<div></div>)
  }

  function handleImageClick(heatmap){
    setHeatmapZoom(
      <div className="heatmap-overlay">
        <div className="heatmap">
          <img src={heatmap} alt="heatmap"></img>
          <button onClick={() => handleCLoseHeatmap()} type="button" >
            <FiX size={30} color="#238956"/>
          </button>
        </div>
      </div>
    )
  }

  return(
    <>
      <div className="profile-container">
        <header>
          <img src= {logoImg} alt="Wherebot"/>
          <span>Welcome, {authenticatedUser.name}!</span>
          
          <form className="form-container">
            <input 
              type="text" 
              placeholder="Robot Key"
              className="robot-key-input"
              value={robotID} 
              onChange={e => setRobotID(e.target.value)} 
            />
          </form>

          <button className="button" onClick={handleLinkKey}>Link a robot</button>
          <button className="logout-btn" onClick={handleLogout} type="button">
            <FiPower size={18} color="#238956" />
          </button>
        </header>
        
        <h1>Your Robots</h1>

        <div className="robots-info">
          <ul>
            {robots.map(robot => (
              <li key={robot._id}>
                <p><strong>Model:</strong> {robot.model}</p>
                <p><strong>State:</strong> {robot.state}</p>
                <strong>Key: {robot._id}</strong>

                {robot.state === "Stopped" 
                ? <button className="start-btn" onClick={() => handleStartSurvey(robot._id)}>Start Survey</button>
                : <></>}
                
              </li>
            ))}
          </ul>
        </div>

        <h1>Your Site Surveys</h1>
        <ul>
          {surveys.map(survey => (
            <li key={survey._id}>
              <p><strong>Date: {(new Date(survey.createdAt)).toLocaleString()}</strong></p>
              <p><strong>Robot Key:</strong> {survey.robot}</p>
              <p><strong>Heatmaps:</strong></p>
              <div className="image-div">
                {survey.heatmaps.map( (heatmap, index) => {
                  return <img key={index} src={heatmap} onClick={() => handleImageClick(heatmap)} alt="heatmap"></img>
                })}
              </div>

              <button onClick={() => handleDeleteSurvey(survey._id)} type="button" className='delete-btn'>
                <FiTrash2 size={20}/>
              </button>
            </li>
          ))}
        </ul>
      </div>
      {heatmapZoom}
    </>
  )
}