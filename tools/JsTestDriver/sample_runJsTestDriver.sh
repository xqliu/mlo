#!/bin/bash
# directory to write output XML (if this doesn't exist, the results will not be generated!)

# This folder should be the same as the property 
OUTPUT_DIR="../../../target/qa/JsTestDriver/report/xml"

XVFB=`which Xvfb`
if [ "$?" -eq 1 ];
then
    echo "Xvfb not found."
    exit 1
fi

FIREFOX=`which firefox`
if [ "$?" -eq 1 ];
then
    echo "Firefox not found."
    exit 1
fi

$XVFB :99 -ac &    # launch virtual framebuffer into the background
PID_XVFB="$!"      # take the process ID
export DISPLAY=:99 # set display to use that of the xvfb

# run the tests
java -jar ../lib/JsTestDriver.jar --config jsTestDriver.conf --port 4224 --browser $FIREFOX --tests all --testOutput $OUTPUT_DIR

kill $PID_XVFB     # shut down xvfb (firefox will shut down cleanly by JsTestDriver)
echo "Done."
