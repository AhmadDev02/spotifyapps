import React, { useState, useEffect } from 'react';
import { Container } from "react-bootstrap"

import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'

const axios = require('axios');



function Index() {
    

  const [access_token, set_access_token] = useState(null);
  const [query, set_query] = useState('');
  const [tracks, set_tracks] = useState([]);

  const LoginButton = () => {

    let client_id = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
    let scope = 'playlist-modify-private';
    let redirect_uri = 'http://localhost:3000';

    let spotify_url = 'https://accounts.spotify.com/authorize';
        spotify_url += '?response_type=token';
        spotify_url += '&client_id=' + encodeURIComponent(client_id);
        spotify_url += '&scope=' + encodeURIComponent(scope);
        spotify_url += '&redirect_uri=' + encodeURIComponent(redirect_uri);

      return (
    <Container
    className="d-flex justify-content-center align-items-center"
    style={{ minHeight: "100vh" }}
    >
    <a href={spotify_url} className="btn btn-success btn-lg">
        LOG IN WITH SPOTIFY
        </a>
     </Container>
    );
  }

  const Form = () => {
      return (
      <div className="w-full">
        <input
          onChange={(event) => {set_query(event.target.value)}}
          value={query}
          type="search"
          className="bg-white px-2 py-1  rounded-tl w-80 mb-3"
          placeholder="Katakan Sesuatu :(...."></input>
        <button onClick={() => {handleClick()}} className="bg-spotify_main hover:bg-gray-600 px-2 py-1 mb-3 text-green rounded-br rounded-tr"><i className="fa fa-search"></i></button>
        </div>
    );
  }

//   const Track = (props) => {
//     return (
//       <div className="bg-spotify_card px-5 py-5 rounded w-1/5 mr-4 mb-4 cursor-pointer hover:bg-spotify_card_hover">
//         <img src={props.image_url} title={props.album_name} alt="{props.album_name}" className="object-cover rounded h-40 w-full"/>
//         <p className="text-base mt-2 mb-1 font-bold text-gray-100">{props.track_title}</p>
//         <div className="">
//           <p className="text-sm text-gray-300">{props.artist_name}</p>
//         </div>
//       </div>
//     );
//   }

  function handleClick() {
    try {
      let url = 'https://api.spotify.com/v1/search?q='+query+'&type=track,artist';
      axios.get(url, {
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
      })
      .then(res => {
        set_tracks(res.data.tracks.items);
      })
    } catch (err) {
      console.error(err);
    } finally {
      console.log(tracks);
    }
  }

  function getHashParams() {
    let hashParams = {};
    let e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  useEffect(() => {
    let params = getHashParams()
    let token = params.access_token;
    set_access_token(token);
  });

  return (
    <div className="bg-dark_main min-h-screen p-5">

      {(!access_token) && (
        <LoginButton/>
      )}

      {(access_token) && (
        <Form/>
      )}

  <section className='py-4 container'>
      <div className='row justify-content-center'>
        {tracks.map((item) => {
          return (
            <div className='col-11 col-md-6 col-lg-3 mx-0 mb-4'>
            <div className='card p-0 overflow-hidden h-100 shadow' key={item.album.id}>
              <img src={item.album.images[0].url} className='card-img-top' alt='' />
              <div className='card-body'>
                 <h5 className='card-tittle' >{item.name}</h5>
                 <p className='card-text' >{item.album.artists[0].name}</p>
                 <p className='card-text' >{item.album.name}</p>
            
              </div>
            </div>
          </div>
            // <Track
            //   key={item.album.id}
            //   image_url={item.album.images[0].url}
            //   track_title={item.name}
            //   artist_name={item.album.artists[0].name}
            //   album_name={item.album.name}
            // />
          );
        })}
      </div>
          </section>
    </div>
  );
}

export default Index;