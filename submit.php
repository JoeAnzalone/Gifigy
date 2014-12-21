<?php

require_once 'vendor/autoload.php';
require_once 'config.php';

$client = new Tumblr\API\Client($config['consumerKey'], $config['consumerSecret']);
$client->setToken($config['token'], $config['tokenSecret']);

$photoData = $_POST['photo_data'];
$usernames = explode(',', $_POST['usernames']);
$usernames = array_filter($usernames);

$photoFilename = 'temp.gif';
$photoData = file_get_contents($photoData);
file_put_contents($photoFilename, $photoData);
$photoData = $photoFilename;

foreach ($usernames as $name) {
    $name = trim($name);
    $name = htmlspecialchars($name);
    $name = substr($name, 0, 32);
    $usernames_html[] = '<a class="tumblelog">' . $name . '</a>';
}

$caption  = '';
if ($usernames_html) {
    $caption .= implode(', ', $usernames_html);
    $caption .= '<br><br>';
}
$caption .= '<small>From <a href="https://github.com/JoeAnzalone/Gifigy">Gifigy</a> with love ♥</small>';

$postData = array(
    'type'    => 'photo',
    'state'   => $config['defaultPostState'],
    'tags'    => '',
    'caption' => $caption,
    'link'    => '',
    'source'  => '',
    'data'    => $photoFilename,
);

$response = $client->createPost($config['blogName'], $postData);
