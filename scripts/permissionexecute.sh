#!/bin/bash

# -----------------------------------------------------------------------------
# Maintained by: Debjyoti Shit
# Description: Giving execute permissions to all .sh files in the current directory and restricting permissions to prevent copying or modification.
# -----------------------------------------------------------------------------

echo "Making all .sh files executable..."
chmod +x *.sh

echo "Restricting permissions to prevent copying or modification..."
chmod go-rwx *.sh

echo "Permissions updated successfully! All .sh files are now executable and restricted from being copied or modified."
