<?php
error_reporting(E_ERROR | E_WARNING);
require_once('TwitterAPIExchange.php');
require('CLOUD.PHP');

$settings = array(
    'oauth_access_token' => "841093038-e8jj6C7YxOLGX9xKvV2asLEY68ZMKl3PqdBjeckO",
    'oauth_access_token_secret' => "UCX6iw9j1OLNWHRvc160y2w3TROzVZQLTWok5gdPSYAah",
    'consumer_key' => "38Hzge4ZUfo27XhwvwUhmAZmi",
    'consumer_secret' => "ydw2MHDOCDoTEN7mvCqPfvLrn9piOZSxDgqRudTqbFuZ8ZbYTx"
);


$subject = $_POST['subject'];

$url = "https://api.twitter.com/1.1/search/tweets.json";

$requestMethod = "GET";

$getfield = "?q=%23$" . $subject . "&count=100";

$twitter = new TwitterAPIExchange($settings);
$string = json_decode($twitter->setGetfield($getfield)
    ->buildOauth($url, $requestMethod)
    ->performRequest(), $assoc = TRUE);

$text;

for ($i = 0; $i < 100; $i++) {
    $text .= $string['statuses'][$i]['text'];
}

$cloud = new PTagCloud(15);
$cloud->addTagsFromText($text);
$cloud->setWidth("300px");
$cloud->setBackgroundColor("white");
echo $cloud->emitCloud();
?>


