<?php require_once 'controller.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width">
    <meta name="mobile-web-app-capable" content="yes">
    <title>Gifigy</title>
    <link rel="stylesheet" href="main.css">
</head>
<body>
    <div class="page">
        <video id="inputVideo" class="live" autoplay loop></video>
        <canvas id="inputCanvas" width="320" height="240" style="display:none"></canvas>
        <div class="submit-form-wrapper">
            <form class="submit-form" style="display: none;">
                    <label>Who are you people?
                        <input type="text" class="usernames" name="usernames" placeholder="<?php echo implode(', ', $random_placeholder_usernames); ?>">
                    </label>
                    <input type="hidden" class="photo-data" name="photo-data">
                    <button type="button" class="discard">Discard</button>
                    <button type="submit">Post</button>
            </form>
        </div>
        <div class="loading-wrapper">
            <div class="loading-icon"></div>
        </div>
    </div>
    <script type="text/JavaScript" src="js/lib/jquery-2.1.1.min.js"></script>
    <script type="text/JavaScript" src="js/lib/headtrackr.js"></script>
    <script type="text/JavaScript" src="js/lib/gifshot.min.js"></script>
    <script type="text/JavaScript" src="js/lib/spin.min.js"></script>
    <script type="text/JavaScript" src="js/app.js"></script>
</body>
</html>
