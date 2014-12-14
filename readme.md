Gifigy
======

Gifigy is an open-source, web-based GIF photo booth that uses space-age face detection technology to create GIFs in your browser and post them to [Tumblr](https://tumblr.com),  (nearly) hands-free!

How to Gifigy
-------------
1. Walk up to the gifigy booth
2. Make eye-contact with the camera
3. Enter your Tumblr username if you'd like to be tagged in the Tumblr post
4. Click `Post`
5. Compulsively check your Tumblr notifications for a mention, like the attention-starved millenial you are

Gifigy uses [headtrackr](https://github.com/auduno/headtrackr) for face detection, [gifshot](https://github.com/yahoo/gifshot) for GIF rendering, and the official [tumblr.php](https://github.com/tumblr/tumblr.php) API wrapper.

Server Requirements
-------------------
* PHP 5.3 (Probably?)
* Apache or whatever you want
* [Composer](https://getcomposer.org)

Client Device Requirements
--------------------------
* A built-in camera or USB webcam
* A browser that supports HTML5's [`getUserMedia()`](https://developer.mozilla.org/en-US/docs/NavigatorUserMedia.getUserMedia) and [`canvas`](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) APIs such as Chrome, Firefox, or Opera (Not currently supported on any iOS device)

Installation
------------
1. Clone this repo into a document root: `git clone https://github.com/JoeAnzalone/Gifigy.git`
2. Install [Composer](https://getcomposer.org/)
3. Run `composer install`
4. [Register a new Tumblr oAuth app](https://www.tumblr.com/oauth/register)
5. Grab your user tokens from [Tumblr's API console](https://api.tumblr.com/console)
6. Copy `config.php.sample` to `config.php`
7. Add your oAuth keys, tokens, and blog name to `config.php`

License
-------
*Gifigy* is open-sourced software licensed under the BSD 3-Clause license.
