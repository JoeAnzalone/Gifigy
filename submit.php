<?php

require_once 'vendor/autoload.php';
require_once 'config.php';

$client = new Tumblr\API\Client($config['consumerKey'], $config['consumerSecret']);
$client->setToken($config['token'], $config['tokenSecret']);

$photoData = $_POST['photo_data'];

$photoFilename = 'temp.gif';
$photoData = file_get_contents($photoData);
file_put_contents($photoFilename, $photoData);
$photoData = $photoFilename;

$postData = array(
    'type'    => 'photo',
    'state'   => 'published',
    'tags'    => '',
    'caption' => 'From <a href="https://github.com/JoeAnzalone/Gifigy">Gifigy</a> with love ♥',
    'link'    => '',
    'source'  => '',
    'data'    => $photoFilename,
);

$response = $client->createPost($config['blogName'], $postData);
