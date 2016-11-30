<?php
require_once('TwitterAPIExchange.php');

$settings = array(
    'oauth_access_token' => "841093038-zry6cfUTTKd3TKqdKfA4kqd2tiRDaxX31NBDolLu",
    'oauth_access_token_secret' => "tHEfOrOAenyPZgvGEkhwTrevTltUfFSXNKHq1HLYZcwdV",
    'consumer_key' => " jn9iAkFYzDMZ61WxcEOE7uGwy",
    'consumer_secret' => "JvH9jl8AJL7nwtKIVh96ZhoEfMwvjQdvHm8Ou7c9F13i5wiHzq"
);

$url = "https://api.twitter.com/1.1/search/tweets.json?";

$requestMethod = "GET";

$getfield = '?q=%23squirrels&count=20';

$twitter = new TwitterAPIExchange($settings);
echo $twitter->setGetfield($getfield)
    ->buildOauth($url, $requestMethod)
    ->performRequest();
?>