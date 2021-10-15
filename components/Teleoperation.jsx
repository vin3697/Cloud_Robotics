import React, {Component} from "react";
import {Joystick} from 'react-joystick-component';
import Config from "../scripts/config";

class Teleoperation extends Component{
    state = {connected:false, ros: null };

    constructor(){
        super();
        this.init_connection();

        this.handleMove =this.handleMove.bind(this);
        this.handleStop =this.handleStop.bind(this);
    }

    init_connection(){

        this.state.ros = new window.ROSLIB.Ros();
        console.log(this.state.ros);

        this.state.ros.on("connection", () => {
            console.log("connection established in teleoperation component!");
            this.setState({connected: true});
        });

        this.state.ros.on("closed", () => {
            console.log("connection is closed!");
            this.setState({connected: false});

            //try to reconnect every 3seconds
            setTimeout(() => {

                try{

                    this.state.ros.connect("ws://" + Config.ROSBRIDGE_SERVER_IP + ":" +
                    Config.ROSBRIDGE_SERVER_PORT+"");
        
                }catch(error){
                    console.log("connection problem");
                }

            }, Config.RECONNECTION_TIMER);
        });

        try{

            this.state.ros.connect("ws://" + Config.ROSBRIDGE_SERVER_IP + ":" +
            Config.ROSBRIDGE_SERVER_PORT+"");

        }catch(error){
            console.log("connection problem");
        }

    }

handleMove (event) {
    console.log("handle move");
    //we need to create a ROS publisher on the topic cmd_vel

    var cmd_vel = new window.ROSLIB.Topic({
        
        ros: this.state.ros,
        name: Config.CMD_VEL_TOPIC,
        messageType: "geometry_msgs/Twist",

    });

    //we need to create a twist message to be publish to the ros_bridge
    
    var twist = new window.ROSLIB.Message({
        linear: {
            x:event.y / 40,
            y:0,
            z:0,
        },
        angular:{
            x:0,
            y:0,
            z:-event.x / 40,
        },

    });


    //we need to publish the message on the cmd_vel topic
    cmd_vel.publish(twist);

}


handleStop (event) {
    console.log("handle stop");
    
    //we need to create a ROS publisher on the topic cmd_vel

    var cmd_vel = new window.ROSLIB.Topic({
        
        ros: this.state.ros,
        name: Config.CMD_VEL_TOPIC,
        messageType: "geometry_msgs/Twist",

    });

    //we need to create a twist message to be publish to the ros_bridge
    
    var twist = new window.ROSLIB.Message({
        linear: {
            x:event.y / 40,
            y:0,
            z:0,
        },
        angular:{
            x:0,
            y:0,
            z:-event.x / 40,
        },

    });


    //we need to publish the message on the cmd_vel topic
    cmd_vel.publish(twist);
}  


    render() {
        return (<div>
        <Joystick
        size ={100}
        baseColor="orange"
        stickColor="white"
        move={this.handleMove}
        stop={this.handleStop}>    
        </Joystick>
        </div>);
    }
}

export default Teleoperation;
