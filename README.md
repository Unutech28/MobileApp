# Curio App Stella

CurioTM™ is a state-of-the-art Digital Therapeutics (DTx) platform that
delivers evidence-based therapeutic interventions to patients. It gathers,
studies and analyses multiple data points of a patient’s physical, mental
and behavioral traits during the treatment and customizes interventions that
evolve as the program progresses.

RCT_stella_2.0 is the curio health mobile code that we are converting with
new designs and applying hippa points here.

## Getting Started

#### 1. Clone and Install

```bash
# Clone the repo
git clone https://github.com/ravik2015/RNStarterKitWix.git

# Navigate to clonned folder and Install dependencies
cd RNStarterKitWix && yarn install

# Install Pods
cd ios && pod install
```

#### 2. Open RNS in your iOS simulator

Run this command to start the development server and to start your app on iOS simulator:

```
yarn run:ios
```

Or, if you prefer Android:

```
yarn run:android

###### 3.
Modify react-native-circular-slider lib. Inside node modules ClockFace.js and CircularSlider.js file.
remove PropTypes from react
add import PropTypes from 'prop-types'
```

<!-- node_modules > react-native > Libraries > Images > RCTUIImageViewAnimated.m search for if (_currentFrame) -->

# use function below

<!-- if (_currentFrame) {
    layer.contentsScale = self.animatedImageScale;
    layer.contents = (__bridge id)_currentFrame.CGImage;
  } else {
    [super displayLayer:layer];
  } -->


# build create for QA env without encryption and decryption

# Note -> while creating builds take care to change below things
  1.Check BASE_URL, IMAGE_URL, SOCKET_URL
  2.Check PRODUCT_TYPE
  3.Change current date inside APP Info module
  4.For iOS -> change display name, build number, App Icon source, Launch screen files
  5.Select particular build schema then archive.