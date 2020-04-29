#!/usr/bin/env python

"""A wrapper for the move robot action server

In hindsight using an action server might not have been the best idea.
In general it is hard to handle disconnects and reconnects and the simple
action server doesn't play well with multiple clients. So wrapping it up
here.

Attaches to:
    - /move/* all of the action server stuf

Publishes:
    - /move_wrapper/status
        - available
        - unnavailable
    - /move_wrapper/current_goal
    - /move_wrapper/current_step

Subscribes:
    - /move_wrapper/new_goal

These will not allow robust response to the client
who sends a command like the action server system does.
However, this will allow multiple clients to work together.
"""
import rospy
from std_msgs.msg import String


class MoveWrapper(object):

    def__init__(self):
        rospy.init_node('move_werapper')

        # Publishers
        self.status_pub = rospy.Publisher(
            '/move_wrapper/state', String, queue_size=1, latch=True)
        self.current_goal_pub = rospy.Publisher
