#include "realsense2_camera/Extrinsics.h"
#include "sensor_msgs/Image.h"
#include "sensor_msgs/CameraInfo.h"
#include <librealsense2/rs.hpp>
#include <rosbag/bag.h>
#include <rosbag/view.h>
#include "ros/ros.h"
#include <ros/console.h>


int main(int argc, char **argv) {
	ros::init(argc, argv, "synth_dem");
	//ros::NodeHandle nh;

    std::string fn;
	ros::param::get("~bag_file", fn);
    ROS_INFO_STREAM("Working on bag file: "<<fn);

    rosbag::Bag bag;
	bag.open(fn);
}
