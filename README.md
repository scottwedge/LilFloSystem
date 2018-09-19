# LilFloSystem
This is going to be the master repository for all of the Lil'Flo remote control, local control, messaging, etc.

## Dependencies
- ROS
- pyserial 
- [librealsense - including developer packages](https://github.com/IntelRealSense/librealsense/blob/master/doc/distribution_linux.md#installing-the-packages)
- [ROS Realsense wrapper](https://github.com/intel-ros/realsense)
- (maybe)[ROS Realsense demos](https://github.com/IntelRealSense/realsense_samples_ros.git)
  (notice that you have not yet installed the cmoplete realsense SDK noted in the 
  middle)
    - you will need to modify one of the cmake files per this: https://github.com/IntelRealSense/realsense_samples_ros/issues/26

## Setup

### NUC
1. Setup Ubuntu 16
    0. Make the computer name `flo-nuc` username `flo` and password `flodev#01`
    1. Make sure to connect to a network and update everything: 
        `sudo apt update -y && sudo apt upgrade -y`
    2. Make sure to set the system to login automatically #TODO is this really 
       necessary?
2. [Install ROS Kinetic](http://wiki.ros.org/kinetic/Installation)
    1. Be sure to setup ROS to load in your bashrc by adding: 
       `source ~/catkin_ws/devel/setup.bash` to your bashrc
3.  Setup the network in the bashrc. It is likely that you will be on a network 
    that changes your IP address frequently, so that needs to be handled. 
    1. Type `ifconfig` and get the name of the wifi adapter
    2. Add this line to `~/.bashrc`: 
       `function ifip { /sbin/ifconfig $1 | grep "inet addr" | awk -F: '{print $2}' |awk '{print $1}'; }`
    3. Setup the IP address in the bashrc: 
       `` export ROS_IP=`ifip <name of wifi adapter, ex: wlp3s0>` ``
    4. Set the ROS Master to be the local machine in the bashrc: 
       `export ROS_MASTER_URI=http://localhost:11311`
3. Create a catkin workspace: `mkdir ~/catkin_ws/src -r` #TODO: actually try that command
    1. Load the catkin ws in your bashrc by adding: `~/catkin_ws/devel/setup.bash`
5. Enable SSH: 
    1. `sudo apt-get install openssh-server -y`
6. Install the other dependencies


#### Install Various Dependencies:
1. pip install pyserial --user

#### Optional Things to Make Life Easier
2. Enable VNC, so that you can see what is on the robot
3. Install RMATE to allow you to edit code over SSH from a remote text editor:
    ```bash
    sudo wget -O /usr/local/bin/rcode \
    https://raw.github.com/aurora/rmate/master/rmate
    chmod a+x /usr/local/bin/rcode
    ```

### Lighting Control Teensy

### Dev Computer
You should have a separate development computer. You can mostly follow the 
instructions for the NUC from above. 
However, you will need to change the ROS Master URI to point to the robot which 
you want to work with. Also, note that when loading ROS, you change things like
your Python path, which means you probably only want to load the ROS search tree
when actually working in ROS. One way to do that is with something like this in
your bashrc file:

```bash
function ifip { /sbin/ifconfig $1 | grep "inet addr" | awk -F: '{print $2}' |awk '{print $1}'; }
export ROS_IP=`ifip wlp3s0`

function connect_to_robot {
    source /opt/ros/kinetic/setup.bash
    source ~/catkin_ws/devel/setup.bash
    # takes a single number arg representing the robot
    if (( $1 == 3 ))
    then
        export ROS_MASTER_URI=http://158.130.191.68:11311 # Robot 3
        ssh -R 52698:localhost:52698 sr3@158.130.191.68
    elif (( $1 == 4 ))
    then
        export ROS_MASTER_URI=http://158.130.191.69:11311 # Robot 4
        ssh -R 52698:localhost:52698 servicerobot4@158.130.191.69
    elif (( $1 == 0 ))
    then
        export ROS_MASTER_URI=http://localhost:11311
    fi
}
```
This first sets up the local IP address, then gives you a function to connect to
a robot. If you want to work in ROS treating your local machine as the robot, 
simply type `connect_to_robot 0` in a shell and you are set, ROS will be loaded
and the ROS Master URI will be set to the local host. You can edit and add to the
list of robots to connect to, changing the IP address to match the robot. If
your robot doesn't have a static IP address, this isn't going to work too well. 
The way this is setup, calling `connect_to_robot #` will automatically ssh into 
the robot with rmate set to route back to allow remote text editing. You may
find that this needs to be altered for your use case. 

If you would like to take advantage of the rmate connection, you can use textmate
or VS Code ([instructions](http://michaelsobrepera.com/guides/vscode.html))

#### Setup for easy SSH connection:
1. Generate SSH keys on your development computer: `ssh-keygen -t rsa` the defaults are fine
2. Make a ssh key folder on the robot: `ssh flo@192.168.1.10 mkdir -p .ssh` 
3. Move the keyfile from the dev computer to the robot: 
   `` cat ~/.ssh/id_rsa.pub | ssh flo@192.168.1.10 'cat >> .ssh/authorized_keys' ``


## Developing
In order to develop on the robot, you will do all of your coding, git work, etc 
on your dev comptuer. You then have a few options for getting your code onto the 
robot. The recomended approach is to use lsycnd which does live file updating.
You will need to make a copy of the file `syncConfig.lua` which should be named
`mySyncConfig.lua`. You can then use it by running `lsyncd mySyncConfig.lua`. 
You can also use rsync or SCP. This allows us to keep the robot 
clean from user specific details. 

To test your code, you can SSH into the robot to run things. It is recommended
that you start all of your code in tmux to allow it to run even if your network 
connection drops. You can find instructions for tmux at the 
[tmux reference](https://tmuxcheatsheet.com/). When you change code, remember
to run `cd ~/catkin_ws && catkin_make` on the robot machine.  

## Testing hardware
### D435
Once everythign is installed, plugin the camera and run 
`roslaunch realsense2_camera rs_aligned_depth.launch` Then open RVIZ on your dev
computer and you can
subscribe to the feed. You can use `rosrun rqt_reconfigure rqt_reconfigure` to 
change some basic parameters. 

To visualize a pointcloud, run `roslaunch vision pointcloud_demo_cam.launch` on
the camera computer and `roslaunch vision pointcloud_demo_viz.launch` on your
dev computer. 

You can also test with the more standardized rgbd style topics by running 
`roslaunch realsense2_camera rs_rgbd.launch` and looking at the results in RViZ
where you can add a point cloud. Be sure to set the "Fixed Frame" to be the
camera link.

If you want to tinker with frame sizes and rates, take a look at the supported 
profiles by running `rs-enumerate-devices`. This is also a great way to check 
whether the device is actually recognized as being USB 3.0. If you find that it 
is shown as a USB 2 device, unplug the camera and plug it back in. There is a 
known issue with the stock cable where the type C side only works in one direction,
so if it isn't working, try flipping it over. TODO: replace cable
TODO: implement unplug replug in code: https://unix.stackexchange.com/questions/234581/disconnect-and-reconnect-usb-port-via-cli

## Collecting Data
### Simple video / depth data
To just collect video and depth data you should test the camera as shwon above,
create a data directory under home `mkdir ~/data` then run collect_camera_data 
with an appropriate trial name 
`roslaunch vision collect_camera_data.launch trial_name:=<name of your trial>`
Your data files can then be accessed at `~/data`