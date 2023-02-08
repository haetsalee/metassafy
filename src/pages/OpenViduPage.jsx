import { OpenVidu } from 'openvidu-browser';

import axios from 'axios';
import React, { Component } from 'react';
import UserVideoComponent from './openVidu/UserVideoComponent';

const APPLICATION_SERVER_URL = 'https://www.metassafy.store/api/session';

class OpenViduPage extends Component {
  constructor(props) {
    super(props);

    // These properties are in the state's component in order to re-render the HTML whenever their values change
    this.state = {
      mySessionId: 'SessionA',
      myUserName: 'Participant' + Math.floor(Math.random() * 100),
      session: undefined,
      sessionCamera: undefined,
      sessionScreen: undefined,
      screensharing: false,
      mainStreamManager: undefined, // Main video of the page. Will be the 'publisher' or one of the 'subscribers'
      publisher: undefined,
      subscribers: [],
      subscriberScreen: [],
    };

    this.joinSession = this.joinSession.bind(this);
    this.leaveSession = this.leaveSession.bind(this);
    this.switchCamera = this.switchCamera.bind(this);
    this.handleChangeSessionId = this.handleChangeSessionId.bind(this);
    this.handleChangeUserName = this.handleChangeUserName.bind(this);
    this.handleMainVideoStream = this.handleMainVideoStream.bind(this);
    this.onbeforeunload = this.onbeforeunload.bind(this);
    this.publishScreenShare = this.publishScreenShare.bind(this);
  }

  componentDidMount() {
    // window.addEventListener('beforeunload', this.onbeforeunload);
    this.leaveSession();
  }

  componentWillUnmount() {
    // window.removeEventListener('beforeunload', this.onbeforeunload);
    this.leaveSession();
  }

  onbeforeunload(event) {
    this.leaveSession();
  }

  handleChangeSessionId(e) {
    this.setState({
      mySessionId: e.target.value,
    });
  }

  handleChangeUserName(e) {
    this.setState({
      myUserName: e.target.value,
    });
  }

  handleMainVideoStream(stream) {
    if (this.state.mainStreamManager !== stream) {
      this.setState({
        mainStreamManager: stream,
      });
    }
  }

  deleteSubscriber(streamManager) {
    let subscribers = this.state.subscribers;
    let index = subscribers.indexOf(streamManager, 0);
    if (index > -1) {
      subscribers.splice(index, 1);
      this.setState({
        subscribers: subscribers,
      });
    }
  }

  // deleteSubscriberCamera(streamManager) {
  //   let subscribersCamera = this.state.subscribersCamera;
  //   let index = subscribersCamera.indexOf(streamManager, 0);
  //   if (index > -1) {
  //     subscribersCamera.splice(index, 1);
  //     this.setState({
  //       subscribersCamera: subscribersCamera,
  //     });
  //   }
  // }

  joinSession() {
    // --- 1) Get an OpenVidu object ---

    this.OV = new OpenVidu();
    this.OVCamera = new OpenVidu();
    // screen share
    this.OVScreen = new OpenVidu();

    // --- 2) Init a session ---

    this.setState(
      {
        session: this.OV.initSession(), // 카메라 세션 생성
        sessionCamera: this.OVCamera.initSession(), // 카메라 세션 생성
        sessionScreen: this.OVScreen.initSession(), // 스크린 쉐어 세션
      },
      () => {
        var mySession = this.state.session;
        var sessionCamera = this.state.sessionCamera;
        var sessionScreen = this.state.sessionScreen;

        // --- 3) Specify the actions when events take place in the session ---

        // On every new Stream received...
        mySession.on('streamCreated', (event) => {
          // Subscribe to the Stream to receive it. Second parameter is undefined
          // so OpenVidu doesn't create an HTML video by its own
          var subscriber = mySession.subscribe(event.stream, undefined);
          var subscribers = this.state.subscribers;
          subscribers.push(subscriber);

          // Update the state with the new subscribers
          this.setState({
            subscribers: subscribers,
          });
        });

        // sessionCamera.on('streamCreated', (event) => {
        //   if (event.stream.typeOfVideo == 'CAMERA') {
        //     // Subscribe to the Stream to receive it. HTML video will be appended to element with 'container-cameras' id
        //     var subscriberCamera = sessionCamera.subscribe(
        //       event.stream,
        //       'container-cameras'
        //     );
        //     // // When the HTML video has been appended to DOM...
        //     // subscriber.on('videoElementCreated', (event) => {
        //     //   // Add a new <p> element for the user's nickname just below its video
        //     //   appendUserData(event.element, subscriber.stream.connection);
        //     // });
        //     var subscribersCamera = this.state.subscribersCamera;
        //     subscribersCamera.push(subscriberCamera);
        //     this.setState({
        //       subscribersCamera: subscribersCamera,
        //     });
        //   }
        // });

        sessionScreen.on('streamCreated', (event) => {
          if (event.stream.typeOfVideo == 'SCREEN') {
            // Subscribe to the Stream to receive it. HTML video will be appended to element with 'container-cameras' id
            var subscriberScreen = sessionCamera.subscribe(
              event.stream,
              'container-screens'
            );
            // When the HTML video has been appended to DOM...
            // subscriberScreen.on('videoElementCreated', (event) => {
            //   // Add a new <p> element for the user's nickname just below its video
            //   appendUserData(event.element, subscriberScreen.stream.connection);
            // });
            var subscribersScreen = this.state.subscribersScreen;
            subscribersScreen.push(subscriberScreen);
            this.setState({
              subscribersScreen: subscribersScreen,
            });
          }
        });

        // On every Stream destroyed...
        mySession.on('streamDestroyed', (event) => {
          // Remove the stream from 'subscribers' array
          this.deleteSubscriber(event.stream.streamManager);
        });

        ///////////////////////////////////////
        // sessionCamera.on('streamDestroyed', (event) => {
        //   // Remove the stream from 'subscribersCamera' array
        //   this.deleteSubscriberCamera(event.stream.streamManager);
        // });

        // // On every Stream destroyed...
        // sessionCamera.on('streamDestroyed', (event) => {
        //   // Delete the HTML element with the user's nickname. HTML videos are automatically removed from DOM
        //   removeUserData(event.stream.connection);
        // });

        /////////////////////////

        // sessionCamera.on('exception', (exception) => {
        //   console.warn(exception);
        // });
        /////////////

        // On every asynchronous exception...
        mySession.on('exception', (exception) => {
          console.warn(exception);
        });

        // --- 4) Connect to the session with a valid user token ---

        // Get a token from the OpenVidu deployment
        this.getToken().then((token) => {
          // First param is the token got from the OpenVidu deployment. Second param can be retrieved by every user on event
          // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
          mySession
            .connect(token, { clientData: this.state.myUserName })
            .then(async () => {
              // --- 5) Get your own camera stream ---

              // Init a publisher passing undefined as targetElement (we don't want OpenVidu to insert a video
              // element: we will manage it on our own) and with the desired properties
              let publisher = await this.OV.initPublisherAsync(undefined, {
                audioSource: undefined, // The source of audio. If undefined default microphone
                videoSource: undefined, // The source of video. If undefined default webcam
                publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
                publishVideo: true, // Whether you want to start publishing with your video enabled or not
                resolution: '640x480', // The resolution of your video
                frameRate: 30, // The frame rate of your video
                insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
                mirror: false, // Whether to mirror your local video or not
              });

              // --- 6) Publish your stream ---

              mySession.publish(publisher);

              // Obtain the current video device in use
              var devices = await this.OV.getDevices();
              var videoDevices = devices.filter(
                (device) => device.kind === 'videoinput'
              );
              var currentVideoDeviceId = publisher.stream
                .getMediaStream()
                .getVideoTracks()[0]
                .getSettings().deviceId;
              var currentVideoDevice = videoDevices.find(
                (device) => device.deviceId === currentVideoDeviceId
              );

              // Set the main video in the page to display our webcam and store our Publisher
              this.setState({
                currentVideoDevice: currentVideoDevice,
                mainStreamManager: publisher,
                publisher: publisher,
              });
            })
            .catch((error) => {
              console.log(
                'There was an error connecting to the session:',
                error.code,
                error.message
              );
            });
        });

        mySession.on('exception', (exception) => {
          console.warn(exception);
        });

        // --- 4) Connect to the session with a valid user token ---

        // Get a token from the OpenVidu deployment
        this.getToken().then((tokenScreen) => {
          // Create a token for screen share
          sessionScreen
            .connect(tokenScreen, { clientData: this.state.myUserName })
            .then(async () => {
              document.getElementById('buttonScreenShare').style.visibility =
                'visible';
              console.log('Session screen connected');
            })
            .catch((error) => {
              console.log(
                'There was an error connecting to the session:',
                error.code,
                error.message
              );
            });
        });

        ///////////
        //     sessionScreen
        //     .connect(token, { clientData: this.state.myUserName })
        //     .then(async () => {
        //       // --- 5) Get your own camera stream ---

        //       // Init a publisher passing undefined as targetElement (we don't want OpenVidu to insert a video
        //       // element: we will manage it on our own) and with the desired properties
        //       let publisher = await this.OV.initPublisherAsync(undefined, {
        //         videoSource: "screen", // The source of video. If undefined default webcam
        //       });

        //       // --- 6) Publish your stream ---

        //       sessionScreen.publish(publisher);

        //       // Obtain the current video device in use
        //       var devices = await this.OV.getDevices();
        //       var videoDevices = devices.filter(
        //         (device) => device.kind === 'videoinput'
        //       );
        //       var currentVideoDeviceId = publisher.stream
        //         .getMediaStream()
        //         .getVideoTracks()[0]
        //         .getSettings().deviceId;
        //         console.log('User pressed the "Stop sharing" button');
        //       var currentVideoDevice = videoDevices.find(
        //         (device) => device.deviceId === currentVideoDeviceId
        //       );

        //       // Set the main video in the page to display our webcam and store our Publisher
        //       this.setState({
        //         currentVideoDevice: currentVideoDevice,
        //         mainStreamManager: publisher,
        //         publisher: publisher,
        //       });
        //     })
        //     .catch((error) => {
        //       console.log(
        //         'There was an error connecting to the session:',
        //         error.code,
        //         error.message
        //       );
        //     });
        // });

        /////////////////
        // sessionScreen
        //   .connect(token, { clientData: this.state.myUserName })
        //   .then((token) => {
        //     sessionScreen
        //       .connect(token)
        //       .then(() => {
        //         console.log('응애응애');
        //         var publisher = this.OVScreen.initPublisher(
        //           'html-element-id',
        //           {
        //             videoSource: 'screen',
        //           }
        //         );

        //         publisher.once('accessAllowed', (event) => {
        //           publisher.stream
        //             .getMediaStream()
        //             .getVideoTracks()[0]
        //             .addEventListener('ended', () => {
        //               console.log('User pressed the "Stop sharing" button');
        //             });
        //           sessionScreen.publish(publisher);
        //         });

        //         publisher.once('accessDenied', (event) => {
        //           console.warn('ScreenShare: Access Denied');
        //         });
        //       })
        //       .catch((error) => {
        //         console.warn(
        //           'There was an error connecting to the session:',
        //           error.code,
        //           error.message
        //         );
        //       });
        //   });

        // this.getToken().then((tokenCamera) => {
        //   // First param is the token got from the OpenVidu deployment. Second param can be retrieved by every user on event
        //   // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
        //   sessionCamera
        //     .connect(tokenCamera, { clientData: this.state.myUserName })
        //     .then(async () => {
        //       // --- 5) Get your own camera stream ---

        //       // Init a publisher passing undefined as targetElement (we don't want OpenVidu to insert a video
        //       // element: we will manage it on our own) and with the desired properties
        //       let publisher = await this.OV.initPublisherAsync(
        //         'container-cameras',
        //         {
        //           audioSource: undefined, // The source of audio. If undefined default microphone
        //           videoSource: undefined, // The source of video. If undefined default webcam
        //           publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
        //           publishVideo: true, // Whether you want to start publishing with your video enabled or not
        //           resolution: '640x480', // The resolution of your video
        //           frameRate: 30, // The frame rate of your video
        //           insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
        //           mirror: false, // Whether to mirror your local video or not
        //         }
        //       );

        //       // --- 6) Publish your stream ---

        //       sessionCamera.publish(publisher);

        //       // Obtain the current video device in use
        //       var devices = await this.OV.getDevices();
        //       var videoDevices = devices.filter(
        //         (device) => device.kind === 'videoinput'
        //       );
        //       var currentVideoDeviceId = publisher.stream
        //         .getMediaStream()
        //         .getVideoTracks()[0]
        //         .getSettings().deviceId;
        //       var currentVideoDevice = videoDevices.find(
        //         (device) => device.deviceId === currentVideoDeviceId
        //       );

        //       // Set the main video in the page to display our webcam and store our Publisher
        //       this.setState({
        //         currentVideoDevice: currentVideoDevice,
        //         mainStreamManager: publisher,
        //         publisher: publisher,
        //       });
        //     })
        //     .catch((error) => {
        //       console.log(
        //         'There was an error connecting to the session:',
        //         error.code,
        //         error.message
        //       );
        //     });
        // });

        // this.getToken().then((tokenScreen) => {
        //   // Create a token for screen share
        //   sessionScreen
        //     .connect(tokenScreen, { clientData: this.state.myUserName })
        //     .then(() => {
        //       document.getElementById('buttonScreenShare').style.visibility =
        //         'visible';
        //       console.log('Session screen connected');
        //     })
        //     .catch((error) => {
        //       console.warn(
        //         'There was an error connecting to the session for screen share:',
        //         error.code,
        //         error.message
        //       );
        //     });
        // });
      }
    );
  }

  publishScreenShare() {
    const sessionScreen = this.state.sessionScreen;
    var publisherScreen = this.OVScreen.initPublisher('container-screens', {
      videoSource: 'screen',
    });

    publisherScreen.once('accessAllowed', (event) => {
      document.getElementById('buttonScreenShare').style.visibility = 'hidden';
      this.state = {
        screensharing: true,
      };

      // If the user closes the shared window or stops sharing it, unpublish the stream
      publisherScreen.stream
        .getMediaStream()
        .getVideoTracks()[0]
        .addEventListener('ended', () => {
          console.log('User pressed the "Stop sharing" button');
          sessionScreen.unpublish(publisherScreen);
          document.getElementById('buttonScreenShare').style.visibility =
            'visible';
          this.state = {
            screensharing: false,
          };
        });
      sessionScreen.publish(publisherScreen);
    });

    publisherScreen.on('videoElementCreated', (event) => {
      var subscriber = sessionScreen.subscribe(
        event.stream,
        'container-screens'
      );
      // When the HTML video has been appended to DOM...
      // subscriberScreen.on('videoElementCreated', (event) => {
      //   // Add a new <p> element for the user's nickname just below its video
      //   appendUserData(event.element, subscriberScreen.stream.connection);
      // });
      var subscribers = this.state.subscribers;
      subscribers.push(subscriber);
      this.setState({
        subscribers: subscribers,
      });
      event.element['muted'] = true;
    });

    publisherScreen.once('accessDenied', (event) => {
      console.error('Screen Share: Access Denied');
    });

    // var newPublisher = this.OV.initPublisher(undefined, {
    //   videoSource: newVideoDevice[0].deviceId,
    //   publishAudio: true,
    //   publishVideo: true,
    //   mirror: true,
    // });

    // //newPublisher.once("accessAllowed", () => {
    // await this.state.session.unpublish(this.state.mainStreamManager);

    // await this.state.session.publish(newPublisher);
    // this.setState({
    //   currentVideoDevice: newVideoDevice[0],
    //   mainStreamManager: newPublisher,
    //   publisher: newPublisher,
    // });
  }

  leaveSession() {
    // --- 7) Leave the session by calling 'disconnect' method over the Session object ---
    console.log('나가라제발!!!!!!!!!!!!!!!!!!!');
    const mySession = this.state.session;
    const sessionCamera = this.state.sessionCamera;
    const sessionScreen = this.state.sessionScreen;

    if (mySession) {
      mySession.disconnect();
    }
    if (sessionCamera) {
      sessionCamera.disconnect();
    }
    if (sessionScreen) {
      sessionScreen.disconnect();
    }

    // Empty all properties...
    this.OV = null;
    this.OVScreen = null;
    this.setState({
      session: undefined,
      subscribers: [],
      mySessionId: 'SessionA',
      myUserName: 'Participant' + Math.floor(Math.random() * 100),
      screensharing: false,
      mainStreamManager: undefined,
      publisher: undefined,
    });
  }

  async switchCamera() {
    try {
      const devices = await this.OV.getDevices();
      var videoDevices = devices.filter(
        (device) => device.kind === 'videoinput'
      );

      if (videoDevices && videoDevices.length > 1) {
        var newVideoDevice = videoDevices.filter(
          (device) => device.deviceId !== this.state.currentVideoDevice.deviceId
        );

        if (newVideoDevice.length > 0) {
          // Creating a new publisher with specific videoSource
          // In mobile devices the default and first camera is the front one
          var newPublisher = this.OV.initPublisher(undefined, {
            videoSource: newVideoDevice[0].deviceId,
            publishAudio: true,
            publishVideo: true,
            mirror: true,
          });

          //newPublisher.once("accessAllowed", () => {
          await this.state.session.unpublish(this.state.mainStreamManager);

          await this.state.session.publish(newPublisher);
          this.setState({
            currentVideoDevice: newVideoDevice[0],
            mainStreamManager: newPublisher,
            publisher: newPublisher,
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    // 1위에 있는거
    //  mySessionId = document.getElementById("sessionId").value;
    //  myUserName = document.getElementById("userName").value;
    const mySessionId = this.state.mySessionId;
    const myUserName = this.state.myUserName;
    const screensharing = this.screensharing;

    return (
      <div className="container">
        {this.state.session === undefined ? (
          <div id="join">
            <div id="img-div">
              <img
                src="resources/images/openvidu_grey_bg_transp_cropped.png"
                alt="OpenVidu logo"
              />
            </div>
            <div id="join-dialog" className="jumbotron vertical-center">
              <h1> Join a video session </h1>
              <form className="form-group" onSubmit={this.joinSession}>
                <p>
                  <label>Participant: </label>
                  <input
                    className="form-control"
                    type="text"
                    id="userName"
                    value={myUserName}
                    onChange={this.handleChangeUserName}
                    required
                  />
                </p>
                <p>
                  <label> Session: </label>
                  <input
                    className="form-control"
                    type="text"
                    id="sessionId"
                    value={mySessionId}
                    onChange={this.handleChangeSessionId}
                    required
                  />
                </p>
                <p className="text-center">
                  <input
                    className="btn btn-lg btn-success"
                    name="commit"
                    type="submit"
                    value="JOIN"
                  />
                </p>
              </form>
            </div>
          </div>
        ) : null}

        {this.state.session !== undefined ? (
          <div id="session">
            <div id="session-header">
              <h1 id="session-title">{mySessionId}</h1>
              <input
                className="btn btn-large"
                type="button"
                id="buttonScreenShare"
                onClick={this.publishScreenShare}
                value="Screen share"
                style={{ visibility: 'hidden' }}
              />
              <input
                className="btn btn-large btn-danger"
                type="button"
                id="buttonLeaveSession"
                onClick={this.leaveSession}
                value="Leave session"
              />
            </div>

            {this.state.mainStreamManager !== undefined ? (
              <div id="main-video" className="col-md-6">
                <UserVideoComponent
                  streamManager={this.state.mainStreamManager}
                />
                <input
                  className="btn btn-large btn-success"
                  type="button"
                  id="buttonSwitchCamera"
                  onClick={this.switchCamera}
                  value="Switch Camera"
                />
              </div>
            ) : null}
            <div id="video-container" className="col-md-6">
              {this.state.publisher !== undefined ? (
                <div
                  className="stream-container col-md-6 col-xs-6"
                  onClick={() =>
                    this.handleMainVideoStream(this.state.publisher)
                  }
                >
                  <UserVideoComponent streamManager={this.state.publisher} />
                </div>
              ) : null}
              {this.state.subscribers.map((sub, i) => (
                <div
                  key={i}
                  className="stream-container col-md-6 col-xs-6"
                  onClick={() => this.handleMainVideoStream(sub)}
                >
                  <UserVideoComponent streamManager={sub} />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  /**
   * --------------------------------------------
   * GETTING A TOKEN FROM YOUR APPLICATION SERVER
   * --------------------------------------------
   * The methods below request the creation of a Session and a Token to
   * your application server. This keeps your OpenVidu deployment secure.
   *
   * In this sample code, there is no user control at all. Anybody could
   * access your application server endpoints! In a real production
   * environment, your application server must identify the user to allow
   * access to the endpoints.
   *
   * Visit https://docs.openvidu.io/en/stable/application-server to learn
   * more about the integration of OpenVidu in your application server.
   */
  async getToken() {
    const sessionId = await this.createSession(this.state.mySessionId);
    return await this.createToken(sessionId);
  }

  async createSession(sessionId) {
    const response = await axios.post(
      APPLICATION_SERVER_URL,
      { customSessionId: sessionId },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response.data; // The sessionId
  }

  ////////////
  //   function createSession(sessionId) {
  //     return new Promise((resolve, reject) => {
  //         $.ajax({
  //             type: "POST",
  //             url: APPLICATION_SERVER_URL + "api/sessions",
  //             data: JSON.stringify({ customSessionId: sessionId }),
  //             headers: { "Content-Type": "application/json" },
  //             success: response => resolve(response), // The sessionId
  //             error: (error) => reject(error)
  //         });
  //     });
  // }

  async createToken(sessionId) {
    const response = await axios.post(
      APPLICATION_SERVER_URL + `/${sessionId}/connections`,
      {},
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response.data; // The token
  }

  /////////
  //   function createToken(sessionId) {
  //     return new Promise((resolve, reject) => {
  //         $.ajax({
  //             type: 'POST',
  //             url: APPLICATION_SERVER_URL + 'api/sessions/' + sessionId + '/connections',
  //             data: JSON.stringify({}),
  //             headers: { "Content-Type": "application/json" },
  //             success: (response) => resolve(response), // The token
  //             error: (error) => reject(error)
  //         });
  //     });
  // }
}

export default OpenViduPage;